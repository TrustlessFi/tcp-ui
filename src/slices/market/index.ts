import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice, CacheDuration } from '../'
import { Market } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { mnt } from '../../utils'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'

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

const partialMarketSlice = createChainDataSlice({
  name: 'market',
  dependencies: ['contracts', 'trustlessMulticall'],
  cacheDuration: CacheDuration.SHORT,
  reducers: {
    clearMarketInfo: (state) => {
      state.value = null
    },
  },
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'trustlessMulticall'>) => {
      const market = getContract(args.contracts[ProtocolContract.Market], ProtocolContract.Market) as Market
      const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

      const { marketInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          marketInfo: oneContractManyFunctionMC(
            market,
            {
              lastPeriodGlobalInterestAccrued: rc.BigNumberToNumber,
              collateralizationRequirement: rc.BigNumberUnscale,
              minPositionSize: rc.BigNumberUnscale,
              twapDuration: rc.Number,
              interestPortionToLenders: rc.BigNumberUnscale,
              periodLength: rc.BigNumberToNumber,
              firstPeriod: rc.BigNumberToNumber,
              valueOfLendTokensInHue: rc.BigNumberUnscale,
            },
            {
              valueOfLendTokensInHue: [mnt(1)]
            }
          )
        }
      )

      return marketInfo
    },
})

export const { clearMarketInfo } = partialMarketSlice.slice.actions

export const marketSlice = {
  ...partialMarketSlice,
  stateSelector: (state: RootState) => state.market
}

export default partialMarketSlice.slice.reducer
