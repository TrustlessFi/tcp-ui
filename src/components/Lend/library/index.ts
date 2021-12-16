import { ratesInfo } from '../../../slices/rates'
import { marketInfo } from '../../../slices/market'
import { systemDebtInfo } from '../../../slices/systemDebt'


export const getAPR = (args: {
  market: marketInfo,
  rates: ratesInfo,
  sdi: systemDebtInfo,
  lentHue: number,
}) => {
  if (args.market.interestPortionToLenders === 0) return 0
  const totalInterestRate = (args.rates.positiveInterestRate ? args.rates.interestRateAbsoluteValue : 0)
  if (totalInterestRate === 0) return 0

  const totalLendYearlyIncrease = totalInterestRate * args.market.interestPortionToLenders * args.sdi.debt
  if (args.lentHue === 0 || args.lentHue === undefined) return 0
  return totalLendYearlyIncrease / args.lentHue
}
