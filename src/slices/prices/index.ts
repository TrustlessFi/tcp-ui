import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice } from '../'
import { Prices } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'

export interface pricesInfo { ethPrice: number }

const partialPricesSlice = createChainDataSlice({
  name: 'prices',
  dependencies: ['contracts', 'rootContracts', 'liquidationsInfo'],
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'liquidationsInfo'>) => {
      const prices = getContract(args.contracts[ProtocolContract.Prices], ProtocolContract.Prices) as Prices
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { ethPrice } = await executeMulticalls(
        trustlessMulticall,
        {
          ethPrice: oneContractManyFunctionMC(
            prices,
            { calculateInstantCollateralPrice: rc.BigNumberUnscale },
            { calculateInstantCollateralPrice: [args.liquidationsInfo.twapDuration] },
          ),
        }
      )

      return { ethPrice: ethPrice.calculateInstantCollateralPrice }
    },
})

export const pricesSlice = {
  ...partialPricesSlice,
  stateSelector: (state: RootState) => state.prices
}

export default partialPricesSlice.slice.reducer
