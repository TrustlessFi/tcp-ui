import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getContract, { getMulticallContract } from '../../utils/getContract'
import { ProtocolContract } from '../contracts'
import { PromiseType } from '@trustlessfi/utils'
import { executeMulticalls, oneContractOneFunctionMC } from '@trustlessfi/multicall'

import { Accounting } from '@trustlessfi/typechain'

import { sliceState, initialState } from '../'
import { getGenericReducerBuilder } from '../'
import { contractsInfo } from '../contracts'


export interface LiquidityPosition {
  positionID: string
  poolID: number
  cumulativeLiquidity: string
  lastTimeRewarded: number
  lastBlockPositionIncreased: number
  liquidity: string
  owner: string
  tickLower: number
  tickUpper: number
  totalRewards: string
}

export interface liquidityPositions { [id: string]: LiquidityPosition }

export interface liquidityPositionsArgs {
  contracts: contractsInfo
  trustlessMulticall: string
  userAddress: string
}

export interface LiquidityPositionsState extends sliceState<liquidityPositions> {}

export const getLiquidityPositions = createAsyncThunk(
  'liquidityPositions/getLiquidityPositions',
  async (args: liquidityPositionsArgs): Promise<liquidityPositions> => {
    const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

    const positionIDs = await accounting.getPoolPositionNftIdsByOwner(args.userAddress)

    const { positions } = await executeMulticalls(trustlessMulticall, {
      positions: oneContractOneFunctionMC(
        accounting,
        'getPoolPosition',
        (result: any) => result as PromiseType<ReturnType<Accounting['getPoolPosition']>>,
        Object.fromEntries(positionIDs.map(positionID => [positionID.toString(), [positionID]]))
      ),
    })

    return Object.fromEntries(Object.entries(positions).map(([positionID, position]) => [
      positionID,
      {
        positionID,
        poolID: position.poolID,
        cumulativeLiquidity: position.cumulativeLiquidity.toString(),
        lastTimeRewarded: position.lastTimeRewarded.toNumber(),
        lastBlockPositionIncreased: position.lastBlockPositionIncreased.toNumber(),
        liquidity: position.liquidity.toString(),
        owner: position.owner,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        totalRewards: position.totalRewards.toString(),
      }
    ]))
  }
)

export const liquidityPositionsSlice = createSlice({
  name: 'liquidityPositions',
  initialState: initialState as LiquidityPositionsState,
  reducers: {
    clearLiquidityPositions: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    getGenericReducerBuilder(builder, getLiquidityPositions)
  },
})

export const { clearLiquidityPositions } = liquidityPositionsSlice.actions

export default liquidityPositionsSlice.reducer
