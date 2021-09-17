import { Slice } from '@reduxjs/toolkit';
import React, { MouseEvent, useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector, } from '../../app/hooks'
import { RootState } from '../../app/store'
import { getSortedUserTxs } from './index'
import { TransactionStatus, updateTransactions, transactionsSlice, TransactionState } from '../../slices/transactions'
import {  } from '../../slices/transactions'
import { hours } from '../../utils/'

const localStorage = window.localStorage

type persistedSlice = {
  slice: Slice,
  duration: number,
  getState: (state: RootState) => TransactionState
}

type persistedSlices = {
  [key in keyof RootState]?: persistedSlice
}

const slicesToPersist: persistedSlices = {
  [transactionsSlice.name]: {
    slice: transactionsSlice,
    duration: 0, // TODO add this in
    getState: (state: RootState) => state.transactions
  }
}

export default () => {
  for (const [k, v] of Object.entries(slicesToPersist)) {
    const state = selector(v.getState)
    localStorage.setItem(k, JSON.stringify(state))
  }
  return <></>
}
