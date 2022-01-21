import { RootState } from '../../app/store'
import { getThunkDependencies, NonNull, FetchNodes } from '../fetchNodes'
import { sliceState } from '../'
import { initialState, getGenericReducerBuilder } from '../'
import { getMulticallContract} from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
  oneContractManyFunctionMC,
} from '@trustlessfi/multicall'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const dependencies = getThunkDependencies(['trustlessMulticall'])

export const getCurrentChainInfo = {
  stateSelector: (state: RootState) => state.currentChainInfo,
  dependencies,
  thunk:
    createAsyncThunk(
      'currentChainInfo/getCurrentChainInfo',
      async (args: NonNull<typeof dependencies>) => {
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
  initialState: initialState as sliceState<FetchNodes['currentChainInfo']>,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getCurrentChainInfo.thunk)
  },
})

export default currentChainInfoSlice.reducer
