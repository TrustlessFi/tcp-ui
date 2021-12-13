import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, getGenericReducerBuilder } from '../'
import { sliceState } from '../'
import { rewardsInfo } from '../rewards'
import { poolsMetadata } from '../poolsMetadata'
import { ContractsInfo } from '../contracts'

import { Contract } from 'ethers'

import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import getContract, { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
  getMulticall,
  getDuplicateFuncMulticall,
  getCustomMulticall,
  getFullSelector,
} from '@trustlessfi/multicall'

import { Prices, UniswapV3Pool } from '@trustlessfi/typechain'

import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { sqrtPriceX96ToTick, zeroAddress } from '../../utils'

export type poolCurrentInfo = {
  instantTick: number,
  twapTick: number,
}

export type poolsCurrentInfo = {
  [key in string]: poolCurrentInfo
}

export type poolCurrentDataState = sliceState<poolsCurrentInfo>

export interface poolsCurrentDataArgs {
  contracts: ContractsInfo
  trustlessMulticall: string
  rewardsInfo: rewardsInfo
  poolsMetadata: poolsMetadata
}

export const getPoolsCurrentData = createAsyncThunk(
  'poolsCurrentData/getPoolsCurrentData',
  async (args: poolsCurrentDataArgs): Promise<poolsCurrentInfo> => {
    const provider = getProvider()
    const prices = getContract(args.contracts[ProtocolContract.Prices], ProtocolContract.Prices) as Prices
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)
    const poolContract = new Contract(zeroAddress, poolArtifact.abi, provider) as UniswapV3Pool

    const poolAddresses = Object.keys(args.poolsMetadata)

    const { sqrtPriceX96Instant, tickTwapped } = await executeMulticalls(
      trustlessMulticall,
      {
        sqrtPriceX96Instant: getCustomMulticall(
          poolContract,
          Object.fromEntries(poolAddresses.map(address => [getFullSelector(poolContract, address, 'slot0', []), rc.String]))
        ),
        tickTwapped: getDuplicateFuncMulticall(
          prices,
          'calculateInstantTwappedTick',
          rc.Number,
          Object.fromEntries(poolAddresses.map(address => [address, [address, args.rewardsInfo.twapDuration]]))
        ),
      }
    )

    return Object.fromEntries(poolAddresses.map(address => [address, {
      instantTick: sqrtPriceX96ToTick(sqrtPriceX96Instant[getFullSelector(poolContract, address, 'slot0', [])]),
      twapTick: tickTwapped[address],
    }]))
  }
)

export const poolsCurrentDataSlice = createSlice({
  name: 'poolsCurrentData' ,
  initialState: initialState as poolCurrentDataState,
  reducers: {
    clearPoolsCurrentData: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getPoolsCurrentData)
  },
})

export const { clearPoolsCurrentData } = poolsCurrentDataSlice.actions

export default poolsCurrentDataSlice.reducer
