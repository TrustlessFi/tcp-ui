import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainIDState } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'

import { Governor } from "../../utils/typechain/Governor"

export type governorInfo = {
  phase: number,
}

export interface GovernorState extends sliceState {
  data: null | governorInfo
}

export const getGovernorInfo = createAsyncThunk(
  'governor/getGovernorInfo',
  async (chainIDState: ChainIDState) => await fetchGovernorInfo(chainIDState)
)

export const fetchGovernorInfo = async (chainIDState: ChainIDState) => {
  const chainID = chainIDState.chainID
  if (chainID === null) return null

  const governor = await getProtocolContract(chainID, ProtocolContract.Governor) as Governor
  if (governor === null) return null

  let [
    phase,
  ] = await Promise.all([
    governor.currentPhase(),
  ]);

  return {
    phase
  }
}

export const governorSlice = createSlice({
  name: 'governor',
  initialState: initialState as GovernorState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getGovernorInfo)
  },
});

export default governorSlice.reducer;
