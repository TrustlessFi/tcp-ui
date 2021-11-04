import { Contract } from 'ethers'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sliceState } from '../'
import { rewardsInfo } from '../rewards'
import { poolsMetadata } from '../poolsMetadata'
import { approval, approveToken } from '../balances'

import { getInitialStateCopy } from '../'
import { fetchPoolCurrentData } from './api'

import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { ERC20 } from '@trustlessfi/typechain'
import getProvider from '../../utils/getProvider'
import { TransactionType } from '../transactions'
import { uint256Max } from '../../utils/index';

export interface tokenData {
  address: string
  rewardsApproval: approval
  userBalance: number
}

export type poolCurrentInfo = {
  instantTick: number,
  twapTick: number,
  token0: tokenData
  token1: tokenData
}

export type poolCurrentDataState = {[key in string]: sliceState<poolCurrentInfo>}

export interface poolCurrentDataArgs {
  Rewards: string
  Prices: string
  TrustlessMulticall: string
  userAddress: string,
  rewardsInfo: rewardsInfo
  PoolsMetadata: poolsMetadata
  poolAddress: string
}

export interface approveTokenArgs {
  tokenIndex: 0 | 1
  tokenAddress: string
  poolAddress: string
  userAddress: string
  Rewards: string
}

export const getPoolCurrentData = createAsyncThunk(
  'poolCurrentData/getCurrentData',
  async (args: poolCurrentDataArgs) => await fetchPoolCurrentData(args),
)

export const approvePoolToken = createAsyncThunk(
  'poolCurrentData/approvePoolToken',
  async (args: approveTokenArgs, {dispatch}): Promise<void> => {
    const provider = getProvider()

    const token = new Contract(args.tokenAddress, erc20Artifact.abi, provider) as ERC20

    await approveToken(token, args.Rewards, TransactionType.ApproveLendHue, args.userAddress, dispatch)
  }
)

export const poolCurrentDataSlice = createSlice({
  name: 'poolCurrentData' ,
  initialState: {} as poolCurrentDataState,
  reducers: {
    clearPoolCurrentData: (state, action: PayloadAction<string>) => {
      const poolToRemove = action.payload
      return Object.fromEntries(Object.keys(state).filter(pool => pool !== poolToRemove).map(pool => [pool, state[pool]]))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPoolCurrentData.pending, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        const initialState = getInitialStateCopy<poolCurrentInfo>()
        initialState.loading = true
        return {...state, [poolAddress]: initialState}
      })
      .addCase(getPoolCurrentData.rejected, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        state[poolAddress].data.error = action.error
      })
      .addCase(getPoolCurrentData.fulfilled, (state, action) => {
        const poolAddress = action.meta.arg.poolAddress
        state[poolAddress].loading = false
        state[poolAddress].data.value = action.payload
      })
      .addCase(approvePoolToken.pending, (state, action) => {
        action.meta.arg.tokenIndex === 0
          ? state[action.meta.arg.poolAddress].data.value!.token0.rewardsApproval.approving = true
          : state[action.meta.arg.poolAddress].data.value!.token1.rewardsApproval.approving = true
      })
      .addCase(approvePoolToken.rejected, (state, action) => {
        action.meta.arg.tokenIndex === 0
          ? state[action.meta.arg.poolAddress].data.value!.token0.rewardsApproval.approving = false
          : state[action.meta.arg.poolAddress].data.value!.token1.rewardsApproval.approving = false
      })
      .addCase(approvePoolToken.fulfilled, (state, action) => {
        const approvedObject = { approved: true, approving: false, allowance: uint256Max }
        action.meta.arg.tokenIndex === 0
          ? state[action.meta.arg.poolAddress].data.value!.token0.rewardsApproval = approvedObject
          : state[action.meta.arg.poolAddress].data.value!.token1.rewardsApproval = approvedObject
      })
  },
})

export const { clearPoolCurrentData } = poolCurrentDataSlice.actions

export default poolCurrentDataSlice.reducer
