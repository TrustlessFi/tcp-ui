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
  const lentHue = args.lentHue
  const additional = args.additional

  console.log({lentHue})
  if (args.marketInfo.interestPortionToLenders === 0) return 0
  const totalInterestRate = args.ratesInfo.interestRate > 0 ? args.ratesInfo.interestRate : 0
  if (totalInterestRate === 0) return 0


  const totalLendYearlyIncrease = totalInterestRate * args.marketInfo.interestPortionToLenders * unscale(args.sdi.debt)
  return (
    isZeroish(lentHue)
    ? 0
    : (
      isZeroish(additional)
      ? totalLendYearlyIncrease / lentHue
      : totalLendYearlyIncrease / (lentHue + additional!)
    )
  )
}
