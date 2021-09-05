import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'

import { Governor } from "../../utils/typechain/Governor"

export type governorArgs = {
  chainID: ChainID
}

export type governorInfo = {
  phase: number
}

export interface GovernorState extends sliceState<governorInfo> {}

export const getGovernorInfo = createAsyncThunk(
  'governor/getGovernorInfo',
  async (args: governorArgs) => {
    const governor = await getProtocolContract(args.chainID, ProtocolContract.Governor) as Governor
    if (governor === null) return null

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
