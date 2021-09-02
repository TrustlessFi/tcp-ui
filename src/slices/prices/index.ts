import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { ChainID } from '../chainID'
import { governorInfo } from '../governor'
import { liquidationsInfo } from '../liquidations'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'

import { Prices } from "../../utils/typechain/Prices"
import { unscale } from "../../utils"


export type pricesInfo = {
  ethPrice: number,
}

export interface PricesState extends sliceState<pricesInfo> {}

export interface pricesArgs {
  chainID: ChainID,
  liquidationsInfo: liquidationsInfo,
}

export const getPricesInfo = createAsyncThunk(
  'prices/getPricesInfo',
  async (data: pricesArgs) => {
    const prices = await getProtocolContract(data.chainID, ProtocolContract.Prices) as Prices
    if (prices === null) return null

    let [
      ethPrice,
    ] = await Promise.all([
      prices.calculateInstantCollateralPrice(data.liquidationsInfo.twapDuration),
    ])

    return {
      ethPrice: unscale(ethPrice)
    }
  }
)

export const pricesSlice = createSlice({
  name: 'governor',
  initialState: initialState as PricesState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPricesInfo)
  },
});

export default pricesSlice.reducer
