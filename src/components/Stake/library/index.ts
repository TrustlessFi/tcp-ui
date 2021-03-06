import { marketInfo } from '../../../slices/market'
import { ratesInfo } from '../../../slices/rates'
import { sdi } from '../../../slices/systemDebt'
import { isZeroish, unscale } from '../../../utils'

export const getAPR = (args: {
  marketInfo: marketInfo,
  ratesInfo: ratesInfo,
  sdi: sdi,
  lentHue: number,
  additional?: number,
}) => {

  if (args.marketInfo.interestPortionToLenders === 0) return 0
  const totalInterestRate = args.ratesInfo.interestRate > 0 ? args.ratesInfo.interestRate : 0
  if (totalInterestRate === 0) return 0

  const totalLendYearlyIncrease = totalInterestRate * args.marketInfo.interestPortionToLenders * unscale(args.sdi.debt)

  const totalLentHue =
    (isZeroish(args.lentHue) ? 0 : args.lentHue) +
    (isZeroish(args.additional) ? 0 : args.additional!)

  return totalLentHue === 0 ? 0 : totalLendYearlyIncrease / totalLentHue
}
