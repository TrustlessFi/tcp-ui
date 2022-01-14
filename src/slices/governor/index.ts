import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, initialState, getGenericReducerBuilder } from '../'


import { Governor } from '@trustlessfi/typechain'
import { RootContract } from '../contracts/'
import getContract from '../../utils/getContract'

export type governorInfo = {
  phase: number
}

export interface GovernorState extends sliceState<governorInfo> {}

export const getGovernorInfo = createAsyncThunk(
  'governor/getGovernorInfo',
  async (args: {governor: string}) => {
    const governor = getContract(args.governor, RootContract.Governor) as Governor

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
})

export default governorSlice.reducer
