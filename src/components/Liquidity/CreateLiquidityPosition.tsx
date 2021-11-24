import { Button } from 'carbon-components-react'
import { useParams } from "react-router";
import { Subtract16, Add16 } from '@carbon/icons-react';
import { useEffect } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getPoolCurrentDataWaitFunction, waitForRewards, waitForPoolsMetadata , waitForContracts , waitForEthBalance } from '../../slices/waitFor'
import { startCreate } from '../../slices/liquidityPositionsEditor'
import { tokenMetadata } from '../../slices/poolsMetadata'
import { tokenData } from '../../slices/poolCurrentData'
import {
  numDisplay,
  getSpaceForFee,
  tickToPriceDisplay,
  displaySymbol,
  getPoolName,
} from '../../utils'
import usePoolDisplayInfo from '../../hooks/usePoolDisplayInfo';
import useLiquidityPositionUpdates from '../../hooks/useLiquidityPositionUpdates';
import Breadcrumbs from '../library/Breadcrumbs'
import PositionNumberInput from '../library/PositionNumberInput'
import RelativeLoading from '../library/RelativeLoading'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { reason } from '../library/ErrorMessage';
import PositionMetadata from '../library/PositionMetadata';
import ErrorMessage from '../library/ErrorMessage';
import { TransactionType } from '../../slices/transactions/index';
import CreateTransactionButton from '../utils/CreateTransactionButton';

interface MatchParams {
  poolAddress: string
}

const TickSelector = ({
  tick,
  spacing,
  inverted,
  updateTick,
}: {
  tick: number
  spacing: number
  inverted: boolean
  updateTick: (newTick: number) => void
}) => (
  <span style={{marginLeft: 8, marginRight: 8}}>
    {tickToPriceDisplay(inverted ? -tick : tick)}
    <Button
      style={{marginLeft: 8}}
      size="sm"
      hasIconOnly
      kind="secondary"
      renderIcon={Subtract16}
      iconDescription="reduce amount"
      onClick={() => updateTick(inverted ? tick + spacing : tick - spacing)}
    />
    <Button
      size="sm"
      hasIconOnly
      kind="secondary"
      renderIcon={Add16}
      iconDescription="increase amount"
      onClick={() => updateTick(inverted ? tick - spacing : tick + spacing)}
    />
  </span>
)

TickSelector.defaultProps = {min: false}

const CreateLiquidityPosition = () => {
  const dispatch = useAppDispatch()

  const { poolAddress }: MatchParams = useParams()

  const contracts = waitForContracts(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const rewardsInfo = waitForRewards(selector, dispatch)
  const poolsMetadata = waitForPoolsMetadata(selector, dispatch)
  const poolCurrentData = getPoolCurrentDataWaitFunction(poolAddress)(selector, dispatch)

  const chainID = selector(state => state.chainID.chainID)
  const trustlessMulticall = selector(state => state.chainID.trustlessMulticall)

  const pool = (!poolAddress || !poolsMetadata) ? null : poolsMetadata[poolAddress]

  const tick = poolCurrentData ? poolCurrentData.twapTick : null
  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const spacing = getSpaceForFee(pool === null ? 0 : pool.fee)

  const {
    inverted, setInverted,
    tickLower, setTickLower,
    tickUpper, setTickUpper
  } = usePoolDisplayInfo(pool, tick)

  const {
      token0Amount,
      token1Amount,
      updateLowerTick,
      updateUpperTick,
      updateToken0Amount,
      updateToken1Amount
  } = useLiquidityPositionUpdates(tickLower, setTickLower, tickUpper, setTickUpper, poolCurrentData, tick)

  useEffect(() => {
    if(poolAddress) {
      startCreate({ poolAddress })
    }
  }, [poolAddress])

  if(!poolAddress || !poolCurrentData) {
    return <span />
  }

  const token0IsWeth = pool === null || rewardsInfo === null ? false : pool.token0.address === rewardsInfo.weth
  const token1IsWeth = pool === null || rewardsInfo === null ? false : pool.token1.address === rewardsInfo.weth

  const token0Symbol = displaySymbol(pool?.token0.symbol)
  const token1Symbol = displaySymbol(pool?.token1.symbol)
  const poolName = getPoolName(pool)
  const liquidationPenalty = rewardsInfo === null ? '-' : numDisplay(rewardsInfo.liquidationPenalty * 100)

  const toggleInverted = () => setInverted(!inverted)

  const getApprovalButton = (tokenIndex: 0 | 1, token?: tokenMetadata, tokenData?: tokenData, ) => {
    if (token !== undefined && token.symbol.toLowerCase() === 'weth') return null

    const disabled =
      token === undefined
      || tokenData === undefined
      || contracts === null
      || userAddress === null
      || pool === null
      || chainID === null
      || trustlessMulticall === null
      || tokenData.rewardsApproval.approved

    const symbol = tokenIndex === 0 ? token0Symbol : token1Symbol

    return (
      <CreateTransactionButton
        key={tokenIndex}
        style={{marginRight: 8}}
        title={"Approve " + symbol}
        disabled={disabled}
        showDisabledInsteadOfConnectWallet={true}
        shouldOpenTxTab={false}
        txArgs={{
          type: TransactionType.ApprovePoolToken,
          tokenAddress: token!.address,
          Rewards: contracts!.Rewards,
          poolAddress,
          symbol,
        }}
      />
    )
  }

  const userToken0Balance =
    token0IsWeth
    ? (userEthBalance === null ? 0 : userEthBalance)
    : (poolCurrentData === null ? 0 : poolCurrentData.token0.userBalance)

  const userToken1Balance =
    token1IsWeth
    ? (userEthBalance === null ? 0 : userEthBalance)
    : (poolCurrentData === null ? 0 : poolCurrentData.token1.userBalance)


  const token0NeedsToBeApproved =
    poolCurrentData === null || token0IsWeth
      ? false
      : token0Amount > 0 && !poolCurrentData.token0.rewardsApproval.approved
  const token1NeedsToBeApproved =
    poolCurrentData === null || token1IsWeth
      ? false
      : token1Amount > 0 && !poolCurrentData.token1.rewardsApproval.approved


  const failures: {[key in string]: reason} = {
    noop: {
      message: '',
      failing: isNaN(token0Amount) || token0Amount === 0 || isNaN(token1Amount) || token1Amount === 0,
      silent: true
    },
    insufficientToken0: {
      message: 'Not enough ' + token0Symbol + '.',
      failing: token0Amount > userToken0Balance,
    },
    insufficientToken1: {
      message: 'Not enough ' + token1Symbol + '.',
      failing: token1Amount > userToken1Balance,
    },
    token0NotApproved: {
      message: 'You must approve ' + token0Symbol,
      failing: token0NeedsToBeApproved,
    },
    token1NotApproved: {
      message: 'You must approve ' + token1Symbol,
      failing: token1NeedsToBeApproved,
    },
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const token0ApprovalButton = getApprovalButton(0, pool?.token0, poolCurrentData?.token0)
  const token1ApprovalButton = getApprovalButton(1, pool?.token1, poolCurrentData?.token1)

  const priceUnit =
    (inverted ? token0Symbol : token1Symbol) +
    ' per ' +
    (inverted ? token1Symbol : token0Symbol)

  const amount0Desired = token0Amount
  // TODO tighter or custom range
  const amount0Min = amount0Desired * 0.95
  const amount1Desired = token1Amount
  // TODO tighter or custom range
  const amount1Min = amount1Desired * 0.95

  return (
    <>
      <Breadcrumbs items={[{ text: 'Liquidity', href: '/liquidity' }, 'New']} />
      <div style={{position: 'relative'}}>
        <RelativeLoading show={poolCurrentData === null || pool === null || rewardsInfo === null} />
        <div style={{marginBottom: 16}}>
          <Button
            size="sm"
            onClick={toggleInverted}
            kind={inverted ? 'secondary' : 'primary'}>
            {token0Symbol}
          </Button>
          <Button
            size="sm"
            onClick={toggleInverted}
            kind={inverted ? 'primary' : 'secondary'}>
            {token1Symbol}
          </Button>
        </div>
        <LargeText>
          The current price for the
          {' '}{poolName}{' '}
          pool is {inverted ? price1 : price0} {priceUnit}.
          <div />
          I want to provide liquidity between the prices of
          <TickSelector
            tick={inverted ? tickUpper : tickLower}
            updateTick={inverted ? updateUpperTick : updateLowerTick}
            inverted={inverted}
            spacing={spacing}
          />
          and
          <TickSelector
            tick={inverted ? tickLower : tickUpper}
            updateTick={inverted ? updateLowerTick : updateUpperTick}
            inverted={inverted}
            spacing={spacing}
          />
          {priceUnit}, by depositing
          <PositionNumberInput
            id="token0Input"
            action={updateToken0Amount}
            value={token0Amount}
          />
          {token0Symbol} and
          <PositionNumberInput
            id="token1Input"
            action={updateToken1Amount}
            value={token1Amount}
          />
          {token1Symbol}.
          <div />
          If the {poolName} price moves outside of this price range, I could lose <Bold>{liquidationPenalty}%</Bold> or
          more of my position to liquidators.
        </LargeText>
        <div />
        <div style={{marginTop: 36, marginBottom: 30}}>
          <PositionMetadata items={[
            {
              title: 'New Wallet ' + token0Symbol + ' Balance',
              value: numDisplay(userToken0Balance - token0Amount),
              failing: userToken0Balance - token0Amount < 0,
            },{
              title: 'New Wallet ' + token1Symbol + ' Balance',
              value: numDisplay(userToken1Balance - token1Amount),
              failing: userToken1Balance - token1Amount < 0,
            }
          ]} />
        </div>
        {token0ApprovalButton}
        {token1ApprovalButton}
        <div style={{marginTop: 32, marginBottom: 32}}>
          <CreateTransactionButton
            disabled={isFailing}
            txArgs={{
              type: TransactionType.CreateLiquidityPosition,
              token0: poolCurrentData!.token0.address,
              token0Decimals: pool!.token0.decimals,
              token0IsWeth,
              token1: poolCurrentData!.token1.address,
              token1Decimals: pool!.token1.decimals,
              token1IsWeth,
              fee: pool!.fee,
              chainID: chainID!,
              tickLower,
              tickUpper,
              amount0Desired,
              amount0Min,
              amount1Desired,
              amount1Min,
              trustlessMulticall: trustlessMulticall!,
              Rewards: contracts!.Rewards,
            }}
          />
        </div>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>
  )
}

export default CreateLiquidityPosition
