import { RootState } from '../../app/store'
import { getThunkDependencies } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getNullSliceState, getGenericReducerBuilder, NonNullValues } from '../'

import { Governor } from '@trustlessfi/typechain'
import { RootContract } from '../contracts/ProtocolContract'
import getContract from '../../utils/getContract'

export interface governorInfo {
  phase: number
}

const dependencies = getThunkDependencies(['governor'])

export const getGovernorInfo = {
  stateSelector: (state: RootState) => state.governor,
  dependencies,
  thunk:
    createAsyncThunk(
      'governor/getGovernorInfo',
      async (args: NonNullValues<typeof dependencies>) => {
        const governor = getContract(args.governor, RootContract.Governor) as Governor

        const [
          phase,
        ] = await Promise.all([
          governor.currentPhase(),
        ])

        return { phase }
      }
    )
}

export const governorSlice = createSlice({
  name: 'governor',
  initialState: getNullSliceState<governorInfo>(),
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getGovernorInfo.thunk)
  },
})

export default governorSlice.reducer
