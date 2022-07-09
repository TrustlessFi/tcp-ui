import getContract, { getMulticallContract } from '../../utils/getContract'
import { Rates } from '@trustlessfi/typechain/'
import { unscale } from '../../utils'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, executeMulticalls } from '@trustlessfi/multicall'
import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface ratesInfo {
  interestRate: number
  referencePools: string[]
}

const ratesInfoSlice = createChainDataSlice({
  name: 'rates',
  dependencies: ['contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.ratesInfo,
  cacheDuration: CacheDuration.LONG,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const rates = getContract<Rates>(ProtocolContract.Rates, args.contracts.Rates)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { ratesInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          ratesInfo: oneContractManyFunctionMC(
            rates,
            {
              positiveInterestRate: [],
              interestRateAbsoluteValue: [],
              getReferencePools: [],
            },
          )
        }
      )



      return {
        interestRate:
          unscale(
            ratesInfo.positiveInterestRate
            ? ratesInfo.interestRateAbsoluteValue
            : ratesInfo.interestRateAbsoluteValue.mul(-1),
          ),
        referencePools: ratesInfo.getReferencePools,
      }
    },
})

export default ratesInfoSlice
