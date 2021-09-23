import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { ratesInfo } from '../rates'
import { contract } from '../../utils/getContract'

import { UniswapV3Pool } from "../../utils/typechain/UniswapV3Pool"

import poolArtifact from '../../utils/artifacts/contracts/uniswap/uniswap-v3-core/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import { getLocalStorage } from '../../utils/index';
import { getMulticall, getDuplicateFuncMulticall, executeMulticalls } from '../../utils/Multicall/index';
import * as mc from '../../utils/Multicall'

export type referenceTokens = string[]

export interface ReferenceTokensState extends sliceState<referenceTokens> {}

export interface referenceTokenArgs {
  Hue: string
  ratesInfo: ratesInfo
}


// NOTE: CURRENTLY UNUSED

export const getReferenceTokens = createAsyncThunk(
  'referenceTokens/getReferenceTokens', async (args: referenceTokenArgs) => {
    return await Promise.all(args.ratesInfo.referencePools.map(async refPoolAddress => {
      const pool = contract<UniswapV3Pool>(refPoolAddress, poolArtifact.abi)

      const result = await executeMulticalls({
        tokens: getMulticall(pool, { token0: mc.Address, token1: mc.Address })
      })

      return result.tokens.token0 === args.Hue ? result.tokens.token1: result.tokens.token0
    }))
})

const name = 'referenceTokens'
export const referenceTokensSlice = createSlice({
  name,
  initialState: getState<referenceTokens>(getLocalStorage(name, null)) as ReferenceTokensState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getReferenceTokens)
  },
});

export default referenceTokensSlice.reducer
