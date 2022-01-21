import { RootState } from '../../app/store'
import { getThunkDependencies } from '../fetchNodes'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getNullSliceState, getGenericReducerBuilder, NonNullValues } from '../'

import { getMulticallContract} from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
  oneContractManyFunctionMC,
} from '@trustlessfi/multicall'

export interface currentChainInfo {
  blockNumber: number
  blockTimestamp: number
  chainID: number
}

const dependencies = getThunkDependencies(['trustlessMulticall'])

export const getCurrentChainInfo = {
  stateSelector: (state: RootState) => state.currentChainInfo,
  dependencies,
  thunk:
    createAsyncThunk(
      'currentChainInfo/getCurrentChainInfo',
      async (args: NonNullValues<typeof dependencies>): Promise<currentChainInfo> => {
        const multicall = getMulticallContract(args.trustlessMulticall)

        const { chainInfo } = await executeMulticalls(
          multicall,
          {
            chainInfo: oneContractManyFunctionMC(
              multicall,
              {
                getBlockNumber: rc.BigNumberToNumber,
                getCurrentBlockTimestamp: rc.BigNumberToNumber,
                getChainId: rc.BigNumberToNumber,
              },
            ),
          }
        )

        return {
          blockNumber: chainInfo.getBlockNumber,
          blockTimestamp: chainInfo.getCurrentBlockTimestamp,
          chainID: chainInfo.getChainId,
        }
      }
    )
}

export const currentChainInfoSlice = createSlice({
  name: 'currentChainInfo',
  initialState: getNullSliceState<currentChainInfo>(),
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getCurrentChainInfo.thunk)
  },
})

export default currentChainInfoSlice.reducer
