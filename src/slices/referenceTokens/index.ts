import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { ChainID } from '../chainID'
import { sliceState, initialState, getGenericReducerBuilder } from '../'
import { governorInfo } from '../governor'
import { ethers } from 'ethers'
import getProvider from '../../utils/getProvider'

import { ERC20 } from "../../utils/typechain/Erc20"
import { UniswapV3Pool } from "../../utils/typechain/UniswapV3Pool"

import poolArtifact from '../../utils/artifacts/contracts/uniswap/uniswap-v3-core/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'

export type referenceTokens = string[]

export interface ReferenceTokensState extends sliceState<referenceTokens> {}

export interface referenceTokenArgs {
  governorInfo: governorInfo
  chainID: ChainID
}

export const getReferenceTokens = createAsyncThunk(
  'referenceTokens/getReferenceTokens', async (args: referenceTokenArgs) => {
    const zhu = await getProtocolContract(args.chainID, ProtocolContract.Zhu) as unknown as ERC20 | null

    const provider = getProvider()
    if (zhu === null || provider === null) return null

    return await Promise.all(args.governorInfo.referencePools.map(async refPoolAddress => {
      const refPool = new ethers.Contract(refPoolAddress, poolArtifact.abi, provider) as unknown as UniswapV3Pool
      const [token0, token1] = await Promise.all([refPool.token0(), refPool.token1()])
      return token0 === zhu.address ? token1: token0
    }))
})

export const referenceTokensSlice = createSlice({
  name: 'referenceTokens',
  initialState: initialState as ReferenceTokensState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getReferenceTokens)
  },
});

export default referenceTokensSlice.reducer;
