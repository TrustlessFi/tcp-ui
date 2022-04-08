import { useHistory, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { abbreviateAddress } from '../../utils'
import waitFor from '../../slices/waitFor'
import { Wallet16 } from '@carbon/icons-react';
import {
  Tooltip,
  Button,
 } from 'carbon-components-react'
import { setTab } from '../../slices/tabs'
import { CSSProperties } from 'react'
import { Tab, tabToPath } from '../../App'

const WalletButton = ({
  address,
  style
}: {
  address: string,
  style?: CSSProperties,
}) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    tabs,
  } = waitFor([
    'tabs',
  ], selector, dispatch)

  const inTransactions = tabs.currentTab === Tab.Transactions

  const disableInteraction: CSSProperties =
    inTransactions
    ? {pointerEvents: 'none'}
    : {}

  return (
    <Button
      kind='secondary'
      size='small'
      disabled={inTransactions}
      onClick={
        inTransactions
        ? undefined
        : () => {
          history.push(tabToPath(Tab.Transactions))
          dispatch(setTab(Tab.Transactions))
        }
      }
      style={{
        cursor: inTransactions ? 'default' : 'pointer',
        ...disableInteraction,
        paddingRight: 12,
        ...style,
      }}
      >
      <Wallet16 style={{marginRight: 8}} />
      My Wallet
    </Button>
  )
}

export default WalletButton
