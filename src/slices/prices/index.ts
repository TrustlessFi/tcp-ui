import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getStateWithValue, getGenericReducerBuilder } from '../'
import { liquidationsInfo } from '../liquidations'
import getContract, { getMulticallContract } from '../../utils/getContract'

import { Prices } from '@trustlessfi/typechain'
import { ProtocolContract, ContractsInfo } from '../contracts'
import { getLocalStorage } from '../../utils'
import { getMulticall, rc, executeMulticalls } from '@trustlessfi/multicall'


export type pricesInfo = {
  ethPrice: number,
}

export interface PricesState extends sliceState<pricesInfo> {}

export interface pricesArgs {
  liquidationsInfo: liquidationsInfo
  contracts: ContractsInfo
  trustlessMulticall: string
}

export const getPricesInfo = createAsyncThunk(
  'prices/getPricesInfo',
  async (args: pricesArgs): Promise<pricesInfo> => {
    const prices = getContract(args.contracts[ProtocolContract.Prices], ProtocolContract.Prices) as Prices
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

    const { ethPrice } = await executeMulticalls(
      trustlessMulticall,
      {
        ethPrice: getMulticall(
          prices,
          { calculateInstantCollateralPrice: rc.BigNumberUnscale },
          { calculateInstantCollateralPrice: [args.liquidationsInfo.twapDuration] },
        ),
      }
    )

    return { ethPrice: ethPrice.calculateInstantCollateralPrice }
  }
)

const name = 'prices'

export const pricesSlice = createSlice({
  name,
  initialState: getStateWithValue<pricesInfo>(getLocalStorage(name, null)) as PricesState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPricesInfo)
  },
});

export default pricesSlice.reducer
