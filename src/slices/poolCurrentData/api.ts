import { Contract } from 'ethers'

import { poolCurrentDataArgs, poolCurrentInfo } from './'
import { ProtocolContract } from '../contracts'
import getProvider from '../../utils/getProvider'
import getContract, { getMulticallContract } from '../../utils/getContract'
import {
  executeMulticalls,
  rc,
  getMulticall,
  getCustomMulticall,
  getFullSelector,
} from '@trustlessfi/multicall'

import { Prices, UniswapV3Pool, ERC20 } from '@trustlessfi/typechain'

import poolArtifact from '@trustlessfi/artifacts/dist/@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { uint255Max , bnf , enforce, sqrtPriceX96ToTick } from '../../utils'
import { zeroAddress , unscale } from '../../utils/index';

export const fetchPoolCurrentData = async (args: poolCurrentDataArgs): Promise<poolCurrentInfo> => {
    const provider = getProvider()
    const prices = getContract(args.Prices, ProtocolContract.Prices) as Prices
    const trustlessMulticall = getMulticallContract(args.TrustlessMulticall)

    enforce(args.PoolsMetadata.hasOwnProperty(args.poolAddress), 'fetchPoolCurrentData: poolsMetadata missing poolAddress: ' + args.poolAddress)
    const pool = args.PoolsMetadata[args.poolAddress]
    const poolContract = new Contract(args.poolAddress, poolArtifact.abi, provider) as UniswapV3Pool
    const tokenContract = new Contract(zeroAddress, erc20Artifact.abi, provider) as ERC20

    const token0UserBalanceSelector = getFullSelector(tokenContract, pool.token0.address, 'balanceOf', [args.userAddress])
    const token1UserBalanceSelector = getFullSelector(tokenContract, pool.token1.address, 'balanceOf', [args.userAddress])
    const token0AllowanceSelector = getFullSelector(tokenContract, pool.token0.address, 'allowance', [args.userAddress, args.Rewards])
    const token1AllowanceSelector = getFullSelector(tokenContract, pool.token1.address, 'allowance', [args.userAddress, args.Rewards])

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
          { calculateInstantTwappedTick: [args.poolAddress, args.rewardsInfo.twapDuration]},
        ),
        balances: getCustomMulticall(
          tokenContract,
          {
            [token0UserBalanceSelector]: rc.BigNumber,
            [token1UserBalanceSelector]: rc.BigNumber,
          }
        ),
        allowances: getCustomMulticall(
          tokenContract,
          {
            [token0AllowanceSelector]: rc.BigNumberToString,
            [token1AllowanceSelector]: rc.BigNumberToString,
          }
        )
      }
    )

    const token0UserBalance = unscale(currentData.balances[token0UserBalanceSelector], pool.token0.decimals)
    const token1UserBalance = unscale(currentData.balances[token1UserBalanceSelector], pool.token1.decimals)
    const token0Allowance = currentData.allowances[token0AllowanceSelector]
    const token1Allowance = currentData.allowances[token1AllowanceSelector]

    return {
      instantTick: sqrtPriceX96ToTick(currentData.sqrtPriceX96Instant.slot0),
      twapTick: currentData.tickTwapped.calculateInstantTwappedTick,
      token0: {
        address: pool.token0.address,
        rewardsApproval: {
          allowance: token0Allowance,
          approving: false,
          approved: bnf(token0Allowance).gt(uint255Max),
        },
        userBalance: token0UserBalance,
      },
      token1: {
        address: pool.token1.address,
        rewardsApproval: {
          allowance: token1Allowance,
          approving: false,
          approved: bnf(token1Allowance).gt(uint255Max),
        },
        userBalance: token1UserBalance,
      }
    }
  }
