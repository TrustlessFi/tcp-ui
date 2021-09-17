import React, { MouseEvent, useState } from 'react'
import { withRouter, useHistory } from 'react-router'
import { Button, Link, Tag, ModalWrapper } from 'carbon-components-react';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Copy16, Launch16 } from '@carbon/icons-react';
import Center from '../library/Center';
import SmallLink from '../library/SmallLink'
import NetworkIndicator from '../library/NetworkIndicator';
import {
  Modal,
} from 'carbon-components-react'
import { abbreviateAddress } from '../../utils/index';
import { clearTransactions } from '../../slices/transactions'

export default () => {
  const dispatch = useAppDispatch()
  const txs = selector(state => state.transactions.data.value)

  console.log(1, {txs})
  if (txs === null || txs.length === 0) return null
  console.log(2, {txs})


  return (
    <>
      <div style={{marginTop: '1rem'}}>
        <h4>Recent Transactions</h4>
      </div>
      {txs.map(tx => <SmallLink onClick={() => console.log("tx clicked" + tx.title)} icon={Launch16}>{tx.title}</SmallLink>)}
      <Center style={{marginTop: '1rem'}}>
        <SmallLink onClick={() => dispatch(clearTransactions())}>Clear all</SmallLink>
      </Center>
    </>
  )
}
