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

export interface currentChainInfoState extends sliceState<currentChainInfo> {}

export interface balanceArgs {
  trustlessMulticall: string,
}

export const getCurrentChainInfo = createAsyncThunk(
  'currentChainInfo/getCurrentChainInfo',
  async (
    args: {trustlessMulticall: string},
  ): Promise<currentChainInfo> => {
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

export const currentChainInfoSlice = createSlice({
  name: 'currentChainInfo',
  initialState: initialState as currentChainInfoState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getCurrentChainInfo)
  },
})

export default currentChainInfoSlice.reducer
