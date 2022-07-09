import {
  addressToERC20, zeroAddress, unique, addressToV3Pool, sum,
} from '../../utils/'
import ProtocolContract, { RootContract } from '../contracts/ProtocolContract';
import {
  executeMulticalls,
  manyContractOneFunctionMC,
  oneContractOneFunctionMC,
  idsToNoArg,
  idsToIds
} from '@trustlessfi/multicall'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { ProtocolDataAggregator, Rewards } from '@trustlessfi/typechain/'
import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'


export interface tokenMetadata {
  isWeth: boolean
  address: string
  name: string
  symbol: string
  displaySymbol: string
  decimals: number
}

export interface poolMetadata {
  rewardsPortion: number
  poolID: number
  address: string
  token0: tokenMetadata
  token1: tokenMetadata
  title: string
  poolIDString: string
}

export interface poolsMetadata { [key: string]: poolMetadata }

const poolsMetadataSlice = createChainDataSlice({
  name: 'poolsMetadata',
  dependencies: ['contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.poolsMetadata,
  cacheDuration: CacheDuration.LONG,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const protocolDataAggregator = getContract<ProtocolDataAggregator>(RootContract.ProtocolDataAggregator, args.rootContracts.protocolDataAggregator)
      const rewards = getContract<Rewards>(ProtocolContract.Rewards, args.contracts.Rewards)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const poolConfigs = await protocolDataAggregator.getIncentivizedPools()
      const poolAddresses = poolConfigs.map(config => config.pool)
      const totalRewardsPortion = poolConfigs.map(config => config.rewardsPortion.toNumber()).reduce(sum)

      const poolContract = addressToV3Pool(zeroAddress)

      const { token0, token1, poolIDs } = await executeMulticalls(
        trustlessMulticall,
        {
          token0: manyContractOneFunctionMC(poolContract, 'token0', idsToNoArg(poolAddresses)),
          token1: manyContractOneFunctionMC(poolContract, 'token1', idsToNoArg(poolAddresses)),
          poolIDs: oneContractOneFunctionMC(rewards, 'poolIDForPool', idsToIds(poolAddresses)),
        }
      )

      const tokenAddresses = unique(Object.values(token0).concat(Object.values(token1)))
      const tokenContract = addressToERC20(zeroAddress)

      const { name, symbol, decimals } = await executeMulticalls(
        trustlessMulticall,
        {
          name: manyContractOneFunctionMC(tokenContract, 'name', idsToNoArg(tokenAddresses)),
          symbol: manyContractOneFunctionMC(tokenContract, 'symbol', idsToNoArg(tokenAddresses)),
          decimals: manyContractOneFunctionMC(tokenContract, 'decimals', idsToNoArg(tokenAddresses)),
        },
      )

      return Object.fromEntries(poolConfigs.map(poolConfig => {
        const poolAddress = poolConfig.pool
        const token0Address = token0[poolAddress]
        const token1Address = token1[poolAddress]

        const token0Symbol = symbol[token0Address]
        const token1Symbol = symbol[token1Address]

        const token0IsWeth = token0Symbol.toLowerCase() === 'weth'
        const token1IsWeth = token1Symbol.toLowerCase() === 'weth'

        const token0DisplaySymbol = token0IsWeth ? 'Eth' : token0Symbol
        const token1DisplaySymbol = token1IsWeth ? 'Eth' : token1Symbol

        return [
          poolConfig.pool,
          {
            rewardsPortion: (poolConfig.rewardsPortion.toNumber() * 100) / totalRewardsPortion,
            poolID: poolIDs[poolAddress],
            address: poolAddress,
            token0: {
              isWeth: token0IsWeth,
              address: token0Address,
              name: name[token0Address],
              symbol: symbol[token0Address],
              displaySymbol: token0DisplaySymbol,
              decimals: decimals[token0Address],
            },
            token1: {
              isWeth: token1IsWeth,
              address: token1Address,
              name: name[token1Address],
              symbol: symbol[token1Address],
              displaySymbol: token1DisplaySymbol,
              decimals: decimals[token1Address],
            },
            poolIDString: `${token0DisplaySymbol}-${token1DisplaySymbol}`,
            title: `${token0DisplaySymbol} / ${token1DisplaySymbol}`,
          }
        ]
      }))
    },
})

export default poolsMetadataSlice
