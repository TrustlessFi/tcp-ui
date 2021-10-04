import { ratesInfo } from '../../../slices/rates'
import { marketInfo } from '../../../slices/market'
import { systemDebtInfo } from '../../../slices/systemDebt'
import { balanceInfo } from '../../../slices/balances'


export const getAPR = (args: {
  market: marketInfo,
  rates: ratesInfo,
  sdi: systemDebtInfo,
  hueBalance: balanceInfo,
}) => {
  if (args.market.interestPortionToLenders === 0) return 0
  const totalInterestRate = (args.rates.positiveInterestRate ? args.rates.interestRateAbsoluteValue : 0)
  if (totalInterestRate === 0) return 0

  const totalLendYearlyIncrease = totalInterestRate * args.market.interestPortionToLenders * args.sdi.debt
  const lentHue = args.hueBalance.balances.Accounting
  if (lentHue === 0 || lentHue === undefined) return 0
  return totalLendYearlyIncrease / lentHue
}
