import { Tile } from 'carbon-components-react'
import LargeText from './LargeText'
import TokenIcon from './TokenIcon'
import CreateTransactionButton from './CreateTransactionButton'
import SpacedList from './SpacedList'
import { numDisplay } from '../../utils'
import { TransactionArgs, WalletToken } from '../../slices/transactions'

const ClaimRewardsButton = ({
  txArgs,
  count,
  disabled,
  walletToken
}: {
  txArgs: TransactionArgs
  count?: number | null
  disabled?: boolean
  walletToken?: WalletToken | 'Eth'
}) => {
  // const dispatch = useAppDispatch()

  const displayCount =
    count === undefined || count === null
    ? '-'
    : numDisplay(count)

  return (
    <Tile style={{
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 40,
      paddingRight: 40,
    }}>
        <div style={{display: 'float', alignItems: 'center', marginBottom: 20}}>
          <div style={{float: 'right'}}>
            <CreateTransactionButton
              title='Claim'
              key='claim_rewards_button'
              disabled={disabled}
              size='md'
              kind='secondary'
              txArgs={txArgs}
            />
          </div>
          <div style={{float: 'left'}}>
            <TokenIcon
              walletToken={walletToken === undefined ? WalletToken.Tcp : walletToken}
              width={32}
              height={32}
            />
          </div>
          <div style={{float: 'left'}}>
          <LargeText style={{marginLeft: 10}}>
            {displayCount} Tcp rewards accrued
          </LargeText>
          </div>
        </div>
    </Tile>
  )
}

export default ClaimRewardsButton
