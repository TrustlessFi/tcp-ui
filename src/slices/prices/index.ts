import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { liquidationsInfo } from '../liquidations'
import getContract from '../../utils/getContract'

import { Prices, TcpMulticallViewOnly } from "../../utils/typechain"
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';
import { executeMulticall, rc } from '../../utils/Multicall'


export type pricesInfo = {
  ethPrice: number,
}

export interface PricesState extends sliceState<pricesInfo> {}

export interface pricesArgs {
  liquidationsInfo: liquidationsInfo
  Prices: string
  TcpMulticall: string
}

export const getPricesInfo = createAsyncThunk(
  'prices/getPricesInfo',
  async (args: pricesArgs): Promise<pricesInfo> => {
    const prices = getContract(args.Prices, ProtocolContract.Prices) as Prices
    const multicall = getContract(args.TcpMulticall, ProtocolContract.TcpMulticall, true) as unknown as TcpMulticallViewOnly

    const ethPrice = (await executeMulticall(multicall, prices,
      { calculateInstantCollateralPrice: rc.BigNumberUnscale },
      { calculateInstantCollateralPrice: [args.liquidationsInfo.twapDuration] },
    ))

    return { ethPrice: ethPrice.calculateInstantCollateralPrice }
  }
)

const name = 'prices'

export const pricesSlice = createSlice({
  name,
  initialState: getState<pricesInfo>(getLocalStorage(name, null)) as PricesState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPricesInfo)
  },
});

export default pricesSlice.reducer
