import getContract, { getMulticallContract } from '../../utils/getContract'
import { Rates } from '@trustlessfi/typechain/'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
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
              positiveInterestRate: rc.Boolean,
              interestRateAbsoluteValue: rc.BigNumberUnscale,
              getReferencePools: rc.StringArray,
            },
          )
        }
      )

      return {
        interestRate:
          ratesInfo.positiveInterestRate
          ? ratesInfo.interestRateAbsoluteValue
          : -ratesInfo.interestRateAbsoluteValue,
        referencePools: ratesInfo.getReferencePools,
      }
    },
})

export default ratesInfoSlice
