import TrustlessLogos, { WalletToken, TrustlessLogoColor } from '../library/TrustlessLogos'
import { convertSVGtoURI } from '../../utils'

export const TokenIcon = ({
  walletToken,
  width,
  height,
}: {
  walletToken: WalletToken
  width?: number
  height?: number
}) =>
  <img
    alt={`token ${walletToken}`}
    src={convertSVGtoURI(TrustlessLogos[TrustlessLogoColor.Black][walletToken])}
    width={width === undefined ? 32 : width}
    height={height === undefined ? undefined : height}
  />

export default TokenIcon
