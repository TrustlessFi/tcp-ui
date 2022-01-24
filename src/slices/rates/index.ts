import getContract, { getMulticallContract } from '../../utils/getContract'
import { Rates } from '@trustlessfi/typechain/'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice } from '../'

export interface ratesInfo {
  positiveInterestRate: boolean
  interestRateAbsoluteValue: number
  referencePools: string[]
}

const ratesInfoSlice = createChainDataSlice({
  name: 'rates',
  dependencies: ['contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.ratesInfo,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const rates = getContract(args.contracts[ProtocolContract.Rates], ProtocolContract.Rates) as Rates
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
        positiveInterestRate: ratesInfo.positiveInterestRate,
        interestRateAbsoluteValue: ratesInfo.interestRateAbsoluteValue,
        referencePools: ratesInfo.getReferencePools,
      }
    },
})

export default ratesInfoSlice
