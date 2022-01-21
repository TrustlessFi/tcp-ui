import { FetchNodes } from '../../../slices/fetchNodes'


export const getAPR = (args: {
  marketInfo: FetchNodes['marketInfo'],
  ratesInfo: FetchNodes['ratesInfo'],
  sdi: FetchNodes['sdi'],
  lentHue: number,
}) => {
  if (args.marketInfo.interestPortionToLenders === 0) return 0
  const totalInterestRate = (args.ratesInfo.positiveInterestRate ? args.ratesInfo.interestRateAbsoluteValue : 0)
  if (totalInterestRate === 0) return 0

  const totalLendYearlyIncrease = totalInterestRate * args.marketInfo.interestPortionToLenders * args.sdi.debt
  if (args.lentHue === 0 || args.lentHue === undefined) return 0
  return totalLendYearlyIncrease / args.lentHue
}
