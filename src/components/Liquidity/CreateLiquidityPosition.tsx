import { Button } from 'carbon-components-react'
import { Subtract16, Add16 } from '@carbon/icons-react';
import { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getPoolCurrentDataWaitFunction, waitForRewards, waitForPoolsMetadata , getContractWaitFunction , waitForEthBalance } from '../../slices/waitFor'
import { approvePoolToken } from '../../slices/poolCurrentData'
import { tokenMetadata } from '../../slices/poolsMetadata'
import { tokenData } from '../../slices/poolCurrentData'
import { openModal } from '../../slices/modal'
import {
  numDisplay,
  getSpaceForFee,
  tickToPrice,
  getAmount1ForAmount0,
  getAmount0ForAmount1,
  bnf,
  mnt,
  unscale,
  upperCaseWord,
} from '../../utils'
import { nearestUsableTick } from '@uniswap/v3-sdk'
import PositionNumberInput from '../library/PositionNumberInput'
import RelativeLoading from '../library/RelativeLoading'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { ProtocolContract } from '../../slices/contracts/index';
import GenericApprovalButton from '../utils/GenericApprovalButton';
import { reason } from '../library/ErrorMessage';
import ConnectWalletButton from '../utils/ConnectWalletButton';
import PositionMetadata from '../library/PositionMetadata';
import ErrorMessage from '../library/ErrorMessage';
import { TransactionType } from '../../slices/transactions/index';

// TODO put into utils?
const tickToPriceDisplay = (tick: number) => numDisplay(tickToPrice(tick))

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

const CreateLiquidityPosition = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useAppDispatch()

  const trustlessMulticallAddress = getContractWaitFunction(ProtocolContract.TrustlessMulticall)(selector, dispatch)
  const rewardsAddress = getContractWaitFunction(ProtocolContract.Rewards)(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const rewardsInfo = waitForRewards(selector, dispatch)
  const poolsMetadata = waitForPoolsMetadata(selector, dispatch)
  const poolCurrentData = getPoolCurrentDataWaitFunction(poolAddress)(selector, dispatch)
  const chainID = selector(state => state.chainID.chainID)

  const pool = poolsMetadata === null ? null : poolsMetadata[poolAddress]

  const instantTick = poolCurrentData !== null ? poolCurrentData.instantTick : null
  const tick = poolCurrentData !== null ? poolCurrentData.twapTick : null
  const price0 = tickToPriceDisplay(tick === null ? 0 : tick)
  const price1 = tickToPriceDisplay(tick === null ? 0 : -tick)

  const spacing = getSpaceForFee(pool === null ? 0 : pool.fee)
  const nearestTick = nearestUsableTick(tick === null ? 0 : tick, spacing)

  const nextLowest = tick === null ? null : nearestTick < tick ? nearestTick : nearestTick - spacing
  const nextHighest = tick === null ? null : nearestTick > tick ? nearestTick : nearestTick + spacing

  const [inverted, setInverted] = useState(false)
  const [tickLower, setTickLower] = useState(0)
  const [tickUpper, setTickUpper] = useState(0)
  const [token0Amount, setToken0Amount] = useState(0)
  const [token1Amount, setToken1Amount] = useState(0)
  const [token0AdjustedLast, setToken0AdjustedLast] = useState(true)

  const isDataLoadedRef = useRef(false)

  useEffect(() => {
    if (!isDataLoadedRef.current && tick !== null && nextLowest !== null && nextHighest !== null) {
      isDataLoadedRef.current = true

      setInverted(tick < 0)
      setTickLower(nextLowest)
      setTickUpper(nextHighest)
    }
  })

  const token0IsWeth = pool === null || rewardsInfo === null ? false : pool.token0.address === rewardsInfo.weth
  const token1IsWeth = pool === null || rewardsInfo === null ? false : pool.token1.address === rewardsInfo.weth

  const displaySymbol = (value: string) => value.toLowerCase() === 'weth' ? 'Eth' : upperCaseWord(value)

  const token0Symbol = pool === null ?  '-' : displaySymbol(pool.token0.symbol)
  const token1Symbol = pool === null ?  '-' : displaySymbol(pool.token1.symbol)

  const poolName = pool === null ? '-' : token0Symbol + ':' + token1Symbol
  const liquidationPenalty = rewardsInfo === null ? '-' : numDisplay(rewardsInfo.liquidationPenalty * 100)

  const toggleInverted = () => setInverted(!inverted)

  const updateLowerTick = (newTick: number) => {
    if (tick === null || tick <= newTick) return
    setTickLower(newTick)
    token0AdjustedLast
      ? setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(token0Amount)), instantTick!, newTick, tickUpper)))
      : setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(token1Amount)), instantTick!, newTick, tickUpper)))
  }
  const updateUpperTick = (newTick: number) => {
    if (tick === null || tick >= newTick) return
    setTickUpper(newTick)
    token0AdjustedLast
      ? setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(token0Amount)), instantTick!, tickLower, newTick)))
      : setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(token1Amount)), instantTick!, tickLower, newTick)))
  }
  const updateToken0Amount = (amount0: number) => {
    if (isNaN(amount0)) return
    setToken0AdjustedLast(true)
    setToken0Amount(amount0)
    setToken1Amount(unscale(getAmount1ForAmount0(bnf(mnt(amount0)), instantTick!, tickLower, tickUpper)))
  }
  const updateToken1Amount = (amount1: number) => {
    if (isNaN(amount1)) return
    setToken0AdjustedLast(false)
    setToken1Amount(amount1)
    setToken0Amount(unscale(getAmount0ForAmount1(bnf(mnt(amount1)), instantTick!, tickLower, tickUpper)))
  }

  const getApprovalButton = (tokenIndex: 0 | 1, token?: tokenMetadata, tokenData?: tokenData, ) => {
    if (
      token === undefined
      || tokenData === undefined
      || rewardsAddress === null
      || userAddress === null
      || pool === null
      || token.symbol.toLowerCase() === 'weth') return null

    return (
      <GenericApprovalButton
        key={token.address}
        style={{marginRight: 16}}
        approval={tokenData.rewardsApproval}
        tokenSymbol={tokenIndex === 0 ? token0Symbol : token1Symbol}
        onApprove={() => dispatch(approvePoolToken({
          tokenAddress: token.address,
          Rewards: rewardsAddress,
          tokenIndex,
          poolAddress,
          userAddress,
        }))}
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


  const openCreateLiquidityPositionDialog = () => {
    const amount0Desired = token0Amount
    // TODO tighter or custom range
    const amount0Min = amount0Desired * 0.95
    const amount1Desired = token1Amount
    // TODO tighter or custom range
    const amount1Min = amount1Desired * 0.95

    if(!chainID) {
      return
    }

    dispatch(openModal({
      args: {
        type: TransactionType.CreateLiquidityPosition,
        token0: poolCurrentData!.token0.address,
        token0Decimals: pool!.token0.decimals,
        token0IsWeth,
        token1: poolCurrentData!.token1.address,
        token1Decimals: pool!.token1.decimals,
        token1IsWeth,
        fee: pool!.fee,
        chainID,
        tickLower,
        tickUpper,
        amount0Desired,
        amount0Min,
        amount1Desired,
        amount1Min,
        TrustlessMulticall: trustlessMulticallAddress!,
        Rewards: rewardsAddress!,
      },
      token0Symbol,
      token1Symbol,
    }))
  }


  return (
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
        {userAddress === null ? (
          <ConnectWalletButton />
        ) : (
          <Button onClick={openCreateLiquidityPositionDialog} disabled={isFailing}>
            Create Liquidity Position
          </Button>
        )}
      </div>
      <ErrorMessage reasons={failureReasons} />
    </div>
  )
}

export default CreateLiquidityPosition
