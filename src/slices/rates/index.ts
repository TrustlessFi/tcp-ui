import { RootState } from '../../app/store'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { Rates } from '@trustlessfi/typechain/'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'
import { thunkArgs } from '../fetchNodes'
import { createChainDataSlice } from '../'

export interface ratesInfo {
  positiveInterestRate: boolean
  interestRateAbsoluteValue: number
  referencePools: string[]
}

const partialRatesInfoSlice = createChainDataSlice({
  name: 'rates',
  dependencies: ['contracts', 'rootContracts'],
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

export const ratesInfoSlice = {
  ...partialRatesInfoSlice,
  stateSelector: (state: RootState) => state.rates
}

export default partialRatesInfoSlice.slice.reducer
