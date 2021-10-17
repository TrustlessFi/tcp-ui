import { Contract } from 'ethers'

import { poolCurrentDataArgs, poolCurrentInfo } from './'
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import getContract, { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
  getMulticall,
} from '@trustlessfi/multicall'

import { Prices, UniswapV3Pool, ERC20 } from '../../utils/typechain/'

import poolArtifact from '../../utils/artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import erc20Artifact from '../../utils/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { uint255Max , bnf , enforce, sqrtPriceX96ToTick } from '../../utils'

export const fetchPoolCurrentData = async (args: poolCurrentDataArgs, poolAddress: string): Promise<poolCurrentInfo> => {
    const provider = getProvider()
    const prices = getContract(args.Prices, ProtocolContract.Prices) as Prices
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    console.log("here 1", {args})

    enforce(args.PoolsMetadata.hasOwnProperty(poolAddress), 'fetchPoolCurrentData: poolsMetadata missing poolAddress: ' + poolAddress)
    const pool = args.PoolsMetadata[poolAddress]
    const poolContract = new Contract(poolAddress, poolArtifact.abi, provider) as UniswapV3Pool
    const token0Contract = new Contract(pool.token0.address, erc20Artifact.abi, provider) as ERC20
    const token1Contract = new Contract(pool.token1.address, erc20Artifact.abi, provider) as ERC20

    console.log("here 2")

    const currentData = await executeMulticalls(
      trustlessMulticall,
      {
        sqrtPriceX96Instant: getMulticall(
          poolContract,
          { slot0: rc.BigNumberToString }
        ),
        tickTwapped: getMulticall(
          prices,
          { calculateInstantTwappedTick: rc.Number },
          { calculateInstantTwappedTick: [poolAddress, args.rewardsInfo.twapDuration]},
        ),
        token0Data: getMulticall(
          token0Contract,
          { balanceOf: rc.BigNumberUnscale, allowance: rc.BigNumberToString },
          { balanceOf: [args.userAddress], allowance: [args.userAddress, args.Rewards]}
        ),
        token1Data: getMulticall(
          token1Contract,
          { balanceOf: rc.BigNumberUnscale, allowance: rc.BigNumberToString },
          { balanceOf: [args.userAddress], allowance: [args.userAddress, args.Rewards]}
        ),
      }
    )
    console.log("here 3")

    return {
      instantTick: sqrtPriceX96ToTick(currentData.sqrtPriceX96Instant.slot0),
      twapTick: currentData.tickTwapped.calculateInstantTwappedTick,
      token0: {
        address: pool.token0.address,
        rewardsApproval: {
          allowance: currentData.token0Data.allowance,
          approving: false,
          approved: bnf(currentData.token0Data.allowance).gt(uint255Max) ,
        },
        userBalance: currentData.token0Data.balanceOf,
      },
      token1: {
        address: pool.token1.address,
        rewardsApproval: {
          allowance: currentData.token1Data.allowance,
          approving: false,
          approved: bnf(currentData.token1Data.allowance).gt(uint255Max) ,
        },
        userBalance: currentData.token1Data.balanceOf,
      }
    }
  }
