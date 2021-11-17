import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getLocalStorage, assertUnreachable } from '../../utils'
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
import { scale, timeMS } from '../../utils'
import { UIID } from '../../constants'
import { v4 as uid } from 'uuid'
import { enforce, getDefaultTransactionTimeout, mnt, parseMetamaskError } from '../../utils'
import { zeroAddress , bnf } from '../../utils/index';
import { ChainID } from '@trustlessfi/addresses'

export enum TransactionType {
  CreatePosition,
  UpdatePosition,
  Lend,
  Withdraw,
  ApproveHue,
  ApproveLendHue,
  CreateLiquidityPosition,
  UpdateLiquidityPosition,
}

export enum TransactionStatus {
  Pending,
  Success,
  Failure,
}

export const getTxInfo = (txInfo: {
  hash?: string,
  nonce?: number,
  userAddress: string,
  type: TransactionType,
  status: TransactionStatus
}): TransactionInfo => ({
  hash: txInfo.hash === undefined ? { uid: uid() } : { hash: txInfo.hash },
  nonce: txInfo.nonce === undefined ? { uid: timeMS() } : { nonce: txInfo.nonce },
  userAddress: txInfo.userAddress,
  type: txInfo.type,
  status: txInfo.status,
})

export const getTxHash = (txInfo: TransactionInfo): string => {
  if (txInfo.hash.hash !== undefined) return txInfo.hash.hash

  enforce(txInfo.hash.uid !== undefined, 'TransactionSlice: Both hash and uid undefined')

  return txInfo.hash.uid!
}

export const getTxNonce = (txInfo: TransactionInfo): number => {
  if (txInfo.nonce.nonce !== undefined) return txInfo.nonce.nonce

  enforce(txInfo.nonce.uid !== undefined, 'TransactionSlice: Both nonce and uid undefined')

  return txInfo.nonce.uid!
}

export type TransactionInfo = {
  hash: { hash ?: string, uid?: string }
  nonce: { nonce ?: number, uid?: number }
  userAddress: string
  type: TransactionType
  status: TransactionStatus
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

export interface txUpdateLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.UpdateLiquidityPosition
  positionID: number
  collateralChange: number
  debtChange: number
  Rewards: string
  TrustlessMulticall: string
}

export type TransactionArgs =
  txCreatePositionArgs |
  txUpdatePositionArgs |
  txLendArgs |
  txWithdrawArgs |
  txCreateLiquidityPositionArgs |
  txUpdateLiquidityPositionArgs

export type TransactionState =
  {
    waitingForMetamask: boolean
    txs: {[key in string]: TransactionInfo}
  }


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
    case TransactionType.UpdateLiquidityPosition:
      return 'Liquidity Position Updated'
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
    case TransactionType.UpdateLiquidityPosition:
      return 'Liquidity Position Update Failed'
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
    case TransactionType.UpdateLiquidityPosition:
      return 'Updating Liquidity Position'
    default:
      assertUnreachable(type)
  }
  return ''
}

const getDeadline = async (chainID: ChainID, multicallAddress: string) => {
  const trustlessMulticall = getMulticallContract(multicallAddress)
  const transactionTimeout = getDefaultTransactionTimeout(chainID);

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

    case TransactionType.UpdateLiquidityPosition:
      break
      /*rewards = getRewards(args.Rewards)

      deadline = await getDeadline(args.chainID, args.TrustlessMulticall)

      if(args.debtChange < 0 || args.collateralChange < 0) {
        return await rewards.decreaseLiquidityPosition({
          tokenId: args.positionID,
          deadline,
        }, UIID, {
        });
      } else {
        return await rewards.increaseLiquidityPosition({
          tokenId: args.positionID,
          deadline,
        }, UIID, {
        });
      }*/

    default:
      assertUnreachable(type)
  }
  throw new Error('Shoudnt get here')
}

export const waitForTransaction = createAsyncThunk(
  'transactions/waitForTransaction',
  async (args: TransactionArgs, {dispatch}): Promise<void> => {
    const provider = getProvider()
    const userAddress = await provider.getSigner().getAddress()

    let tx: ContractTransaction
    try {
      dispatch(waitingForMetamask())
      tx = await executeTransaction(args, provider)
    } catch (e) {
      const txInfo = getTxInfo({
        userAddress,
        type: args.type,
        status: TransactionStatus.Failure,
      })

      console.error("failureMessages" + parseMetamaskError(e).join(', '))
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Failure }))
      dispatch(metamaskFailure())
      return
    }

    const txInfo = getTxInfo({
      hash: tx.hash,
      userAddress,
      nonce: tx.nonce,
      type: args.type,
      status: TransactionStatus.Pending,
    })

    dispatch(transactionCreated(txInfo))

    const receipt = await provider.waitForTransaction(tx.hash)
    const succeeded = receipt.status === 1

    if (succeeded) {
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Success }))
      dispatch(transactionSucceeded(tx.hash))
    } else {
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Failure }))
      dispatch(transactionFailed(tx.hash))
    }

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
        case TransactionType.UpdateLiquidityPosition:
          break
      default:
        assertUnreachable(type)
      }
    }
  })

const name = 'transactions'

export const transactionsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, {waitingForMetamask: false, txs: {}}) as TransactionState,
  reducers: {
    clearUserTransactions: (state, action: PayloadAction<string>) => {
      return {
        waitingForMetamask: state.waitingForMetamask,
        txs: Object.fromEntries(Object.values(state.txs).filter(tx => tx.userAddress !== action.payload).map(tx => [tx.hash, tx])),
      }
    },
    waitingForMetamask: (state) => {
      state.waitingForMetamask = true
    },
    metamaskFailure: (state) => {
      state.waitingForMetamask = false
    },
    transactionCreated: (state, action: PayloadAction<TransactionInfo>) => {
      const txInfo = action.payload
      const hash = getTxHash(txInfo)
      console.log("transactionCreated", {hash})
      state.txs[hash] = txInfo
      state.waitingForMetamask = false
    },
    transactionSucceeded: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      console.log("transactionSucceeded", {hash})
      if (state.txs.hasOwnProperty(hash)) {
        state.txs[hash].status = TransactionStatus.Success
      }
    },
    transactionFailed: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      if (state.txs.hasOwnProperty(hash)) {
        state.txs[hash].status = TransactionStatus.Failure
      }
    },
  },
})

export const {
  clearUserTransactions,
  transactionCreated,
  transactionSucceeded,
  transactionFailed,
  waitingForMetamask,
  metamaskFailure,
} = transactionsSlice.actions

export default transactionsSlice.reducer
