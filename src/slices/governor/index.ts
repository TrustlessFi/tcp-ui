import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull, FetchNodes } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, initialState, getGenericReducerBuilder } from '../'

import { Governor } from '@trustlessfi/typechain'
import { RootContract } from '../contracts/ProtocolContract'
import getContract from '../../utils/getContract'

const dependencies = getThunkDependencies(['governor'])

export const getGovernorInfo = {
  stateSelector: (state: RootState) => state.governor,
  dependencies,
  thunk:
    createAsyncThunk(
      'governor/getGovernorInfo',
      async (args: NonNull<typeof dependencies>) => {
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
  initialState: initialState as sliceState<FetchNodes['governorInfo']>,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getGovernorInfo.thunk)
  },
})

export default governorSlice.reducer
