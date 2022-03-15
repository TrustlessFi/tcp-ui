import { Tile } from 'carbon-components-react'
import LargeText from './LargeText'
import TokenIcon from './TokenIcon'
import CreateTransactionButton from './CreateTransactionButton'
import { numDisplay } from '../../utils'
import { WalletToken } from './TrustlessLogos'
import { TransactionArgs } from '../../slices/transactions'

const ClaimRewardsButton = ({
  txArgs,
  count,
  disabled,
  walletToken
}: {
  txArgs: TransactionArgs
  count?: number | null
  disabled?: boolean
  walletToken?: WalletToken
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
      height: 72,
    }}>
      <div style={{display: 'float'}}>
        <div style={{float: 'right'}}>
          <CreateTransactionButton
            title='Claim'
            key='claim_rewards_button'
            disabled={disabled}
            size='sm'
            kind='secondary'
            txArgs={txArgs}
          />
        </div>
        <div style={{display: 'float', alignItems: 'center'}}>
          <span style={{float: 'left', height: 32, width: 32}}>
            <TokenIcon
              walletToken={walletToken === undefined ? WalletToken.Tcp : walletToken}
              width={32}
              height={32}
            />
          </span>
          <span style={{float: 'left', paddingTop: 2}}>
            <LargeText size={18} style={{marginLeft: 10}}>
              {displayCount} Tcp rewards accrued
            </LargeText>
          </span>
        </div>
      </div>
    </Tile>
  )
}

export default ClaimRewardsButton
