import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull } from '../waitFor'
import { sliceState } from '../'
import { initialState, getGenericReducerBuilder } from '../'
import { getMulticallContract} from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
  oneContractManyFunctionMC,
} from '@trustlessfi/multicall'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

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
      async (args: NonNull<typeof dependencies>): Promise<currentChainInfo> => {
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
  initialState: initialState as sliceState<currentChainInfo>,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getCurrentChainInfo.thunk)
  },
})

export default currentChainInfoSlice.reducer
