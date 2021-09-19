import { Button, Link, Tag, ModalWrapper } from 'carbon-components-react';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Launch16 } from '@carbon/icons-react';
import Center from '../library/Center';
import SmallLink from '../library/SmallLink'
import NetworkIndicator from '../library/NetworkIndicator';
import {
  Modal,
} from 'carbon-components-react'
import { clearUserTransactions } from '../../slices/transactions'
import { getSortedUserTxs } from '../utils/index';

export default () => {
  const dispatch = useAppDispatch()
  const userAddress = selector(state => state.wallet.address)
  const txs = selector(state => state.transactions)

  const sortedUserTxs = getSortedUserTxs(userAddress, txs)
  if (sortedUserTxs.length === 0) return null

  return (
    <>
      <div style={{marginTop: '1rem'}}>
        <h4>Recent Transactions</h4>
      </div>
      {sortedUserTxs.map(tx => <SmallLink onClick={() => console.log("tx clicked" + tx.title)} icon={Launch16}>{tx.title}</SmallLink>)}
      <Center style={{marginTop: '1rem'}}>
        <SmallLink onClick={() => dispatch(clearUserTransactions(userAddress!))}>Clear all</SmallLink>
      </Center>
    </>
  )
}
