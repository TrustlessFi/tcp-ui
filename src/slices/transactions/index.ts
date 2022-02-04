import { Contract } from 'ethers'
import { PayloadAction, createAsyncThunk, ThunkDispatch, AnyAction } from '@reduxjs/toolkit'
import { assertUnreachable } from '../../utils'
import { waitingForMetamask, metamaskComplete } from '../wallet'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'
import { ethers, ContractTransaction } from 'ethers'
import ProtocolContract from '../contracts/ProtocolContract'
import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { Market, Rewards } from '@trustlessfi/typechain'
import getContract from '../../utils/getContract'
import { scale, SLIPPAGE_TOLERANCE, timeMS } from '../../utils'
import { UIID } from '../../constants'
import { days, minutes, mnt, parseMetamaskError, extractRevertReasonString } from '../../utils'
import { zeroAddress, bnf, uint256Max } from '../../utils/'
import { ChainID } from '@trustlessfi/addresses'
import { ERC20 } from '@trustlessfi/typechain'
import { numDisplay } from '../../utils'
import { createLocalSlice, CacheDuration } from '../'
import { clearStakeState } from '../../slices/stakeState'
import { RootState } from '../fetchNodes'
import allSlices from '../allSlices'
import { clearPositionState } from '../positionState'

export enum WalletToken {
  Hue = 'Hue',
  LendHue = 'LendHue',
  Tcp = 'Tcp',
}

export enum TransactionType {
  CreatePosition,
  UpdatePosition,
  IncreaseStake,
  DecreaseStake,
  ApproveHue,
  ApproveLendHue,
  CreateLiquidityPosition,
  IncreaseLiquidityPosition,
  DecreaseLiquidityPosition,
  DeleteLiquidityPosition,
  ClaimAllLiquidityPositionRewards,
  ClaimAllPositionRewards,
  ApprovePoolToken,
}

export enum TransactionStatus {
  Pending,
  Success,
  Failure,
}

export interface txCreatePositionArgs {
  type: TransactionType.CreatePosition
  collateralCount: number,
  debtCount: number,
  Market: string,
}

export interface txUpdatePositionArgs {
  type: TransactionType.UpdatePosition
  positionID: number,
  collateralIncrease: number,
  debtIncrease: number,
  Market: string,
}

export interface txLendArgs {
  type: TransactionType.IncreaseStake
  count: number,
  Market: string,
}

export interface txWithdrawArgs {
  type: TransactionType.DecreaseStake
  count: number,
  Market: string,
}

export interface txCreateLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.CreateLiquidityPosition
  currentBlockTimestamp: number
  token0: string
  token0Decimals: number
  token0IsWeth: boolean
  token1: string
  token1Decimals: number
  token1IsWeth: boolean
  fee: number
  tickLower: number
  tickUpper: number
  amount0Desired: number
  amount0Min: number
  amount1Desired: number
  amount1Min: number
  trustlessMulticall: string
  Rewards: string
}

export interface txIncreaseLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.IncreaseLiquidityPosition
  currentBlockTimestamp: number
  positionID: number
  token0Increase: number
  token0Decimals: number
  token0IsWeth: boolean
  token1Increase: number
  token1Decimals: number
  token1IsWeth: boolean
  Rewards: string
  trustlessMulticall: string
}

export interface txDecreaseLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.DecreaseLiquidityPosition
  currentBlockTimestamp: number
  positionID: number
  token0Decrease: number
  token0Decimals: number
  token1Decrease: number
  token1Decimals: number
  liquidity: string
  Rewards: string
  trustlessMulticall: string
}

export interface txDeleteLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.DeleteLiquidityPosition
  currentBlockTimestamp: number
  positionID: number
  token0Decrease: number
  token0Decimals: number
  token1Decrease: number
  token1Decimals: number
  Rewards: string
  trustlessMulticall: string
}

export interface txClaimPositionRewards {
  type: TransactionType.ClaimAllPositionRewards
  positionIDs: number[]
  Market: string
}

export interface txClaimLiquidityPositionRewards {
  type: TransactionType.ClaimAllLiquidityPositionRewards
  positionIDs: string[]
  Rewards: string
}

export interface txApprovePoolToken {
  type: TransactionType.ApprovePoolToken
  tokenAddress: string
  Rewards: string
  poolAddress: string,
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

export type TransactionArgs =
  txCreatePositionArgs |
  txUpdatePositionArgs |
  txLendArgs |
  txWithdrawArgs |
  txCreateLiquidityPositionArgs |
  txIncreaseLiquidityPositionArgs |
  txDecreaseLiquidityPositionArgs |
  txDeleteLiquidityPositionArgs |
  txClaimPositionRewards |
  txClaimLiquidityPositionRewards |
  txApprovePoolToken |
  txApproveHue |
  txApproveLendHue

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
    case TransactionType.CreateLiquidityPosition:
      return 'Create Liquidity Position'
    case TransactionType.IncreaseLiquidityPosition:
      return 'Increase Liquidity Position ' + args.positionID
    case TransactionType.DecreaseLiquidityPosition:
      return 'Decrease Liquidity Position ' + args.positionID
    case TransactionType.DeleteLiquidityPosition:
      return 'Delete Liquidity Position ' + args.positionID
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve ' + args.symbol
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
    case TransactionType.CreateLiquidityPosition:
      return 'Create Liquidity Position'
    case TransactionType.IncreaseLiquidityPosition:
      return 'Increase Liquidity Position'
    case TransactionType.DecreaseLiquidityPosition:
      return 'Decrease Liquidity Position'
    case TransactionType.DeleteLiquidityPosition:
      return 'Delete Liquidity Position'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve Token'
    default:
      assertUnreachable(type)
  }
  return ''
}

// TODO remove
const getTokenAssociatedWithTx = (type: TransactionType): WalletToken | null => {
  switch(type) {
    case TransactionType.CreatePosition:
    case TransactionType.UpdatePosition:
    case TransactionType.DecreaseStake:
    case TransactionType.ApproveHue:
      return WalletToken.Hue
    case TransactionType.ApproveLendHue:
    case TransactionType.IncreaseStake:
      return WalletToken.LendHue
    case TransactionType.ClaimAllPositionRewards:
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return WalletToken.Tcp
    case TransactionType.CreateLiquidityPosition:
    case TransactionType.IncreaseLiquidityPosition:
    case TransactionType.DecreaseLiquidityPosition:
    case TransactionType.DeleteLiquidityPosition:
    case TransactionType.ApprovePoolToken:
      return null
    default:
      assertUnreachable(type)
  }
  return null
}

export const getTxErrorName = (type: TransactionType) => getTxShortName(type) + ' Failed'

const getUniswapTxDeadline = (chainID: ChainID, currentBlockTimestamp: number) =>
  currentBlockTimestamp + (chainID === ChainID.Hardhat ? days(1) : minutes(20))

const executeTransaction = async (
  args: TransactionArgs,
  provider: ethers.providers.Web3Provider,
): Promise<ContractTransaction> => {
  const getMarket = (address: string) =>
    getContract(address, ProtocolContract.Market)
      .connect(provider.getSigner()) as Market

  const getRewards = (address: string) =>
    getContract(address, ProtocolContract.Rewards)
      .connect(provider.getSigner()) as Rewards

  const type = args.type

  let rewards

  switch(type) {
    case TransactionType.CreatePosition:
      return await getMarket(args.Market).createPosition(scale(args.debtCount), UIID, {
        value: scale(args.collateralCount)
      })

    case TransactionType.UpdatePosition:
      return await getMarket(args.Market).adjustPosition(
        args.positionID,
        mnt(args.debtIncrease),
        args.collateralIncrease < 0 ? mnt(Math.abs(args.collateralIncrease)) : 0,
        UIID,
        { value: (args.collateralIncrease > 0 ? mnt(args.collateralIncrease) : 0) }
      )
    case TransactionType.IncreaseStake:
      return await getMarket(args.Market).lend(scale(args.count))

    case TransactionType.DecreaseStake:
      return await getMarket(args.Market).unlend(scale(args.count))

    case TransactionType.CreateLiquidityPosition:
      rewards = getRewards(args.Rewards)

      const amount0Desired = bnf(mnt(args.amount0Desired, args.token0Decimals))
      const amount1Desired = bnf(mnt(args.amount1Desired, args.token1Decimals))

      const ethCount = (args.token0IsWeth ? amount0Desired : bnf(0)).add(args.token1IsWeth ? amount1Desired : bnf(0))

      return await rewards.createLiquidityPosition({
        token0: args.token0,
        token1: args.token1,
        fee: args.fee,
        tickLower: args.tickLower,
        tickUpper: args.tickUpper,
        amount0Desired,
        amount0Min: bnf(mnt(args.amount0Min, args.token0Decimals)),
        amount1Desired,
        amount1Min: bnf(mnt(args.amount1Min, args.token1Decimals)),
        recipient: zeroAddress,
        deadline: getUniswapTxDeadline(args.chainID, args.currentBlockTimestamp)
      },
      UIID,
      {value: ethCount}
    )

    case TransactionType.IncreaseLiquidityPosition:
      rewards = getRewards(args.Rewards)

      const token0Increase = bnf(mnt(args.token0Increase, args.token0Decimals))
      const token1Increase = bnf(mnt(args.token1Increase, args.token1Decimals))

      const ethIncrease = (args.token0IsWeth ? token0Increase : bnf(0)).add(args.token1IsWeth ? token1Increase : bnf(0))

      return await rewards.increaseLiquidityPosition({
        tokenId: args.positionID,
        amount0Desired: token0Increase,
        amount0Min: token0Increase.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        amount1Desired: token1Increase,
        amount1Min: token1Increase.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        deadline: getUniswapTxDeadline(args.chainID, args.currentBlockTimestamp)
      }, UIID, {value: ethIncrease})

    case TransactionType.DecreaseLiquidityPosition:
      rewards = getRewards(args.Rewards)

      const token0DecreaseA = bnf(mnt(args.token0Decrease, args.token0Decimals))
      const token1DecreaseA = bnf(mnt(args.token1Decrease, args.token1Decimals))

      return await rewards.decreaseLiquidityPosition({
        tokenId: args.positionID,
        amount0Min: token0DecreaseA.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        amount1Min: token1DecreaseA.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        liquidity: args.liquidity,
        deadline: getUniswapTxDeadline(args.chainID, args.currentBlockTimestamp)
      }, UIID)

    case TransactionType.DeleteLiquidityPosition:
      rewards = getRewards(args.Rewards)

      const token0DecreaseB = bnf(mnt(args.token0Decrease, args.token0Decimals))
      const token1DecreaseB = bnf(mnt(args.token1Decrease, args.token1Decimals))

      return await rewards.removeLiquidityPosition({
        tokenId: args.positionID,
        amount0Min: token0DecreaseB.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        amount1Min: token1DecreaseB.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        liquidity: 0,
        deadline: getUniswapTxDeadline(args.chainID, args.currentBlockTimestamp)
      })

    case TransactionType.ClaimAllPositionRewards:
      return await getMarket(args.Market).claimAllRewards(args.positionIDs, UIID)

    case TransactionType.ClaimAllLiquidityPositionRewards:
      return await getRewards(args.Rewards).claimAllRewards(args.positionIDs, UIID)

    case TransactionType.ApprovePoolToken:
      const tokenContract = new Contract(args.tokenAddress, erc20Artifact.abi, provider) as ERC20

      return await tokenContract.connect(provider.getSigner()).approve(args.Rewards, uint256Max)

    case TransactionType.ApproveHue:
      const hue = new Contract(args.Hue, erc20Artifact.abi, provider) as ERC20
      return await hue.connect(provider.getSigner()).approve(args.spenderAddress, uint256Max)

    case TransactionType.ApproveLendHue:
      const lendHue = new Contract(args.LendHue, erc20Artifact.abi, provider) as ERC20
      return await lendHue.connect(provider.getSigner()).approve(args.spenderAddress, uint256Max)

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
    const type = tx.type

    const clearPositions = () => dispatch(allSlices.positions.slice.actions.clearData())
    const clearMarketInfo = () => dispatch(allSlices.marketInfo.slice.actions.clearData())
    const clearBalances = () => dispatch(allSlices.balances.slice.actions.clearData())
    const clearLiquidityPositions = () => dispatch(allSlices.liquidityPositions.slice.actions.clearData())
    const clearRewardsInfo = () => dispatch(allSlices.rewardsInfo.slice.actions.clearData())
    const clearPoolsCurrentData = () => dispatch(allSlices.poolsCurrentData.slice.actions.clearData())

    switch (type) {
      case TransactionType.CreatePosition:
      case TransactionType.UpdatePosition:
        dispatch(clearPositionState())
        clearPositions()
        clearMarketInfo()
        clearBalances()
        break
      case TransactionType.ClaimAllPositionRewards:
        clearPositions()
        clearMarketInfo()
        clearBalances()
        break
      case TransactionType.IncreaseStake:
      case TransactionType.DecreaseStake:
        dispatch(clearStakeState())
        clearBalances()
        clearMarketInfo()
        break
      case TransactionType.CreateLiquidityPosition:
      case TransactionType.IncreaseLiquidityPosition:
      case TransactionType.DecreaseLiquidityPosition:
      case TransactionType.DeleteLiquidityPosition:
        clearLiquidityPositions()
        clearRewardsInfo()
        clearPoolsCurrentData()
        clearBalances()
        break
      case TransactionType.ClaimAllLiquidityPositionRewards:
        clearLiquidityPositions()
        clearRewardsInfo()
        clearBalances()
        break
      case TransactionType.ApprovePoolToken:
      case TransactionType.ApproveHue:
      case TransactionType.ApproveLendHue:
        clearBalances()
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
      dispatch(waitingForMetamask())
      rawTransaction = await executeTransaction(args, provider)
      dispatch(metamaskComplete())
    } catch (e) {

      const errorMessages = parseMetamaskError(e)
      console.error("failureMessages: " + errorMessages.join(', '))

      const reasonString =
        errorMessages.length > 0
        ? extractRevertReasonString(errorMessages[0])
        : null

      dispatch(addNotification({
        type: args.type,
        userAddress,
        status: TransactionStatus.Failure,
        chainID: data.chainID,
        message: reasonString ? reasonString : errorMessages.join(', ')
      }))
      dispatch(metamaskComplete())
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

    // await waitForTransaction(tx, provider, dispatch)
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
