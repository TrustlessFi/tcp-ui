import { SyntheticEvent } from 'react'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Button, ButtonSize } from 'carbon-components-react'
import waitFor from '../../slices/waitFor'
import { contractsInfo } from '../../slices/contracts'
import { CSSProperties } from 'react';
import { WalletToken } from '../../slices/transactions'
import { addTokenToWallet, convertSVGtoURI, assertUnreachable } from '../../utils'
import TrustlessLogos from '../../utils/trustless_logos'
import { ChainID } from '@trustlessfi/addresses'

export const getTokenAddress = (walletToken: WalletToken, contractsInfo: contractsInfo) => {
  switch(walletToken) {
    case WalletToken.Hue:
      return contractsInfo.Hue
    case WalletToken.LendHue:
      return contractsInfo.LendHue
    case WalletToken.Tcp:
      return contractsInfo.Tcp
    default:
      assertUnreachable(walletToken)
      throw new Error('')
  }
}

export const getTokenIcon = (walletToken: WalletToken | 'Eth') => {
  switch(walletToken) {
    case WalletToken.Hue:
    case WalletToken.LendHue:
      return convertSVGtoURI(TrustlessLogos.black.hue)
    case WalletToken.Tcp:
      return convertSVGtoURI(TrustlessLogos.black.tcp)
    case 'Eth':
      return convertSVGtoURI(TrustlessLogos.black.eth)
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
    image: getTokenIcon(walletToken),
  })
}

export const TokenIcon = ({
  walletToken,
  size,
}: {
  walletToken: WalletToken | 'Eth'
  size?: number
}) => {
  return <img alt={`token ${walletToken}`} src={getTokenIcon(walletToken)} width={size === undefined ? 32 : size} />
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
      disabled={disabled ||
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
