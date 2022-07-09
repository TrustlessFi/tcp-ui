import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice } from '../'
import { Market } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { mnt, unscale } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'

export interface marketInfo {
  lastPeriodGlobalInterestAccrued: number
  collateralizationRequirement: number
  minPositionSize: number
  twapDuration: number
  interestPortionToLenders: number
  periodLength: number
  firstPeriod: number
  valueOfLendTokensInHue: number
}

const marketSlice = createChainDataSlice({
  name: 'market',
  dependencies: ['contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.marketInfo,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const market = getContract<Market>(ProtocolContract.Market, args.contracts.Market)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { marketInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          marketInfo: oneContractManyFunctionMC(
            market,
            {
              lastPeriodGlobalInterestAccrued: [],
              collateralizationRequirement: [],
              minPositionSize: [],
              twapDuration: [],
              interestPortionToLenders: [],
              periodLength: [],
              firstPeriod: [],
              valueOfLendTokensInHue: [mnt(1)]
            },
          )
        }
      )

      return {
        lastPeriodGlobalInterestAccrued: marketInfo.lastPeriodGlobalInterestAccrued.toNumber(),
        collateralizationRequirement: unscale(marketInfo.collateralizationRequirement),
        minPositionSize: unscale(marketInfo.minPositionSize),
        twapDuration: marketInfo.twapDuration,
        interestPortionToLenders: unscale(marketInfo.interestPortionToLenders),
        periodLength: marketInfo.periodLength.toNumber(),
        firstPeriod: marketInfo.firstPeriod.toNumber(),
        valueOfLendTokensInHue: unscale(marketInfo.valueOfLendTokensInHue),
      }
    },
})

export default marketSlice
