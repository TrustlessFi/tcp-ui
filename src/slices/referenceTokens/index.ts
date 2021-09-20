import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { governorInfo } from '../governor'
import { ratesInfo } from '../rates'
import { ethers } from 'ethers'
import getProvider from '../../utils/getProvider'
import getContract from '../../utils/getContract'

import { Hue } from "../../utils/typechain/"
import { UniswapV3Pool } from "../../utils/typechain/UniswapV3Pool"

import poolArtifact from '../../utils/artifacts/contracts/uniswap/uniswap-v3-core/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import { ProtocolContract } from '../contracts/index';
import { getLocalStorage } from '../../utils/index';

export type referenceTokens = string[]

export interface ReferenceTokensState extends sliceState<referenceTokens> {}

export interface referenceTokenArgs {
  Hue: string
  ratesInfo: ratesInfo
}

export const getReferenceTokens = createAsyncThunk(
  'referenceTokens/getReferenceTokens', async (args: referenceTokenArgs) => {
    const hue = getContract(args.Hue, ProtocolContract.Hue) as Hue

    return await Promise.all(args.ratesInfo.referencePools.map(async refPoolAddress => {
      const refPool = new ethers.Contract(refPoolAddress, poolArtifact.abi, getProvider()!) as unknown as UniswapV3Pool
      const [token0, token1] = await Promise.all([refPool.token0(), refPool.token1()])
      return token0 === hue.address ? token1: token0
    }))
})

const name = 'referenceTokens'
export const referenceTokensSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as ReferenceTokensState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getReferenceTokens)
  },
});

export default referenceTokensSlice.reducer
