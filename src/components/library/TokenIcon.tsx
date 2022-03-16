import TrustlessLogos, { WalletToken, TrustlessLogoColor } from '../library/TrustlessLogos'
import { convertSVGtoURI } from '../../utils'

export const TokenIcon = ({
  walletToken,
  color,
  width,
  height,
}: {
  walletToken: WalletToken
  color?: TrustlessLogoColor
  width?: number
  height?: number
}) =>
  <img
    alt={`token ${walletToken}`}
    src={convertSVGtoURI(TrustlessLogos[color === undefined ? TrustlessLogoColor.Black : color][walletToken])}
    width={width === undefined ? 32 : width}
    height={height === undefined ? undefined : height}
  />

export default TokenIcon
