import { ethers } from 'ethers'
import { LiquidityPosition } from './'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { unscale } from '../../utils'
import getProvider from '../../utils/getProvider'
import { liquidityPositions, liquidityPoolArgs, liquidityPositionArgs, liquidityPositionsArgs, LiquidityPool } from './'

import { Accounting } from '../../utils/typechain/Accounting'
import { ERC20 } from '../../utils/typechain/ERC20';
import { Rewards } from '../../utils/typechain/Rewards'
import { UniswapV3Pool } from '../../utils/typechain/UniswapV3Pool';

import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';


interface PoolCache { [key: number]: LiquidityPool }

const poolCache: PoolCache = {}

const fetchLiquidityPool = async (data: liquidityPoolArgs): Promise<LiquidityPool> => {
  const rewards = await getProtocolContract(data.chainID, ProtocolContract.Rewards) as Rewards;
  const poolAddress = await rewards.poolForPoolID(data.poolID);
  return getPoolInformationForAddress(poolAddress);
}

export const getPoolInformationForAddress = async (poolAddress: string): Promise<LiquidityPool> => {
  const provider = getProvider();

  if(!provider) {
    throw new Error('No provider!')
  }

  const pool = new ethers.Contract(poolAddress, poolArtifact.abi, provider) as UniswapV3Pool;

  const [ 
      fee,
      liquidity,
      [ sqrtPriceX96, tick, observationIndex, observationCardinality, observationCardinalityNext, feeProtocol, unlocked ],
      token0Address,
      token1Address,
  ] = await Promise.all([
      pool.fee(),
      pool.liquidity(),
      pool.slot0(),
      pool.token0(),
      pool.token1(),
  ]);

  const token0 = new ethers.Contract(token0Address, erc20Artifact.abi, provider) as ERC20;
  const token1 = new ethers.Contract(token1Address, erc20Artifact.abi, provider) as ERC20;

  const [
      token0Decimals,
      token0Symbol,
      token1Decimals,
      token1Symbol
  ] = await Promise.all([
      token0.decimals(),
      token0.symbol(),
      token1.decimals(),
      token1.symbol()
  ]);

  return {
      address: pool.address,
      fee,
      liquidity: unscale(liquidity),
      slot0: {
          sqrtPriceX96,
          tick,
          observationIndex,
          observationCardinality,
          observationCardinalityNext,
          feeProtocol,
          unlocked
      },
      token0Address: token0.address,
      token0Decimals,
      token0Symbol,
      token1Address: token1.address,
      token1Decimals,
      token1Symbol
  } as LiquidityPool;
};

export const fetchLiquidityPosition = async (data: liquidityPositionArgs): Promise<LiquidityPosition> => {
  const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting;

  const [
      owner,
      poolID,
      cumulativeLiquidity,
      totalRewards,
      lastTimeRewarded,
      lastTimePositionIncreased,
      tickLower,
      tickUpper,
      liquidity
  ] = await accounting.getPoolPosition(data.positionID);

  let pool = poolCache[poolID];

  if(!pool) {
      pool = await fetchLiquidityPool({
        chainID: data.chainID,
        poolID
      });
      poolCache[poolID] = pool;
  }

  return {
      id: data.positionID,
      owner,
      pool,
      cumulativeLiquidity: unscale(cumulativeLiquidity),
      totalRewards: unscale(totalRewards),
      lastTimeRewarded: unscale(lastTimeRewarded),
      lastTimePositionIncreased: unscale(lastTimePositionIncreased),
      tickLower,
      tickUpper,
      liquidity,
  } as LiquidityPosition;
}

export const fetchLiquidityPositions = async (data: liquidityPositionsArgs) => {
  const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting;

  const positionIDs = await accounting.getPoolPositionNftIdsByOwner(data.userAddress);

  const positions = await Promise.all(positionIDs.map(id => fetchLiquidityPosition({
    chainID: data.chainID,
    positionID: id.toNumber()
  })));

  return positions.reduce((agg: liquidityPositions, position) => {
      agg[position.id] = position;
      return agg;
  }, {});
}