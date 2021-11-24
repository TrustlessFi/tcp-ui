import { liquidityPositions, liquidityPositionsArgs } from './'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { ProtocolContract } from '../contracts'
import { PromiseType } from '@trustlessfi/utils'
import { executeMulticalls, getDuplicateFuncMulticall } from '@trustlessfi/multicall'


import { Accounting } from '@trustlessfi/typechain'

export const fetchLiquidityPositions = async (args: liquidityPositionsArgs): Promise<liquidityPositions> => {
  const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
  const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

  const positionIDs = await accounting.getPoolPositionNftIdsByOwner(args.userAddress)

  const { positions } = await executeMulticalls(trustlessMulticall, {
    positions: getDuplicateFuncMulticall(
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
