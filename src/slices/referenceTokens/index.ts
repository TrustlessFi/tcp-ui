import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sliceState, getState, getGenericReducerBuilder } from '../'
import { ratesInfo } from '../rates'
import { Contract } from 'ethers'
import getProvider from '../../utils/getProvider'
import getContract, { contract } from '../../utils/getContract'

import { Hue } from "../../utils/typechain/"
import { UniswapV3Pool } from "../../utils/typechain/UniswapV3Pool"

import poolArtifact from '../../utils/artifacts/contracts/uniswap/uniswap-v3-core/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';
import Multicall from '../../utils/Multicall/index';
import * as mc from '../../utils/Multicall'

export type referenceTokens = string[]

export interface ReferenceTokensState extends sliceState<referenceTokens> {}

export interface referenceTokenArgs {
  Hue: string
  ratesInfo: ratesInfo
}

export const getReferenceTokens = createAsyncThunk(
  'referenceTokens/getReferenceTokens', async (args: referenceTokenArgs) => {
    return await Promise.all(args.ratesInfo.referencePools.map(async refPoolAddress => {

      const tokens = await Multicall(contract<UniswapV3Pool>(refPoolAddress, poolArtifact.abi)).execute({
        token0: mc.Address,
        token1: mc.Address,
      })

      return tokens.token0 === args.Hue ? tokens.token1: tokens.token0
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
