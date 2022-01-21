import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice, CacheDuration } from '../'
import { Prices } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { oneContractManyFunctionMC, rc, executeMulticalls } from '@trustlessfi/multicall'

export interface pricesInfo { ethPrice: number }

const _pricesSlice = createChainDataSlice({
  name: 'governor',
  dependencies: ['contracts', 'trustlessMulticall', 'liquidationsInfo'],
  cacheDuration: CacheDuration.LONG,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'trustlessMulticall' | 'liquidationsInfo'>) => {
      const prices = getContract(args.contracts[ProtocolContract.Prices], ProtocolContract.Prices) as Prices
      const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

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
  ..._pricesSlice,
  stateSelector: (state: RootState) => state.prices
}

export default _pricesSlice.slice.reducer
