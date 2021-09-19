import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'

import { Governor } from "../../utils/typechain/Governor"
import { ProtocolContract } from '../contracts/';
import getContract from '../../utils/getContract'

export type governorArgs = {
  chainID: ChainID
  Governor: string
}

export type governorInfo = {
  phase: number
}

export interface GovernorState extends sliceState<governorInfo> {}

export const getGovernorInfo = createAsyncThunk(
  'governor/getGovernorInfo',
  async (args: governorArgs) => {

    // TODO type inference so we don't have to have this everywhere
    const governor = getContract(args.Governor, ProtocolContract.Governor) as Governor

    const [
      phase,
    ] = await Promise.all([
      governor.currentPhase(),
    ])

    return { phase }
  }
)

export const governorSlice = createSlice({
  name: 'governor',
  initialState: initialState as GovernorState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getGovernorInfo)
  },
});

export default governorSlice.reducer;
