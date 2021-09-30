import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getLocalStorage, assertUnreachable } from '../../utils'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'
import { clearPositions } from '../positions'
import { clearEthBalance } from '../ethBalance'
import { clearHueBalance } from '../balances/hueBalance'
import { clearLendHueBalance } from '../balances/lendHueBalance'
import { ethers, ContractTransaction } from 'ethers'
import { ProtocolContract } from '../contracts'
import { modalWaitingForMetamask, modalWaitingForCompletion, modalSuccess, modalFailure } from '../modal';

import { Market } from '../../utils/typechain'
import getContract from '../../utils/getContract'
import { scale, timeMS } from '../../utils'
import { UIID } from '../../constants';
import { v4 as uid } from 'uuid'
import { enforce , parseMetamaskError } from '../../utils'
import { mnt } from '../../utils/index';

export enum TransactionType {
  CreatePosition,
  UpdatePosition,
  Lend,
  Withdraw,
  ApproveHue,
  ApproveLendHue,
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

export type TransactionArgs =
  txCreatePositionArgs | txUpdatePositionArgs | txLendArgs | txWithdrawArgs

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
    default:
      assertUnreachable(type)
  }
  return ''
}

const executeTransaction = async (
  args: TransactionArgs,
  provider: ethers.providers.Web3Provider,
): Promise<ContractTransaction> => {
  const getMarket = () => getContract(args.Market, ProtocolContract.Market) as Market
  const type = args.type

  switch(type) {
    case TransactionType.CreatePosition:
      return await getMarket().connect(provider.getSigner()).createPosition(scale(args.debtCount), UIID, {
        value: scale(args.collateralCount)
      })

    case TransactionType.UpdatePosition:
      return await getMarket().connect(provider.getSigner()).adjustPosition(
        args.positionID,
        mnt(args.debtIncrease),
        args.collateralIncrease < 0 ? mnt(-args.collateralIncrease) : 0,
        UIID,
        args.collateralIncrease > 0 ? { value: mnt(args.collateralIncrease) } : undefined
      )

    case TransactionType.Lend:
      return await getMarket().connect(provider.getSigner()).lend(scale(args.count))

    case TransactionType.Withdraw:
      return await getMarket().connect(provider.getSigner()).unlend(scale(args.count))

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

    let tx: ContractTransaction | undefined
    try {
      dispatch(modalWaitingForMetamask())
      tx = await executeTransaction(args, provider)
      if (tx === undefined) throw 'Transaction undefined.'
    } catch (e) {
      const txInfo = getTxInfo({
        userAddress,
        type: args.type,
        status: TransactionStatus.Failure,
      })

      const failureMessages = parseMetamaskError(e)
      dispatch(modalWaitingForCompletion(getTxHash(txInfo)))
      dispatch(modalFailure({ hash: getTxHash(txInfo), messages: failureMessages}))
      return
    }

    let txInfo = getTxInfo({
      hash: tx.hash,
      userAddress,
      nonce: tx.nonce,
      type: args.type,
      status: TransactionStatus.Pending,
    })

    dispatch(modalWaitingForCompletion(tx.hash))
    dispatch(transactionCreated(txInfo))

    const receipt = await provider.waitForTransaction(tx.hash)
    const succeeded = receipt.status === 1

    if (succeeded) {
      dispatch(modalSuccess(tx.hash))
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Success }))
      dispatch(transactionSucceeded(tx.hash))
    } else {
      dispatch(modalFailure({ hash: tx.hash, messages: []}))
      dispatch(addNotification({ ...txInfo, status: TransactionStatus.Failure }))
      dispatch(transactionFailed(tx.hash))
    }

    if (succeeded) {
      switch (args.type) {
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
      }
    }
  })

const name = 'transactions'

export const transactionsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, {}) as TransactionState,
  reducers: {
    clearUserTransactions: (state, action: PayloadAction<string>) => {
      return Object.fromEntries(Object.values(state).filter(tx => tx.userAddress !== action.payload).map(tx => [tx.hash, tx]))
    },
    transactionCreated: (state, action: PayloadAction<TransactionInfo>) => {
      const txInfo = action.payload
      const hash = getTxHash(txInfo)
      state[hash] = txInfo
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
