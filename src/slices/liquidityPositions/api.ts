import { liquidityPositions, liquidityPositionArgs, liquidityPositionsArgs, LiquidityPosition } from './'
import getContract from '../../utils/getContract'
import { ProtocolContract } from '../contracts'
import { fetchLiquidityPool } from '../pools/api'
import { unscale } from '../../utils'

import { Accounting } from '../../utils/typechain/Accounting'

export const fetchLiquidityPosition = async (data: liquidityPositionArgs): Promise<LiquidityPosition> => {
  console.log('getting accounting');
  const accounting = getContract(data.Accounting, ProtocolContract.Accounting) as Accounting;
  console.log('got accounting');

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
  ] = await accounting.getPoolPosition(data.positionID);

  const pool = await fetchLiquidityPool({
    chainID: data.chainID,
    poolID,
    Rewards: data.Rewards
  });

  return {
      cumulativeLiquidity: unscale(cumulativeLiquidity),
      id: data.positionID,
      lastTimeRewarded: unscale(lastTimeRewarded),
      lastBlockPositionIncreased: unscale(lastBlockPositionIncreased),
      liquidity,
      owner,
      pool,
      tickLower,
      tickUpper,
      totalRewards: unscale(totalRewards),
  } as LiquidityPosition;
}

export const fetchLiquidityPositions = async (data: liquidityPositionsArgs) => {
  const accounting = await getContract(data.Accounting, ProtocolContract.Accounting) as Accounting;

  const positionIDs = await accounting.getPoolPositionNftIdsByOwner(data.userAddress);

  const positions = await Promise.all(positionIDs.map(id => fetchLiquidityPosition({
    Accounting: data.Accounting,
    chainID: data.chainID,
    positionID: id.toNumber(),
    Rewards: data.Rewards
  })));

  const state = positions.reduce((agg: liquidityPositions, position) => {
      agg.positions[position.id] = position;
      return agg;
  }, {
    creating: false,
    loading: false,
    positions: {}
  });

  return state;
}

export const addLiquidityToPosition = async (positionID: string, liquidityToAdd: number) => {
  return {};
}