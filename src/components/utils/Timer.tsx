import React, { MouseEvent, useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getSortedUserTxs } from './index'
import { TransactionStatus, updateTransactions } from '../../slices/transactions'

const INTERVAL = 5000

export default () => {
  const dispatch = useAppDispatch()
  const address = selector(state => state.wallet.address)
  const txs = selector(state => state.transactions)

  const pendingUserTxs = getSortedUserTxs(address, txs).filter(tx => tx.status === TransactionStatus.Pending)

  const actions: { action: () => void, condition: () => boolean}[] = [{
    action: () => dispatch(updateTransactions({currentState: txs, userAddress: address!})),
    condition: () => pendingUserTxs.length > 0 && address !== null,
  }]

  const [val, setVal] = useState(0)

  useEffect(() => {
    console.log("inside timer loop")
    setTimeout(
      () => {
        actions.map(action => {
          if (action.condition()) {
            action.action()
          }
        })
        setVal(val + 1)
      },
      INTERVAL
    )
    return () => {}
  }, [val])
  
  return <></>
}
