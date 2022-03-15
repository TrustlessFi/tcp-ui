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

export const TokenIcon = ({
  walletToken,
  width,
  height,
}: {
  walletToken: WalletToken | 'Eth'
  width?: number
  height?: number
}) =>
  <img
    alt={`token ${walletToken}`}
    src={getTokenIcon(walletToken)}
    width={width === undefined ? 32 : width}
    height={height === undefined ? undefined : height}
  />
export default TokenIcon
