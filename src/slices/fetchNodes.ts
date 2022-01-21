import { ChainID } from '@trustlessfi/addresses'
import { contractsInfo } from './contracts'
import ProtocolContract from './contracts/ProtocolContract'
import { Fee } from '../utils/'

interface approval {
  allowance: string
  approving: boolean
  approved: boolean
}

export interface poolMetadata {
  fee: Fee
  rewardsPortion: number
  poolID: number
  address: string
  token0: tokenMetadata
  token1: tokenMetadata
}

type tokenBalances = {
  [tokenAddress: string]:  {
    token: {
      address: string,
      name: string,
      symbol: string,
      decimals: number,
    }
    userBalance: number
    approval: {
      [ProtocolContract.Market]: approval
      [ProtocolContract.Rewards]: approval
    }
    balances: {
      [ProtocolContract.Accounting]: number
    }
  }
}

export interface tokenMetadata {
  address: string
  name: string
  symbol: string
  decimals: number
}

export interface Position {
  collateralCount: number,
  debtCount: number,
  approximateRewards: number,
  rewards: number,
  id: number,
  lastBorrowTime: number,
  updating: boolean,
  updated: boolean,
  claimingRewards: boolean,
  claimedRewards: boolean,
}

export interface LiquidityPosition {
  positionID: string
  poolID: number
  lastBlockPositionIncreased: number
  liquidity: string
  owner: string
  tickLower: number
  tickUpper: number
  approximateRewards: number
}

export interface FetchNodes {
  chainID: ChainID,
  governor: string,
  protocolDataAggregator: string,
  trustlessMulticall: string,
  userAddress: string,
  balances: {
    userEthBalance: number
    tokens: tokenBalances
  },
  contracts: contractsInfo,
  currentChainInfo: {
    blockNumber: number
    blockTimestamp: number
    chainID: number
  },
  governorInfo: { phase: number },
  liquidationsInfo: {
    twapDuration: number,
    discoveryIncentive: number,
    liquidationIncentive: number,
  },
  liquidityPositions: {[id: string]: LiquidityPosition},
  marketInfo: {
    lastPeriodGlobalInterestAccrued: number,
    collateralizationRequirement: number,
    minPositionSize: number,
    twapDuration: number,
    interestPortionToLenders: number,
    periodLength: number,
    firstPeriod: number,
    valueOfLendTokensInHue: number,
  },
  poolsCurrentData: {
    [key in string]: {
      instantTick: number
      twapTick: number
      poolLiquidity: string
      cumulativeLiquidity: string
      totalRewards: string
      lastPeriodGlobalRewardsAccrued: number
      currentPeriod: number
    }
  },
  poolsMetadata: { [key: string]: poolMetadata}
  positions: { [key: number]: Position },
  pricesInfo: {
    ethPrice: number,
  },
  ratesInfo: {
    positiveInterestRate: boolean,
    interestRateAbsoluteValue: number,
    referencePools: string[]
  },
  rewardsInfo: {
    twapDuration: number
    liquidationPenalty: number
    weth: string
    countPools: number
    firstPeriod: number
    periodLength: number
  },
  sdi: {
    debt: number
    totalTCPRewards: number
    cumulativeDebt: number
    debtExchangeRate: number
  },
}

export type FetchNode = keyof FetchNodes

const fetchNodes: {[node in keyof FetchNodes]: FetchNodes[node] | null} = {
  chainID: null,
  governor: null,
  protocolDataAggregator: null,
  trustlessMulticall: null,
  userAddress: null,

  balances: null,
  contracts: null,
  currentChainInfo: null,
  governorInfo: null,
  liquidationsInfo: null,
  liquidityPositions: null,
  marketInfo: null,
  poolsCurrentData: null,
  poolsMetadata: null,
  positions: null,
  pricesInfo: null,
  ratesInfo: null,
  rewardsInfo: null,
  sdi: null,
}

export type NonNull<O> = {
  [K in keyof O]-?: NonNullable<O[K]>
}

const allPossibleArgs =
  Object.fromEntries(
    Object.entries(fetchNodes)
      .map(([key, _val]) => [key, null])
  ) as { [key in FetchNode]: FetchNodes[key] | null}

export const getThunkDependencies = <R extends FetchNode>(val: R[]) =>
  Object.fromEntries(val.map(key => [key, allPossibleArgs[key]])) as Pick<typeof allPossibleArgs, R>
