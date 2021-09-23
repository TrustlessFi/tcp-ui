import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { liquidationsInfo } from '../liquidations'
import getContract from '../../utils/getContract'

import { Prices } from "../../utils/typechain/Prices"
import { unscale } from "../../utils"
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';


export type pricesInfo = {
  ethPrice: number,
}

export interface PricesState extends sliceState<pricesInfo> {}

export interface pricesArgs {
  liquidationsInfo: liquidationsInfo,
  Prices: string
}

export const getPricesInfo = createAsyncThunk(
  'prices/getPricesInfo',
  async (args: pricesArgs) => {
    const prices = getContract(args.Prices, ProtocolContract.Prices) as Prices

    const [
      ethPrice,
    ] = await Promise.all([
      prices.calculateInstantCollateralPrice(args.liquidationsInfo.twapDuration),
    ])

    return {
      ethPrice: unscale(ethPrice)
    }
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
