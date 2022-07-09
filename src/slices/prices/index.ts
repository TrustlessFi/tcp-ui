import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice } from '../'
import { Prices } from '@trustlessfi/typechain'
import { unscale } from '../../utils'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, executeMulticalls } from '@trustlessfi/multicall'

export interface pricesInfo { ethPrice: number }

const pricesSlice = createChainDataSlice({
  name: 'prices',
  dependencies: ['contracts', 'rootContracts', 'liquidationsInfo'],
  stateSelector: (state: RootState) => state.pricesInfo,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'liquidationsInfo'>) => {
      const prices = getContract<Prices>(ProtocolContract.Prices, args.contracts.Prices) as Prices
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { ethPrice } = await executeMulticalls(
        trustlessMulticall,
        {
          ethPrice: oneContractManyFunctionMC(
            prices,
            { calculateInstantCollateralPrice: [args.liquidationsInfo.twapDuration] },
          ),
        }
      )

      return { ethPrice: unscale(ethPrice.calculateInstantCollateralPrice) }
    },
})

export default pricesSlice
