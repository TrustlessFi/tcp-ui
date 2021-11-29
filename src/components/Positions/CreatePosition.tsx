import { useState } from "react"
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  waitForHueBalance,
  waitForEthBalance,
  waitForMarket,
  waitForRates,
  waitForPrices,
  waitForLiquidations,
  waitForContracts,
} from '../../slices/waitFor'
import { numDisplay }  from '../../utils/'
import PositionMetadata2 from '../library/PositionMetadata2'
import PositionNumberInput from '../library/PositionNumberInput'
import ErrorMessage, { reason } from '../library/ErrorMessage'
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../utils/CreateTransactionButton'
import TwoColumnDisplay from '../utils/TwoColumnDisplay'

const CreatePosition = () => {
  const dispatch = useAppDispatch()

  const liquidations = waitForLiquidations(selector, dispatch)
  const hueBalance = waitForHueBalance(selector, dispatch)
  const priceInfo = waitForPrices(selector, dispatch)
  const userEthBalance = waitForEthBalance(selector, dispatch)
  const market = waitForMarket(selector, dispatch)
  const rates = waitForRates(selector, dispatch)
  const contracts = waitForContracts(selector, dispatch)
  const userAddress = selector(state => state.wallet.address)

  const [collateralCount, setCollateralCount] = useState(0)
  const [debtCount, setDebtCount] = useState(0.0)

  const dataNull =
    liquidations === null ||
    hueBalance === null ||
    priceInfo === null ||
    market === null ||
    rates === null ||
    contracts === null ||
    userEthBalance === null

  const collateralization = dataNull ? 0 : (collateralCount * priceInfo.ethPrice) / debtCount
  const collateralizationDisplay = dataNull ? '-%' : numDisplay(collateralization * 100, 0) + '%'

  const liquidationPrice = dataNull ? 0 : (debtCount * market.collateralizationRequirement) / (collateralCount)
  const liquidationPriceDisplay = dataNull ? '-' : numDisplay(liquidationPrice, 0)

  const totalLiquidationIncentive = dataNull ? 0 : (liquidations.discoveryIncentive + liquidations.liquidationIncentive - 1) * 100

  const interestRate = dataNull ? 0 : (rates.positiveInterestRate ? rates.interestRateAbsoluteValue : -rates.interestRateAbsoluteValue) * 100
  const interestRateDisplay = dataNull ? '-%' : numDisplay(interestRate, 2) + '%'

  const ethPriceDisplay = dataNull ? '-' : numDisplay(priceInfo.ethPrice, 0)

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

  const metadataItems = [
    {
      title: 'Hue/Eth Current Price',
      value: ethPriceDisplay,
      failing: false,
    },{
      title: 'Hue/Eth Liquidation Price',
      value: liquidationPriceDisplay,
      failing: dataNull ? false : liquidationPrice >= priceInfo.ethPrice,
    },{
      title: 'Collateralization Ratio',
      value: collateralizationDisplay,
      failing: dataNull ? false : failures.undercollateralized.failing,
    },
  ]

  const paragraphDivider = <div style={{height: 32}} />

  const columnOne =
    <>
      <div style={{marginBottom: 8}}>
        Collateral Eth
      </div>
      <div style={{marginBottom: 8}}>
        <PositionNumberInput
          id="collateralInput"
          action={(value: number) => setCollateralCount(value)}
          value={collateralCount}
        />
      </div>
      <div style={{marginBottom: 8}}>
        Borrow Hue
      </div>
      <div>
        <PositionNumberInput
          id="debtInput"
          action={(value: number) => setDebtCount(value)}
          value={debtCount}
        />
      </div>
      <PositionMetadata2 items={metadataItems} />
      <div style={{marginTop: 8, marginBottom: 8}}>
        <CreateTransactionButton
          title="Confirm Position in Metamask"
          disabled={isFailing}
          txArgs={{
            type: TransactionType.CreatePosition,
            collateralCount,
            debtCount,
            Market: contracts === null ? '' : contracts.Market,
          }}
        />
      </div>
      <div style={{marginTop: 8}}>
        <ErrorMessage reasons={failureReasons} />
      </div>
    </>

  const columnTwo =
    <LargeText>
      You have {dataNull ? '-' : numDisplay(userEthBalance)} Eth in your wallet.

      {paragraphDivider}

      You want to create a position with {numDisplay(collateralCount)} Eth of collateral.
      In the same transaction, you want to borrow {numDisplay(debtCount)} Hue.
      The minimum amount you can borrow is {dataNull ? '-' : numDisplay(market.minPositionSize)} Hue
      to maintain liquidation incentives.

      {paragraphDivider}

      Hue debt currently carries a {interestRateDisplay} interest rate
        that will vary due to market forces.
      The price of Eth is currently {ethPriceDisplay} Hue. If the price of Eth falls
      below <Bold>{liquidationPriceDisplay}</Bold> Hue you could
      lose <Bold>{numDisplay(totalLiquidationIncentive, 0)}%</Bold> or more of your position value in Eth to liquidators.
    </LargeText>

  return (
    <TwoColumnDisplay
      columnOne={columnOne}
      columnTwo={columnTwo}
      loading={userAddress !== null && dataNull}
      breadCrumbItems={[{ text: 'Positions', href: '/' }, 'New']}
    />
  )
}

export default CreatePosition
