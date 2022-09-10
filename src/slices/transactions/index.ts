import { PayloadAction, createAsyncThunk, ThunkDispatch, AnyAction } from '@reduxjs/toolkit'
import { assertUnreachable } from '../../utils'
import { setWaitingForMetamask, setNotWaitingForMetamask } from '../wallet'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'
import { ethers, ContractTransaction } from 'ethers'
import ProtocolContract, { RootContract } from '../contracts/ProtocolContract'
import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import {
  Market, Rewards, Governor, Hue, LendHue, TruEth,
  TestnetMultiMint, ProtocolDataAggregator,
 } from '@trustlessfi/typechain'
import {
  TrustlessPyramidNft
} from '../../pyramid-artifacts/typechain'
import getContract, { contract } from '../../utils/getContract'
import { scale, timeMS } from '../../utils'
import { UIID } from '../../constants'
import { mnt, parseMetamaskError, extractRevertReasonString } from '../../utils'
import { uint256Max } from '../../utils/'
import { ChainID } from '@trustlessfi/addresses'
import { ERC20 } from '@trustlessfi/typechain'
import { numDisplay } from '../../utils'
import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import allSlices from '../allSlices'
import { AppDispatch } from '../../app/store'
import {
  setApprovingEth,
  setApprovingHue,
  setApprovingLendHue,
  setApprovingPool,
} from '../onboarding'
import { reportError, ErrorType } from '../../components/Errors'

export enum TransactionType {
  CreatePosition = 'CreatePosition',
  UpdatePosition = 'UpdatePosition',
  IncreaseStake = 'IncreaseStake',
  DecreaseStake = 'DecreaseStake',
  ApproveHue = 'ApproveHue',
  ApproveLendHue = 'ApproveLendHue',
  ApproveEth = 'ApproveEth',
  ClaimAllLiquidityPositionRewards = 'ClaimAllLiquidityPositionRewards',
  ClaimAllPositionRewards = 'ClaimAllPositionRewards',
  ApprovePoolToken = 'ApprovePoolToken',
  AddLiquidity = 'AddLiquidity',
  RemoveLiquidity = 'RemoveLiquidity',

  MintTruEth = 'MintTruEth',
  TestnetMultiMint = 'TestnetMultiMint',
  AddMintTruEthAuth = 'AddMintTruEthAuth',
  RemoveMintTruEthAuth = 'RemoveMintTruEthAuth',
  AddMintTruEthAdmin = 'AddMintTruEthAdmin',
  RemoveMintTruEthAdmin = 'RemoveMintTruEthAdmin',

  SetPhaseOneStartTime = 'SetPhaseOneStartTime',

  IncrementCounter = 'IncrementCounter',

  MintNftPyramid = 'MintNftPyramid',
}

export enum TransactionStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failure = 'Failure',
}

export interface txCreatePosition {
  type: TransactionType.CreatePosition
  collateralCount: number,
  debtCount: number,
  Market: string,
}

export interface txUpdatePosition {
  type: TransactionType.UpdatePosition
  positionID: number,
  collateralIncrease: number,
  debtIncrease: number,
  Market: string,
}

export interface txStake {
  type: TransactionType.IncreaseStake
  count: number,
  Market: string,
}

export interface txWithdraw {
  type: TransactionType.DecreaseStake
  count: number,
  Market: string,
}

export interface txClaimPositionRewards {
  type: TransactionType.ClaimAllPositionRewards
  positionIDs: number[]
  Market: string
}

export interface txClaimLiquidityPositionRewards {
  type: TransactionType.ClaimAllLiquidityPositionRewards
  Rewards: string
  poolIDs: number[]
}

export interface txApprovePoolToken {
  type: TransactionType.ApprovePoolToken
  tokenAddress: string
  Rewards: string
  symbol: string
}

export interface txApproveHue {
  type: TransactionType.ApproveHue
  Hue: string
  spenderAddress: string
}

export interface txApproveLendHue {
  type: TransactionType.ApproveLendHue
  LendHue: string
  spenderAddress: string
}

export interface txApproveEth {
  type: TransactionType.ApproveEth
  Eth: string
  spenderAddress: string
}

interface tokenInfo {
  count: number
  decimals: number
  isWeth: boolean
}

export interface txAddLiquidity {
  type: TransactionType.AddLiquidity
  poolID: number
  token0: tokenInfo
  token1: tokenInfo
  Rewards: string
}

export interface txRemoveLiquidity {
  type: TransactionType.RemoveLiquidity
  poolID: number
  Rewards: string
  liquidity: string
  amount0Min: string
  amount1Min: string
  liquidityPercentage: number
  poolName: string
}

export interface txApproveLendHue {
  type: TransactionType.ApproveLendHue
  LendHue: string
  spenderAddress: string
}

export interface txMintTruEth {
  type: TransactionType.MintTruEth
  amount: number
  addresses: string[]
  truEth: string
}

export interface txTestnetMultiMint {
  type: TransactionType.TestnetMultiMint
  testnetMultiMint: string
  chainEth: string
  chainEthCount: number
  truEthCount: number
  addresses: string[]
}

export interface txAddMintTruEthAuth {
  type: TransactionType.AddMintTruEthAuth
  address: string
  truEth: string
}

export interface txRemoveMintTruEthAuth {
  type: TransactionType.RemoveMintTruEthAuth
  address: string
  truEth: string
}

export interface txAddMintTruEthAdmin {
  type: TransactionType.AddMintTruEthAdmin
  address: string
  truEth: string
}

export interface txRemoveMintTruEthAdmin {
  type: TransactionType.RemoveMintTruEthAdmin
  address: string
  truEth: string
}

export interface txSetPhaseOneStartTime {
  type: TransactionType.SetPhaseOneStartTime
  startTime: number
  Governor: string
}

export interface txIncrementCounter {
  type: TransactionType.IncrementCounter
  counterValue: number
  dataAggregator: string
}

export interface txMintNftPyramid {
  type: TransactionType.MintNftPyramid
  price: number
  NftPyramid: string
  countToMint: number
}

export type TransactionArgs =
  | txCreatePosition
  | txUpdatePosition
  | txStake
  | txWithdraw
  | txClaimPositionRewards
  | txClaimLiquidityPositionRewards
  | txApprovePoolToken
  | txApproveHue
  | txApproveLendHue
  | txApproveEth
  | txAddLiquidity
  | txRemoveLiquidity

  | txMintTruEth
  | txTestnetMultiMint
  | txAddMintTruEthAuth
  | txRemoveMintTruEthAuth
  | txAddMintTruEthAdmin
  | txRemoveMintTruEthAdmin

  | txSetPhaseOneStartTime
  | txIncrementCounter

  | txMintNftPyramid

export interface TransactionData {
  args: TransactionArgs
  openTxTab: () => void
  userAddress: string
  chainID: ChainID
}

export type TransactionInfo = {
  hash: string
  nonce: number
  userAddress: string
  type: TransactionType
  status: TransactionStatus
  startTimeMS: number
  chainID: ChainID
  args: TransactionArgs
}

export type TransactionState = {[hash: string]: TransactionInfo}

export const getTxLongName = (args: TransactionArgs): string => {
  const type = args.type
  switch(type) {
    case TransactionType.CreatePosition:
      if (args.debtCount === 0) return 'Create Position without debt'
      return 'Create Position with ' + numDisplay(args.debtCount) + ' Hue debt'
    case TransactionType.UpdatePosition:
      return 'Update position ' + args.positionID
    case TransactionType.IncreaseStake:
      return 'Lend ' + numDisplay(args.count) + ' Hue'
    case TransactionType.DecreaseStake:
      return 'Withdraw ' + numDisplay(args.count) + ' Hue'
    case TransactionType.ApproveHue:
      return 'Approve Hue'
    case TransactionType.ApproveLendHue:
      return 'Approve Withdraw'
    case TransactionType.ApproveEth:
      return 'Approve Eth'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve ' + args.symbol
    case TransactionType.AddLiquidity:
      return 'Add liquidity to pool ' + args.poolID
    case TransactionType.RemoveLiquidity:
      return `Withdraw ${numDisplay(args.liquidityPercentage)}% of liquidity from pool ${args.poolName}`

    case TransactionType.MintTruEth:
      return `Mint ${numDisplay(args.amount)} TruEth to ${args.addresses.length} ${args.addresses.length === 1 ? 'address' : 'addresses'}`
    case TransactionType.TestnetMultiMint:
      return `Mint testnet Eth and ${numDisplay(args.truEthCount)} TruEth to ${args.addresses.length} ${args.addresses.length === 1 ? 'address' : 'addresses'}`
    case TransactionType.AddMintTruEthAuth:
      return `Approved ${args.address} for minting TruEth`
    case TransactionType.RemoveMintTruEthAuth:
      return `Unapproved ${args.address} for spending TruEth`
    case TransactionType.AddMintTruEthAdmin:
      return `Added TruEth minting admin ${args.address}`
    case TransactionType.RemoveMintTruEthAdmin:
      return `Removed TruEth minting admin ${args.address}`

    case TransactionType.SetPhaseOneStartTime:
      return `Set phase 1 start time: ${args.startTime}`

    case TransactionType.IncrementCounter:
      return `Increment counter from: ${args.counterValue}`

    case TransactionType.MintNftPyramid:
      return `Mint ${args.countToMint} Pyramid Nfts`
  }
}

export const getTxShortName = (type: TransactionType): string => {
  switch(type) {
    case TransactionType.CreatePosition:
      return 'Create Position'
    case TransactionType.UpdatePosition:
      return 'Update position'
    case TransactionType.IncreaseStake:
      return 'Lend Hue'
    case TransactionType.DecreaseStake:
      return 'Withdraw Hue'
    case TransactionType.ApproveHue:
      return 'Approve Hue'
    case TransactionType.ApproveLendHue:
      return 'Approve Withdraw'
    case TransactionType.ApproveEth:
      return 'Approve Eth'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve Token'
    case TransactionType.AddLiquidity:
      return 'Add Liquidity'
    case TransactionType.RemoveLiquidity:
      return 'Withdraw Liquidity'

    case TransactionType.MintTruEth:
      return 'Mint Eth ERC20'
    case TransactionType.TestnetMultiMint:
      return 'Mint Testnet Assets'
    case TransactionType.AddMintTruEthAuth:
      return `Approved address for minting TruEth`
    case TransactionType.RemoveMintTruEthAuth:
      return `Unapproved address for minting TruEth`
    case TransactionType.AddMintTruEthAdmin:
      return `Added address for TruEth minting admin`
    case TransactionType.RemoveMintTruEthAdmin:
      return `Removed address for TruEth minting admin`

    case TransactionType.SetPhaseOneStartTime:
      return `Set phase 1 start time`

    case TransactionType.IncrementCounter:
      return `Increment counter`

    case TransactionType.MintNftPyramid:
      return `Mint Pyramid Nfts`
  }
}

export const getTxIDFromArgs = (args: TransactionArgs): string => {
  const type = args.type

  const getApproveID = (tokenAddress: string, spenderAddress: string) =>
    ['approve', tokenAddress, spenderAddress].join(':')

  switch(type) {
    case TransactionType.ApproveHue:
      return getApproveID(args.Hue, args.spenderAddress)
    case TransactionType.ApproveLendHue:
      return getApproveID(args.LendHue, args.spenderAddress)
    case TransactionType.ApproveEth:
      return getApproveID(args.Eth, args.spenderAddress)
    case TransactionType.ApprovePoolToken:
      return getApproveID(args.tokenAddress, args.Rewards)
    case TransactionType.CreatePosition:
    case TransactionType.UpdatePosition:
    case TransactionType.IncreaseStake:
    case TransactionType.DecreaseStake:
    case TransactionType.ClaimAllPositionRewards:
    case TransactionType.ClaimAllLiquidityPositionRewards:
    case TransactionType.AddLiquidity:
    case TransactionType.RemoveLiquidity:
    case TransactionType.MintTruEth:
    case TransactionType.TestnetMultiMint:
    case TransactionType.AddMintTruEthAuth:
    case TransactionType.RemoveMintTruEthAuth:
    case TransactionType.SetPhaseOneStartTime:
    case TransactionType.AddMintTruEthAdmin:
    case TransactionType.RemoveMintTruEthAdmin:
    case TransactionType.IncrementCounter:
    case TransactionType.MintNftPyramid:
      return type
  }
}

export const getTxErrorName = (type: TransactionType) => getTxShortName(type) + ' Failed'

const executeTransaction = async (
  args: TransactionArgs,
  provider: ethers.providers.Web3Provider,
): Promise<ContractTransaction> => {
  const overrides = {}

  const getMarket = (address: string) =>
    getContract<Market>(ProtocolContract.Market, address)
      .connect(provider.getSigner())

  const getRewards = (address: string) =>
    getContract<Rewards>(ProtocolContract.Rewards, address)
      .connect(provider.getSigner())

  const getEthERC20 = (address: string) =>
    getContract<TruEth>(ProtocolContract.TruEth, address)
      .connect(provider.getSigner())

  const getGovernor = (address: string) =>
    getContract<Governor>(RootContract.Governor, address)
      .connect(provider.getSigner())

  const getHue = (address: string) =>
    getContract<Hue>(ProtocolContract.Hue, address)
      .connect(provider.getSigner())

  const getLendHue = (address: string) =>
    getContract<LendHue>(ProtocolContract.LendHue, address)
      .connect(provider.getSigner())

  const getERC20 = (address: string) =>
    contract<ERC20>({address, abi: erc20Artifact.abi})
      .connect(provider.getSigner())

  const getTestnetMultiMint = (address: string) =>
    getContract<TestnetMultiMint>(RootContract.TestnetMultiMint, address)
      .connect(provider.getSigner())

  const getProtocolDataAggregator = (address: string) =>
    getContract<ProtocolDataAggregator>(RootContract.ProtocolDataAggregator, address)
      .connect(provider.getSigner())

  const getNftPyramid = (address: string) =>
    getContract<TrustlessPyramidNft>(RootContract.NftPyramid, address)
      .connect(provider.getSigner())

  const type = args.type

  switch(type) {
    case TransactionType.CreatePosition:
      return await getMarket(args.Market).createPosition(scale(args.collateralCount), scale(args.debtCount), UIID, overrides)

    case TransactionType.UpdatePosition:
      return await getMarket(args.Market).adjustPosition(
        args.positionID,
        mnt(args.debtIncrease),
        args.collateralIncrease > 0 ? mnt(args.collateralIncrease) : 0,
        args.collateralIncrease < 0 ? mnt(Math.abs(args.collateralIncrease)) : 0,
        UIID,
        overrides
      )
    case TransactionType.IncreaseStake:
      return await getMarket(args.Market).lend(scale(args.count), overrides )

    case TransactionType.DecreaseStake:
      return await getMarket(args.Market).unlend(scale(args.count), overrides)

    case TransactionType.ClaimAllPositionRewards:
      return await getMarket(args.Market).claimAllRewards(args.positionIDs, UIID, overrides)

    case TransactionType.ClaimAllLiquidityPositionRewards:
      return await getRewards(args.Rewards).claimAllRewards(args.poolIDs, UIID, overrides)

    case TransactionType.ApprovePoolToken:
      return await getERC20(args.tokenAddress).approve(args.Rewards, uint256Max, overrides)

    case TransactionType.ApproveHue:
      return await getHue(args.Hue).approve(args.spenderAddress, uint256Max, overrides)

    case TransactionType.ApproveLendHue:
      return await getLendHue(args.LendHue).approve(args.spenderAddress, uint256Max, overrides)

    case TransactionType.ApproveEth:
      return await getEthERC20(args.Eth).approve(args.spenderAddress, uint256Max, overrides)

    case TransactionType.AddLiquidity:
      const amount0Desired = scale(args.token0.count, args.token0.decimals)
      const amount1Desired = scale(args.token1.count, args.token1.decimals)
      const amount0Min = amount0Desired.mul(95).div(100)
      const amount1Min = amount1Desired.mul(95).div(100)

      return await getRewards(args.Rewards).deposit(
        {
          poolID: args.poolID,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
        },
        UIID,
        overrides,
      )

    case TransactionType.RemoveLiquidity:
      return await getRewards(args.Rewards).withdraw(
        {
          poolID: args.poolID,
          liquidity: args.liquidity,
          amount0Min: args.amount0Min,
          amount1Min: args.amount1Min,
        },
        UIID,
        overrides
      )

    case TransactionType.SetPhaseOneStartTime:
      return await getGovernor(args.Governor).setPhaseOneStartTime(args.startTime, overrides )

    case TransactionType.MintTruEth:
      return await getEthERC20(args.truEth).mint(scale(args.amount), args.addresses, overrides )

    case TransactionType.TestnetMultiMint:
      return await getTestnetMultiMint(args.testnetMultiMint).multiMint(
        scale(args.truEthCount),
        args.addresses,
        {...overrides, value: scale(args.chainEthCount) }
      )

    case TransactionType.AddMintTruEthAuth:
      return await getEthERC20(args.truEth).addMinter(args.address, overrides)

    case TransactionType.RemoveMintTruEthAuth:
      return await getEthERC20(args.truEth).removeMinter(args.address, overrides)

    case TransactionType.AddMintTruEthAdmin:
      return await getEthERC20(args.truEth).addAdmin(args.address, overrides)

    case TransactionType.RemoveMintTruEthAdmin:
      return await getEthERC20(args.truEth).removeAdmin(args.address, overrides)

    case TransactionType.IncrementCounter:
      return await getProtocolDataAggregator(args.dataAggregator).incrementCounter()

    case TransactionType.MintNftPyramid:
      return await getNftPyramid(args.NftPyramid).mint(args.countToMint, { value: scale(args.countToMint * args.price)})

    default:
      assertUnreachable(type)
  }
  throw new Error('Shoudnt get here')
}

export const waitForTransaction = async (
  tx: TransactionInfo,
  provider: ethers.providers.Web3Provider,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const receipt = await provider.waitForTransaction(tx.hash)

  const succeeded = receipt.status === 1
  if (succeeded) {
    dispatch(transactionSucceeded(tx.hash))
  } else {
    dispatch(addNotification({
      type: tx.type,
      userAddress: tx.userAddress,
      status: TransactionStatus.Failure,
      hash: tx.hash,
      chainID: tx.chainID,
    }))
    dispatch(transactionFailed(tx.hash))
  }

  if (succeeded) {
    const type = tx.args.type

    const goToLiquidityBasePage = () => dispatch(allSlices.liquidityPage.slice.actions.incrementNonce())

    const clearPositions = () => dispatch(allSlices.positions.slice.actions.clearData())
    const clearSDI = () => dispatch(allSlices.sdi.slice.actions.clearData())
    const clearMarketInfo = () => dispatch(allSlices.marketInfo.slice.actions.clearData())
    const clearBalances = () => dispatch(allSlices.balances.slice.actions.clearData())
    const clearRewardsInfo = () => dispatch(allSlices.rewardsInfo.slice.actions.clearData())
    const clearPoolsCurrentData = () => dispatch(allSlices.poolsCurrentData.slice.actions.clearData())
    const clearStaking = () => dispatch(allSlices.staking.slice.actions.clearData())
    const clearTruEth = () => dispatch(allSlices.truEthInfo.slice.actions.clearData())
    const clearTcpTimelock = () => dispatch(allSlices.tcpTimelock.slice.actions.clearData())
    const clearTcpAllocation = () => dispatch(allSlices.tcpAllocation.slice.actions.clearData())
    const clearCounterInfo = () => dispatch(allSlices.counterInfo.slice.actions.clearData())

    const clearMarketState = () => {
      clearSDI()
      clearMarketInfo()
      clearBalances()
      clearPositions()
      clearStaking()
    }

    const clearLiquidityState = () => {
      clearBalances()
      clearPoolsCurrentData()
      goToLiquidityBasePage()
      clearRewardsInfo()
    }

    switch (type) {
      case TransactionType.CreatePosition:
        dispatch(setApprovingEth(false))
        clearMarketState()
        break
      case TransactionType.UpdatePosition:
        dispatch(setApprovingHue(false))
        clearMarketState()
        break
      case TransactionType.IncreaseStake:
        dispatch(setApprovingHue(false))
        clearMarketState()
        break
      case TransactionType.DecreaseStake:
        dispatch(setApprovingLendHue(false))
        clearMarketState()
        break
      case TransactionType.ClaimAllPositionRewards:
        clearPositions()
        clearMarketInfo()
        clearBalances()
        clearTcpAllocation()
        break
      case TransactionType.ClaimAllLiquidityPositionRewards:
        clearRewardsInfo()
        clearBalances()
        clearTcpAllocation()
        clearPoolsCurrentData()
        break
      case TransactionType.ApprovePoolToken:
      case TransactionType.ApproveHue:
      case TransactionType.ApproveLendHue:
      case TransactionType.ApproveEth:
        clearBalances()
        break
      case TransactionType.AddLiquidity:
        clearLiquidityState()
        dispatch(setApprovingPool({poolID: tx.args.poolID, approving: false}))
        break
      case TransactionType.RemoveLiquidity:
        clearLiquidityState()
        break
      case TransactionType.SetPhaseOneStartTime:
        clearTcpTimelock()
        break

      case TransactionType.MintTruEth:
        clearTruEth()
        clearBalances()
        break
      case TransactionType.IncrementCounter:
        clearCounterInfo()
        break
      case TransactionType.AddMintTruEthAuth:
      case TransactionType.RemoveMintTruEthAuth:
      case TransactionType.AddMintTruEthAdmin:
      case TransactionType.RemoveMintTruEthAdmin:
        clearTruEth()
        break

      case TransactionType.TestnetMultiMint:
      case TransactionType.MintNftPyramid:
        // TODO show the user's NFTs and stuff
        // Do nothing
        break
    default:
      assertUnreachable(type)
    }
  }

  return succeeded
}

export const submitTransaction = createAsyncThunk(
  'transactions/submitTransaction',
  async (data: TransactionData, {dispatch}): Promise<void> => {
    const args = data.args
    const userAddress = data.userAddress
    const chainId = data.chainID

    const provider = getProvider()

    let tx = {
      hash: '',
      nonce: 0,
      userAddress,
      startTimeMS: timeMS(),
      type: args.type,
      status: TransactionStatus.Pending,
      chainID: data.chainID,
      args: data.args,
    }

    let rawTransaction: ContractTransaction
    try {
      dispatch(setWaitingForMetamask(getTxIDFromArgs(args)))
      rawTransaction = await executeTransaction(args, provider)
      dispatch(setNotWaitingForMetamask())
    } catch (e) {
      const errorMessages = parseMetamaskError(e)

      const reasonString =
        errorMessages.messages.length > 0
        ? extractRevertReasonString(errorMessages.messages[0])
        : null

      if (errorMessages.code !== 4001) {
        reportError({
          errorType: ErrorType.TransactionError,
          error: e as any,
          address: userAddress,
          chainId,
          transactionInfo: tx,
        }, dispatch as AppDispatch)

        dispatch(addNotification({
          type: args.type,
          userAddress,
          status: TransactionStatus.Failure,
          chainID: data.chainID,
          message: reasonString ? reasonString : errorMessages.messages.join(', ')
        }))
      }
      dispatch(setNotWaitingForMetamask())
      return
    }

    tx.hash = rawTransaction.hash
    tx.nonce = rawTransaction.nonce

    dispatch(transactionCreated(tx))

    data.openTxTab()
  })

const transactionsSlice = createLocalSlice({
  name: 'transactions',
  initialState: {} as TransactionState,
  stateSelector: (state: RootState) => state.transactions,
  cacheDuration: CacheDuration.INFINITE,
  reducers: {
    clearUserTransactions: (state, action: PayloadAction<string>) => {
      const userAddress = action.payload
      return Object.fromEntries(
               Object.values(state)
                 .filter(tx => tx.userAddress !== userAddress)
                   .map(tx => [tx.hash, tx]))
    },
    transactionCreated: (state, action: PayloadAction<TransactionInfo>) => {
      const txInfo = action.payload
      state[txInfo.hash] = txInfo
    },
    transactionSucceeded: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      if (state.hasOwnProperty(hash)) {
        state[hash].status = TransactionStatus.Success
      }
    },
    transactionFailed: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      if (state.hasOwnProperty(hash)) {
        state[hash].status = TransactionStatus.Failure
      }
    },
  }
})

export const {
  clearUserTransactions,
  transactionCreated,
  transactionSucceeded,
  transactionFailed,
} = transactionsSlice.slice.actions

export default transactionsSlice
