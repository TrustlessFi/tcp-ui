import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Launch16 } from '@carbon/icons-react';
import SmallLink from '../library/SmallLink'
import { getTxHash, clearUserTransactions, TransactionStatus, getTxNamePastTense, getTxNamePresentTense } from '../../slices/transactions'
import { getSortedUserTxs } from '../utils'
import { Row, Col } from 'react-flexbox-grid'
import LargeText from '../utils/LargeText';
import { InlineLoading, InlineLoadingStatus } from 'carbon-components-react';
import ExplorerLink from '../utils/ExplorerLink';

const txStatusToLoadingStatus: {[key in TransactionStatus]: InlineLoadingStatus} = {
  [TransactionStatus.Pending]: 'active',
  [TransactionStatus.Failure]: 'error',
  [TransactionStatus.Success]: 'finished',
}

const RecentTransactions = () => {
  const dispatch = useAppDispatch()
  const userAddress = selector(state => state.wallet.address)
  const txs = selector(state => state.transactions)

  const sortedUserTxs = getSortedUserTxs(userAddress, txs)
  if (sortedUserTxs.length === 0) return null

  const txLinks = sortedUserTxs.map(tx =>
    <Row key={getTxHash(tx)} style={{marginRight: '12px'}} middle='xs'>
      <Col xs={11}>
        <ExplorerLink
          txHash={getTxHash(tx)}
          style={{marginRight: 'auto'}}
          icon={Launch16}>
          {tx.status === TransactionStatus.Pending ? getTxNamePresentTense(tx.type) : getTxNamePastTense(tx.type)}
        </ExplorerLink>
      </Col>
      <Col xs={1}>
        <InlineLoading status={txStatusToLoadingStatus[tx.status]}/>
      </Col>
    </Row>
  )

  return (
    <>
      <Row style={{marginTop: '1rem', marginBottom: '1rem'}}>

        <LargeText style={{marginRight: 'auto'}}>Recent Transactions</LargeText>
        {userAddress !== null
          ? <SmallLink onClick={() => dispatch(clearUserTransactions(userAddress))}>Clear all</SmallLink>
          : null
        }
      </Row>
      <Col>
        {txLinks}
      </Col>
    </>
  )
}

export default RecentTransactions
