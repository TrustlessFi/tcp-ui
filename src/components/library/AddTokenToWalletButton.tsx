import { SyntheticEvent } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Button, ButtonSize } from 'carbon-components-react'
import waitFor from '../../slices/waitFor'
import { contractsInfo } from '../../slices/contracts'
import TokenIcon from './TokenIcon'
import { CSSProperties } from 'react'
import { addTokenToWallet, zkSyncEthERC20Address, assertUnreachable } from '../../utils'
import TrustlessLogos, { WalletToken } from '../library/TrustlessLogos'
import { ChainID } from '../../utils/addresses'
import { convertSVGtoURI } from '../../utils'

export const getTokenAddress = (walletToken: WalletToken, contractsInfo: contractsInfo) => {
  switch(walletToken) {
    case WalletToken.Hue:
      return contractsInfo.Hue
    case WalletToken.LendHue:
      return contractsInfo.LendHue
    case WalletToken.Tcp:
      return contractsInfo.Tcp
    case WalletToken.Eth:
      return zkSyncEthERC20Address
    case WalletToken.TDao:
      throw new Error('No address for TDao')
    default:
      assertUnreachable(walletToken)
      throw new Error('')
  }
}

export const getAddTokenToWalletOnClick = (
  walletToken: WalletToken,
  contracts: contractsInfo | null,
  chainID: ChainID | null,
  userAddress: string | null,
) => async (event: SyntheticEvent) => {
  event.preventDefault()
  event.stopPropagation()
  if (contracts === null || chainID === null || userAddress === null) return
  await addTokenToWallet({
    address: getTokenAddress(walletToken, contracts),
    symbol: walletToken,
    decimals: 18,
    image: convertSVGtoURI(TrustlessLogos.Black[walletToken]),
  })
}

const AddTokenToWalletButton = ({
  walletToken,
  disabled,
  size,
  style,
}: {
  walletToken: WalletToken
  disabled?: boolean
  size?: ButtonSize
  style?: CSSProperties
}) => {
  const dispatch = useAppDispatch()

  if (walletToken === null) return <></>

  const {
    contracts,
    chainID,
    userAddress,
  } = waitFor([
    'contracts',
    'chainID',
    'userAddress',
  ], selector, dispatch)

  return (
    <Button
      kind='ghost'
      size={size}
      style={style}
      onClick={getAddTokenToWalletOnClick(walletToken, contracts, chainID, userAddress)}
      disabled=
      {
        disabled ||
        chainID === null ||
        userAddress === null
      }>
      <TokenIcon walletToken={walletToken} />
    </Button>
  )
}

AddTokenToWalletButton.defaultProps = {
  size: 'sm'
}

export default AddTokenToWalletButton
