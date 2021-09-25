import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getLocalStorage, assertUnreachable } from '../../utils'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'
import { clearPositions } from '../positions'
import { clearHueBalance } from '../balances/hueBalance'
import { ethers, ContractTransaction } from 'ethers'
import { ProtocolContract } from '../contracts/index';
import { waitingForMetamask, waitingForCompletion, modalSuccess, modalFailure } from '../modal';

import { Market } from '../../utils/typechain'
import getContract from '../../utils/getContract';
import { scale } from '../../utils/index';
import { UIID } from '../../constants';

export enum TransactionType {
  CreatePosition,
  Lend,
  Withdraw,
}

export enum TransactionStatus {
  Pending,
  Success,
  Failure,
}

export type TransactionInfo = {
  hash: string
  userAddress: string
  nonce: number
  type: TransactionType
  status: TransactionStatus
}

export interface txCreatePositionArgs {
  type: TransactionType.CreatePosition
  collateralCount: number,
  debtCount: number,
  Market: string,
}

export type TransactionArgs =
  txCreatePositionArgs

export type TransactionState = {[key in string]: TransactionInfo}


export const getTxNamePastTense = (type: TransactionType) => {
  switch(type) {
    case TransactionType.CreatePosition:
      return 'Position Created'
    case TransactionType.Lend:
      return 'Hue Lent'
    case TransactionType.Withdraw:
      return 'Hue Withdrawn'
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxNamePresentTense = (type: TransactionType) => {
  switch(type) {
    case TransactionType.CreatePosition:
      return 'Creating Position'
    case TransactionType.Lend:
      return 'Lending Hue'
    case TransactionType.Withdraw:
      return 'Withdrawing Hue'
    default:
      assertUnreachable(type)
  }
  return ''
}




const executeTransaction = async (args: TransactionArgs, provider: ethers.providers.Web3Provider) => {
  switch(args.type) {
    case TransactionType.CreatePosition:
      const market = getContract(args.Market, ProtocolContract.Market) as Market
      return await market.connect(provider.getSigner()).createPosition(scale(args.debtCount), UIID, {
        value: scale(args.collateralCount)
      })

    default:
      assertUnreachable(args.type)
  }
  throw new Error('Shouldnt get here')
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
      console.error(e)
      // TODO skip to error and return
      throw e
    }

    let txInfo: TransactionInfo = {
      hash: tx.hash,
      userAddress,
      nonce: tx.nonce,
      type: args.type,
      status: TransactionStatus.Pending,
    }

    dispatch(waitingForCompletion(tx.hash))
    dispatch(transactionCreated(txInfo))

    const receipt = await provider.waitForTransaction(tx.hash)
    const succeeded = receipt.status === 1

    // txInfo.status = succeeded ? TransactionStatus.Success : TransactionStatus.Failure
    txInfo = { ...txInfo, status: succeeded ? TransactionStatus.Success : TransactionStatus.Failure }

    dispatch(addNotification(txInfo))
    dispatch(succeeded ? modalSuccess(tx.hash) : modalFailure(tx.hash))

    if (succeeded) {
      switch (args.type) {
        case TransactionType.CreatePosition:
          dispatch(clearPositions())
          dispatch(clearHueBalance())
          break

          /*
        case TransactionType.Lend:
        case TransactionType.Withdraw:
          dispatch(clearHueBalance())
          dispatch(clearLendHueBalance())
          break
          */

        default:
          assertUnreachable(args.type)
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
      const validTxs = Object.values(state).filter(tx => tx.userAddress !== userAddress)
      state = {}
      validTxs.map(tx => state[tx.hash] = tx)
    },
    transactionCreated: (state, action: PayloadAction<TransactionInfo>) => {
      const txInfo = action.payload
      state[txInfo.hash] = txInfo
    },
  },
  extraReducers: (builder) => {
    /*
    builder
      .addCase(waitForTransaction.pending, (state, action) => {
        state[action.meta.arg.hash] = {
          ...action.meta.arg,
          status: TransactionStatus.Pending,
        }
      })
      .addCase(waitForTransaction.rejected, (state, action) => {
        state[action.meta.arg.hash].status = TransactionStatus.UnexpectedError
      })
      .addCase(waitForTransaction.fulfilled, (state, action) => {
        state[action.meta.arg.hash].status = action.payload.status
      })
    */
  },
})

export const { clearUserTransactions, transactionCreated } = transactionsSlice.actions

export default transactionsSlice.reducer
