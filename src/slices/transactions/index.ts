import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getLocalStorage, assertUnreachable } from '../../utils'
import { waitingForMetamask, metamaskComplete } from '../wallet'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'
import { clearPositions } from '../positions'
import { clearLiquidityPositions } from '../liquidityPositions'
import { clearEthBalance } from '../ethBalance'
import { clearHueBalance } from '../balances/hueBalance'
import { clearLendHueBalance } from '../balances/lendHueBalance'
import { ethers, ContractTransaction, BigNumber } from 'ethers'
import { ProtocolContract } from '../contracts'

import { Market, Rewards } from '@trustlessfi/typechain'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { scale, SLIPPAGE_TOLERANCE, timeMS } from '../../utils'
import { UIID } from '../../constants'
import { getDefaultTransactionTimeout, mnt, parseMetamaskError } from '../../utils'
import { zeroAddress , bnf } from '../../utils/index'
import { ChainID } from '@trustlessfi/addresses'

export enum TransactionType {
  CreatePosition,
  UpdatePosition,
  Lend,
  Withdraw,
  ApproveHue,
  ApproveLendHue,
  CreateLiquidityPosition,
  IncreaseLiquidityPosition,
  DecreaseLiquidityPosition,
  ClaimAllPositionRewards,
}

export enum TransactionStatus {
  Pending,
  Success,
  Failure,
}

export type TransactionInfo = {
  hash: string
  nonce: number
  userAddress: string
  type: TransactionType
  status: TransactionStatus
  startTimeMS: number
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
  type: TransactionType.Lend
  count: number,
  Market: string,
}

export interface txWithdrawArgs {
  type: TransactionType.Withdraw
  count: number,
  Market: string,
}

export interface txCreateLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.CreateLiquidityPosition
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
  TrustlessMulticall: string
  Rewards: string
}

export interface txIncreaseLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.IncreaseLiquidityPosition
  positionID: number
  amount0Change: number
  amount1Change: number
  Rewards: string
  TrustlessMulticall: string
}

export interface txDecreaseLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.DecreaseLiquidityPosition
  positionID: number
  amount0Min: number
  amount1Min: number
  liquidity: number
  Rewards: string
  TrustlessMulticall: string
}

export interface txClaimPositionRewards {
  type: TransactionType.ClaimAllPositionRewards
  positionIDs: number[]
  Market: string
}

export type TransactionArgs =
  txCreatePositionArgs |
  txUpdatePositionArgs |
  txLendArgs |
  txWithdrawArgs |
  txCreateLiquidityPositionArgs |
  txIncreaseLiquidityPositionArgs |
  txDecreaseLiquidityPositionArgs |
  txClaimPositionRewards

export interface TransactionData {
  args: TransactionArgs
  openTxTab: () => void
  userAddress: string
}

export type TransactionState = {[key in string]: TransactionInfo}

export const getTxNamePastTense = (type: TransactionType) => {
  switch(type) {
    case TransactionType.CreatePosition:
      return 'Position Created'
    case TransactionType.UpdatePosition:
      return 'Position Updated'
    case TransactionType.Lend:
      return 'Hue Lent'
    case TransactionType.Withdraw:
      return 'Hue Withdrawn'
    case TransactionType.ApproveHue:
    case TransactionType.ApproveLendHue:
      return 'Approved'
    case TransactionType.CreateLiquidityPosition:
      return 'Liquidity Position Created'
    case TransactionType.IncreaseLiquidityPosition:
    case TransactionType.DecreaseLiquidityPosition:
      return 'Liquidity Position Updated'
    case TransactionType.ClaimAllPositionRewards:
      return 'Rewards Claimed'
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxFailureTitle = (type: TransactionType) => {
  switch(type) {
    case TransactionType.CreatePosition:
      return 'Position Creation Failed'
    case TransactionType.UpdatePosition:
      return 'Position Update Failed'
    case TransactionType.Lend:
      return 'Hue Lend Failed'
    case TransactionType.Withdraw:
      return 'Hue Withdrawak Failed'
    case TransactionType.ApproveHue:
    case TransactionType.ApproveLendHue:
      return 'Approval Failed'
    case TransactionType.CreateLiquidityPosition:
      return 'Liquidity Position Creation Failed'
    case TransactionType.IncreaseLiquidityPosition:
    case TransactionType.DecreaseLiquidityPosition:
      return 'Liquidity Position Update Failed'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim Rewards Failed'
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxNamePresentTense = (type: TransactionType) => {
  switch(type) {
    case TransactionType.CreatePosition:
      return 'Creating Position'
    case TransactionType.UpdatePosition:
      return 'Updating Position'
    case TransactionType.Lend:
      return 'Lending Hue'
    case TransactionType.Withdraw:
      return 'Withdrawing Hue'
    case TransactionType.ApproveHue:
    case TransactionType.ApproveLendHue:
      return 'Approving'
    case TransactionType.CreateLiquidityPosition:
      return 'Creating Liquidity Position'
    case TransactionType.IncreaseLiquidityPosition:
    case TransactionType.DecreaseLiquidityPosition:
      return 'Updating Liquidity Position'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claiming Rewards'
    default:
      assertUnreachable(type)
  }
  return ''
}

const getDeadline = async (chainID: ChainID, multicallAddress: string) => {
  const trustlessMulticall = getMulticallContract(multicallAddress)
  const transactionTimeout = getDefaultTransactionTimeout(chainID)

  const blockTime = await trustlessMulticall.getCurrentBlockTimestamp()

  return BigNumber.from(blockTime).add(transactionTimeout)
}

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

  let deadline
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
    case TransactionType.Lend:
      return await getMarket(args.Market).lend(scale(args.count))

    case TransactionType.Withdraw:
      return await getMarket(args.Market).unlend(scale(args.count))

    case TransactionType.CreateLiquidityPosition:
      rewards = getRewards(args.Rewards)

      const amount0Desired = bnf(mnt(args.amount0Desired, args.token0Decimals))
      const amount1Desired = bnf(mnt(args.amount1Desired, args.token1Decimals))

      const ethCount = (args.token0IsWeth ? amount0Desired : bnf(0)).add(args.token1IsWeth ? amount1Desired : bnf(0))

      deadline = await getDeadline(args.chainID, args.TrustlessMulticall)

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
        deadline
      },
      UIID,
      {value: ethCount}
    )

    case TransactionType.IncreaseLiquidityPosition:
      rewards = getRewards(args.Rewards)

      deadline = await getDeadline(args.chainID, args.TrustlessMulticall)

      console.log(args)

      return await rewards.increaseLiquidityPosition({
        tokenId: args.positionID,
        amount0Desired: scale(args.amount0Change),
        amount0Min: scale(args.amount0Change * (1 - SLIPPAGE_TOLERANCE)),
        amount1Desired: scale(args.amount1Change),
        amount1Min: scale(args.amount1Change * (2 - SLIPPAGE_TOLERANCE)),
        deadline,
      }, UIID, {
      })

    case TransactionType.DecreaseLiquidityPosition:
      rewards = getRewards(args.Rewards)

      deadline = await getDeadline(args.chainID, args.TrustlessMulticall)

      console.log(args)

      return await rewards.decreaseLiquidityPosition({
        amount0Min: scale(args.amount0Min),
        amount1Min: scale(args.amount1Min),
        tokenId: args.positionID,
        liquidity: scale(args.liquidity),
        deadline,
      }, UIID)

    case TransactionType.ClaimAllPositionRewards:
      return await getMarket(args.Market).claimAllRewards(args.positionIDs, UIID)

    default:
      assertUnreachable(type)
  }
  throw new Error('Shoudnt get here')
}

export const waitForTransaction = createAsyncThunk(
  'transactions/waitForTransaction',
  async (data: TransactionData, {dispatch}): Promise<void> => {
    const args = data.args
    const userAddress = data.userAddress

    const provider = getProvider()

    let tx: ContractTransaction
    try {
      dispatch(waitingForMetamask())
      console.log("about to execute")
      tx = await executeTransaction(args, provider)
      console.log("executed")
    } catch (e) {
      console.log("caught error: ", {e})
      console.error("failureMessages: " + parseMetamaskError(e).join(', '))
      dispatch(addNotification({
        type: args.type,
        userAddress,
        status: TransactionStatus.Failure,
      }))
      dispatch(metamaskComplete())
      return
    }

    dispatch(transactionCreated({
      hash: tx.hash,
      nonce: tx.nonce,
      userAddress,
      startTimeMS: timeMS(),
      type: args.type,
      status: TransactionStatus.Pending,
    }))
    data.openTxTab()

    const receipt = await provider.waitForTransaction(tx.hash)
    dispatch(metamaskComplete())

    const succeeded = receipt.status === 1
    if (succeeded) {
      dispatch(addNotification({
        type: args.type,
        userAddress,
        status: TransactionStatus.Success,
        hash: tx.hash,
      }))
      dispatch(transactionSucceeded(tx.hash))
    } else {
      dispatch(addNotification({
        type: args.type,
        userAddress,
        status: TransactionStatus.Failure,
        hash: tx.hash,
      }))
      dispatch(transactionFailed(tx.hash))
    }

    // Kick off side-effects to reload relevant data
    if (succeeded) {
      const type = args.type

      switch (type) {
        case TransactionType.CreatePosition:
        case TransactionType.UpdatePosition:
          dispatch(clearPositions())
          dispatch(clearEthBalance())
          dispatch(clearHueBalance())
          break
        case TransactionType.Lend:
        case TransactionType.Withdraw:
          dispatch(clearLendHueBalance())
          dispatch(clearHueBalance())
          break
        case TransactionType.CreateLiquidityPosition:
          dispatch(clearLiquidityPositions())
          break
        case TransactionType.IncreaseLiquidityPosition:
        case TransactionType.DecreaseLiquidityPosition:
          break
        case TransactionType.ClaimAllPositionRewards:
          dispatch(clearPositions())
          break
      default:
        assertUnreachable(type)
      }
    }
  })

const name = 'transactions'

export const transactionsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, {}) as TransactionState,
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
  },
})

export const {
  clearUserTransactions,
  transactionCreated,
  transactionSucceeded,
  transactionFailed,
} = transactionsSlice.actions

export default transactionsSlice.reducer
