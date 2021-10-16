import { useState } from "react"
import {
  Button,
} from 'carbon-components-react'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForEthBalance, waitForMarket, waitForRates, waitForPrices, waitForLiquidations , getContractWaitFunction } from '../../slices/waitFor'
import { openModal } from '../../slices/modal'
import { numDisplay }  from '../../utils/'
import PositionMetadata from '../library/PositionMetadata'
import RelativeLoading from '../library/RelativeLoading'
import PositionNumberInput from '../library/PositionNumberInput'
import ErrorMessage, { reason } from '../library/ErrorMessage'
import { TransactionType } from '../../slices/transactions'
import { ProtocolContract } from '../../slices/contracts'
import ConnectWalletButton from '../utils/ConnectWalletButton';

const CreatePosition = () => {
  const dispatch = useAppDispatch()

  const liquidations = waitForLiquidations(selector, dispatch)
  const hueBalance = waitForHueBalance(selector, dispatch)
  const priceInfo = waitForPrices(selector, dispatch)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const marketContract = getContractWaitFunction(ProtocolContract.Market)(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0.0)

  const dataNull =
    liquidations === null ||
    hueBalance === null ||
    priceInfo === null ||
    market === null ||
    rates === null ||
    marketContract === null ||
    userEthBalance === null

  const collateralization = dataNull ? 0 : (collateralCount * priceInfo.ethPrice) / debtCount
  const collateralizationDisplay = dataNull ? '-%' : numDisplay(collateralization * 100, 0) + '%'

  const liquidationPrice = dataNull ? 0 : (debtCount * market.collateralizationRequirement) / (collateralCount)
  const liquidationPriceDisplay = dataNull ? '-' : numDisplay(liquidationPrice, 0)

  const totalLiquidationIncentive = dataNull ? 0 : (liquidations.discoveryIncentive + liquidations.liquidationIncentive - 1) * 100

  const interestRate = dataNull ? 0 : (rates.positiveInterestRate ? rates.interestRateAbsoluteValue : -rates.interestRateAbsoluteValue) * 100
  const interestRateDisplay = dataNull ? '-%' : numDisplay(interestRate, 2) + '%'

  const failures: {[key in string]: reason} = dataNull ? {} : {
    noCollateral: {
      message: 'No collateral.',
      failing: collateralCount === 0 || isNaN(collateralCount),
      silent: true,
    },
    invalidDebt: {
      message: 'Invalid debt amount.',
      failing: isNaN(debtCount),
      silent: true,
    },
    notBigEnough: {
      message: 'Position has less than ' + numDisplay(market.minPositionSize) + ' Hue.' ,
      failing: 0 < debtCount && debtCount < market.minPositionSize,
    },
    undercollateralized: {
      message: 'Position has a collateralization less than ' + numDisplay(market.collateralizationRequirement * 100) + '%.',
      failing: collateralization < market.collateralizationRequirement,
    },
    insufficientEth: {
      message: 'Connected wallet does not have enough Eth.',
      failing: userEthBalance - collateralCount < 0,
    }
  }

  const failureReasons: reason[] = Object.values(failures)
  const isFailing = failureReasons.filter(reason => reason.failing).length > 0

  const openCreatePositionDialog = () => {
    dispatch(openModal({
      args: {
        type: TransactionType.CreatePosition,
        collateralCount,
        debtCount,
        Market: marketContract!,
      },
      ethPrice: priceInfo!.ethPrice,
      liquidationPrice,
    }))
  }

  return (
    <div style={{position: 'relative'}}>
      <RelativeLoading show={userAddress !== null && dataNull} />
      <LargeText>
        I want to create a position with
        <PositionNumberInput
          id="collateralInput"
          action={(value: number) => setCollateralCount(value)}
          value={collateralCount}
        />
        Eth of Collateral and
        <PositionNumberInput
          id="debtInput"
          action={(value: number) => setDebtCount(value)}
          value={debtCount}
        />
        Hue of debt with a {interestRateDisplay} interest rate that will vary due to market forces.
      </LargeText>
      <div style={{marginTop: 36, marginBottom: 30}}>
        <PositionMetadata items={[
          {
            title: 'Min position size',
            value: (dataNull ? '-' : numDisplay(market.minPositionSize)) + ' Hue',
            failing: dataNull ? false : failures.notBigEnough.failing,
          },{
            title: 'Collateralization Ratio',
            value: collateralizationDisplay,
            failing: dataNull ? false : failures.undercollateralized.failing,
          },{
            title: 'New Wallet Eth Balance',
            value: dataNull ? '-' : numDisplay(userEthBalance - collateralCount),
            failing: dataNull ? false : failures.insufficientEth.failing,
          },{
            title: 'New Wallet Hue Balance',
            value: dataNull ? '-' : numDisplay(hueBalance.userBalance + debtCount)
          },
        ]} />
      </div>
      <LargeText>
        Eth is currently <Bold>{dataNull ? '-' : numDisplay(priceInfo.ethPrice, 0)}</Bold> Hue.
        If the price of Eth falls below <Bold>{liquidationPriceDisplay}</Bold> Hue
        I could lose <Bold>{numDisplay(totalLiquidationIncentive, 0)}%</Bold> or more of my position value in Eth to liquidators.
      </LargeText>
      <div style={{marginTop: 32, marginBottom: 32}}>
        {userAddress === null ? (
          <ConnectWalletButton />
        ) : (
          <Button onClick={openCreatePositionDialog} disabled={isFailing}>
            Create Position
          </Button>
        )}
      </div>
      <ErrorMessage reasons={failureReasons} />
    </div>
  )
}

export default CreatePosition
