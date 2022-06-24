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
  TestnetMultiMint,
 } from '@trustlessfi/typechain'
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
import {
  setApprovingEth,
  setApprovingHue,
  setApprovingLendHue,
  setApprovingPool,
} from '../onboarding'

export enum TransactionType {
  CreatePosition,
  UpdatePosition,
  IncreaseStake,
  DecreaseStake,
  ApproveHue,
  ApproveLendHue,
  ApproveEth,
  ClaimAllLiquidityPositionRewards,
  ClaimAllPositionRewards,
  ApprovePoolToken,
  AddLiquidity,
  RemoveLiquidity,

  MintTruEth,
  TestnetMultiMint,
  AddMintTruEthAddressAuth,
  RemoveMintTruEthAddressAuth,

  SetPhaseOneStartTime,
}

export enum TransactionStatus {
  Pending,
  Success,
  Failure,
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

export interface txAddMintERC20AddressAuth {
  type: TransactionType.AddMintTruEthAddressAuth
  address: string
  truEth: string
}

export interface txRemoveMintERC20AddressAuth {
  type: TransactionType.RemoveMintTruEthAddressAuth
  address: string
  truEth: string
}

export interface txSetPhaseOneStartTime {
  type: TransactionType.SetPhaseOneStartTime
  startTime: number
  Governor: string
}

export type TransactionArgs =
  txCreatePosition |
  txUpdatePosition |
  txStake |
  txWithdraw |
  txClaimPositionRewards |
  txClaimLiquidityPositionRewards |
  txApprovePoolToken |
  txApproveHue |
  txApproveLendHue |
  txApproveEth |
  txAddLiquidity |
  txRemoveLiquidity |

  txMintTruEth |
  txTestnetMultiMint |
  txAddMintERC20AddressAuth |
  txRemoveMintERC20AddressAuth |
  txSetPhaseOneStartTime

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

export const getTxLongName = (args: TransactionArgs) => {
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
    case TransactionType.AddMintTruEthAddressAuth:
      return `Approved ${args.address} for minting TruEth`
    case TransactionType.RemoveMintTruEthAddressAuth:
      return `Unapproved ${args.address} for spending TruEth`
    case TransactionType.SetPhaseOneStartTime:
      return `Set phase 1 start time: ${args.startTime}`
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxShortName = (type: TransactionType) => {
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
    case TransactionType.AddMintTruEthAddressAuth:
      return `Approved address for minting TruEth`
    case TransactionType.RemoveMintTruEthAddressAuth:
      return `Unapproved address for minting TruEth`
    case TransactionType.SetPhaseOneStartTime:
      return `Set phase 1 start time`
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxIDFromArgs = (args: TransactionArgs) => {
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
    case TransactionType.AddMintTruEthAddressAuth:
    case TransactionType.RemoveMintTruEthAddressAuth:
    case TransactionType.SetPhaseOneStartTime:
      return (type as number).toString()
    default:
      assertUnreachable(type)
  }
  return ''
}



export const getTxErrorName = (type: TransactionType) => getTxShortName(type) + ' Failed'

const executeTransaction = async (
  args: TransactionArgs,
  provider: ethers.providers.Web3Provider,
  chainID: ChainID,
): Promise<ContractTransaction> => {
  const overrides =
    chainID === ChainID.ZKSyncGoerli
    ? { gasLimit: 21001 }
    : {}

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

    case TransactionType.AddMintTruEthAddressAuth:
      return await getEthERC20(args.truEth).addMinter(args.address, overrides)

    case TransactionType.RemoveMintTruEthAddressAuth:
      return await getEthERC20(args.truEth).removeMinter(args.address, overrides)

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
      case TransactionType.TestnetMultiMint:
      case TransactionType.AddMintTruEthAddressAuth:
      case TransactionType.RemoveMintTruEthAddressAuth:
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

    const provider = getProvider()

    let rawTransaction: ContractTransaction
    try {
      dispatch(setWaitingForMetamask(getTxIDFromArgs(args)))
      rawTransaction = await executeTransaction(args, provider, data.chainID)
      dispatch(setNotWaitingForMetamask())
    } catch (e) {
      const errorMessages = parseMetamaskError(e)
      console.error("failureMessages: " + errorMessages.messages.join(', '))

      const reasonString =
        errorMessages.messages.length > 0
        ? extractRevertReasonString(errorMessages.messages[0])
        : null

      if (errorMessages.code !== 4001) {
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

    const tx = {
      hash: rawTransaction.hash,
      nonce: rawTransaction.nonce,
      userAddress,
      startTimeMS: timeMS(),
      type: args.type,
      status: TransactionStatus.Pending,
      chainID: data.chainID,
      args: data.args,
    }

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
