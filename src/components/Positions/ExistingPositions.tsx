import { Button } from 'carbon-components-react'
import { useHistory } from 'react-router-dom'
import AppTile from '../library/AppTile'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import Center from '../library/Center'
import SimpleTable, { TableHeaderOnly } from '../library/SimpleTable'
import RelativeLoading from '../library/RelativeLoading'
import { numDisplay, sum } from '../../utils'
import ConnectWalletButton from '../library/ConnectWalletButton'
import Text from '../library/Text'
import CreateTransactionButton from '../library/CreateTransactionButton'
import { TransactionType } from '../../slices/transactions'

const ExistingPositionsTable = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    positions,
    pricesInfo,
    userAddress,
    contracts,
  } = waitFor([
    'positions',
    'pricesInfo',
    'userAddress',
    'contracts',
  ], selector, dispatch)

  console.log({positions, pricesInfo, userAddress, contracts})

  if (positions === null || pricesInfo === null || userAddress === null || contracts === null) {
    return (
      <div style={{position: 'relative'}}>
        <RelativeLoading show={userAddress !== null} />
        <TableHeaderOnly headers=
          {[
            'Position ID',
            'Debt',
            'Collateral',
            'Collateralization Ratio',
            'Approximate Rewards',
          ]}
        />
        <Center>
          <div style={{margin: 32}}>
            <ConnectWalletButton size='sm' />
          </div>
        </Center>
      </div>
    )
  }

  if (Object.values(positions).length === 0) {
    return (
      <Center style={{padding: 24}}>
        <Text>
          You have no positions.
        </Text>
      </Center>
    )
  }

  const rows = Object.values(positions).map(position => {
    const collateralization = (position.collateralCount * pricesInfo.ethPrice) / position.debtCount

    return {
      key: position.id,
      data: {
        'Position ID': position.id,
        'Debt': numDisplay(position.debtCount, 2) + ' Hue',
        'Collateral': numDisplay(position.collateralCount, 2) + ' Eth',
        'Collateralization Ratio': numDisplay(collateralization * 100, 0) + '%',
        'Approximate Rewards': numDisplay(position.approximateRewards) + " TCP"
      },
      onClick: () => history.push(`/positions/${position.id}`)
    }
  })

  return <SimpleTable rows={rows} />
}

const ExistingPositions = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const {
    positions,
    contracts,
  } = waitFor([
    'positions',
    'contracts',
  ], selector, dispatch)


  const positionsIDsWithRewards =
    positions === null
    ? []
    : Object.values(positions).filter(position => position.approximateRewards !== 0).map(position => position.id)


  const totalRewards =
    positionsIDsWithRewards.length === 0 || positions === null
    ? 0
    : Object.values(positions).map(p => p.approximateRewards).reduce(sum)

  const rightElement =
    <>
      <CreateTransactionButton
        size="sm"
        style={{marginRight: 8}}
        title={`Claim ${numDisplay(totalRewards)} Tcp`}
        disabled={positionsIDsWithRewards.length === 0 || contracts === null}
        showDisabledInsteadOfConnectWallet={true}
        txArgs={{
          type: TransactionType.ClaimAllPositionRewards,
          positionIDs: positionsIDsWithRewards,
          Market: contracts === null ? '' : contracts.Market,
        }}
      />
      <Button
        size="small"
        onClick={() => history.push('/positions/new')}>
        New Position
      </Button>
    </>

  return (
    <AppTile title="Positions" rightElement={rightElement}>
      <ExistingPositionsTable />
    </AppTile>
  )
}

export default ExistingPositions
