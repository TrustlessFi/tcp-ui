import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Launch16 } from '@carbon/icons-react';
import Center from '../library/Center';
import SmallLink from '../library/SmallLink'
import { getTxNamePresentTense, getTxHash, clearUserTransactions } from '../../slices/transactions'
import { getSortedUserTxs } from '../utils'
import { Row, Col } from 'react-flexbox-grid'

const RecentTransactions = () => {
  const dispatch = useAppDispatch()
  const userAddress = selector(state => state.wallet.address)
  const txs = selector(state => state.transactions)

  const sortedUserTxs = getSortedUserTxs(userAddress, txs)
  if (sortedUserTxs.length === 0) return null

  const txLinks = sortedUserTxs.map(tx =>
    <Row key={getTxHash(tx)}>
      <SmallLink
        onClick={() => alert("tx clicked" + tx.type)}
        icon={Launch16}>
        {getTxNamePresentTense(tx.type)}
      </SmallLink>
    </Row>)

  return (
    <>
      <div style={{marginTop: '1rem'}}>
        <h4>Recent Transactions</h4>
      </div>
      <Col>
        {txLinks}
      </Col>
      {userAddress !== null
        ? <Center style={{marginTop: '1rem'}}>
            <SmallLink onClick={() => dispatch(clearUserTransactions(userAddress))}>Clear all</SmallLink>
          </Center>
        : null
      }
    </>
  )
}

export default RecentTransactions
