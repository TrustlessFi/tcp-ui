import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'

import { Governor } from "../../utils/typechain/Governor"

export type governorInfo = {
  phase: number,
  collateralPool: string,
  referencePools: string[],
}

export interface GovernorState extends sliceState {
  data: null | governorInfo
}

export const getGovernorInfo = createAsyncThunk(
  'governor/getGovernorInfo',
  async (chainID: ChainID) => await fetchGovernorInfo(chainID)
)

export const fetchGovernorInfo = async (chainID: ChainID) => {
  if (chainID === null) return null

  const governor = await getProtocolContract(chainID, ProtocolContract.Governor) as Governor
  if (governor === null) return null

  let [
    phase,
    collateralPool,
    referencePools,
  ] = await Promise.all([
    governor.currentPhase(),
    governor.collateralPool(),
    governor.getReferencePools(),
  ])

  return {
    phase,
    collateralPool,
    referencePools,
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
