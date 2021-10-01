import { liquidityPositions, liquidityPositionArgs, liquidityPositionsArgs, LiquidityPosition } from './'
import getContract from '../../utils/getContract'
import { ProtocolContract } from '../contracts'
import { unscale } from '../../utils'

import { Accounting, Rewards } from '../../utils/typechain/'

const fetchLiquidityPosition = async (data: liquidityPositionArgs): Promise<LiquidityPosition> => {
  const accounting = getContract(data.Accounting, ProtocolContract.Accounting) as Accounting
  const rewards = getContract(data.Rewards, ProtocolContract.Rewards) as Rewards

  const [
      owner,
      poolID,
      cumulativeLiquidity,
      totalRewards,
      lastBlockPositionIncreased,
      liquidity,
      lastTimeRewarded,
      tickLower,
      tickUpper
  ] = await accounting.getPoolPosition(data.positionID)

  const poolConfig = await rewards.poolConfigForPoolID(poolID)

  return {
    cumulativeLiquidity: cumulativeLiquidity.toString(),
    id: data.positionID,
    lastTimeRewarded: lastTimeRewarded.toNumber(),
    lastBlockPositionIncreased: lastBlockPositionIncreased.toNumber(),
    liquidity,
    owner,
    pool: poolConfig.pool,
    tickLower,
    tickUpper,
    totalRewards: unscale(totalRewards),
  } as LiquidityPosition
}

export const fetchLiquidityPositions = async (args: liquidityPositionsArgs): Promise<liquidityPositions> => {
  console.log("start fetch liquidity positions")
  const accounting = getContract(args.Accounting, ProtocolContract.Accounting) as Accounting

  const positionIDs = await accounting.getPoolPositionNftIdsByOwner(args.userAddress)

  const positions = await Promise.all(positionIDs.map(id => fetchLiquidityPosition({
    Accounting: args.Accounting,
    chainID: args.chainID,
    positionID: id.toNumber(),
    Rewards: args.Rewards
  })))

  const state = positions.reduce((agg: liquidityPositions, position) => {
    agg.positions[position.id] = position
    return agg
  }, {
    creating: false,
    loading: false,
    positions: {}
  })
  console.log("End fetch liquidity position")

  return state
}

export const addLiquidityToPosition = async (positionID: string, liquidityToAdd: number) => {
  return {}
}
