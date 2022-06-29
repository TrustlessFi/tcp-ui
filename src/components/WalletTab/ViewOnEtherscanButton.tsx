import { Button } from 'carbon-components-react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getEtherscanAddressLink } from '../library/ExplorerLink'
import waitFor from '../../slices/waitFor'
import ConnectWalletButton from '../library/ConnectWalletButton'

const ViewOnEtherscanButton = ({
  title,
}: {
  title?: string
}) => {
  const {
    userAddress,
    chainID,
  } = waitFor([
    'userAddress',
    'chainID',
  ], selector, useAppDispatch())

  return (
    userAddress === null || chainID === null
      ? <ConnectWalletButton size='sm' />
      : <Button
        onClick={() => window.open(getEtherscanAddressLink(userAddress, chainID), '_blank')}
        size='sm'>
        {title === undefined ? 'View on Etherscan' : title}
      </Button>
  )
}

export default ViewOnEtherscanButton
