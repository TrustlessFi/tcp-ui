import { liquidityPositions, liquidityPositionsArgs, LiquidityPosition } from './'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { ProtocolContract } from '../contracts'
import { unscale, unique } from '../../utils'
import { PromiseType } from '@trustlessfi/utils'
import { executeMulticalls, getDuplicateFuncMulticall } from '@trustlessfi/multicall'

import { Accounting, Rewards } from '../../utils/typechain/'

export const fetchLiquidityPositions = async (args: liquidityPositionsArgs): Promise<liquidityPositions> => {
  const accounting = getContract(args.Accounting, ProtocolContract.Accounting) as Accounting
  const rewards = getContract(args.Rewards, ProtocolContract.Rewards) as Rewards
  const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

  const positionIDs = await accounting.getPoolPositionNftIdsByOwner(args.userAddress)

  const { positions } = await executeMulticalls(trustlessMulticall, {
    positions: getDuplicateFuncMulticall(
      accounting,
      'getPoolPosition',
      (result: any) => result as PromiseType<ReturnType<Accounting['getPoolPosition']>>,
      Object.fromEntries(positionIDs.map(positionID => [positionID.toString(), [positionID]]))
    ),
  })

  const poolIDs: number[] = unique(Object.values(positions).map(position => position.poolID))

  const { poolConfigs } = await executeMulticalls(trustlessMulticall, {
    poolConfigs: getDuplicateFuncMulticall(
      rewards,
      'poolConfigForPoolID',
      (result: any) => result as PromiseType<ReturnType<Rewards['poolConfigForPoolID']>>,
      Object.fromEntries(poolIDs.map(poolID => [poolID, [poolID]]))
    ),
  })

  return Object.fromEntries(Object.entries(positions).map(([id, position]) => [
    id,
    {
      cumulativeLiquidity: position.cumulativeLiquidity.toString(),
      id: parseInt(id),
      lastTimeRewarded: position.lastTimeRewarded.toNumber(),
      lastBlockPositionIncreased: position.lastBlockPositionIncreased.toNumber(),
      liquidity: position.liquidity,
      owner: position.owner,
      pool: poolConfigs[id]!.pool,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      totalRewards: unscale(position.totalRewards),
    }
  ]))
}
