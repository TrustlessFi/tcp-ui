import { liquidityPositions, liquidityPositionArgs, liquidityPositionsArgs, LiquidityPosition } from './'
import { fetchLiquidityPool } from '../pools/api'
import { unscale } from '../../utils'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'

import { Accounting } from '../../utils/typechain/Accounting'

export const fetchLiquidityPosition = async (data: liquidityPositionArgs): Promise<LiquidityPosition> => {
  const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting;

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
    poolID
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
  const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting;

  const positionIDs = await accounting.getPoolPositionNftIdsByOwner(data.userAddress);

  const positions = await Promise.all(positionIDs.map(id => fetchLiquidityPosition({
    chainID: data.chainID,
    positionID: id.toNumber()
  })));

  const state = positions.reduce((agg: liquidityPositions, position) => {
      agg.positions[position.id] = position;
      return agg;
  }, {
    creating: false,
    positions: {}
  });

  return state;
}