import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Button, ButtonKind, ButtonSize } from 'carbon-components-react'
import { waitForContracts } from '../../slices/waitFor'
import { contractsInfo } from '../../slices/contracts'
import { getChainIDFromState } from '../../slices/chainID'
import { CSSProperties } from 'react';
import { tokenAddedToWallet, WalletToken } from '../../slices/tokensAddedToWallet'
import { addTokenToWallet, convertSVGtoURI } from '../../utils'
import TrustlessLogos from '../../utils/trustless_logos'

const AddTokenToWalletButton = ({
  walletToken,
  title,
  disabled,
  kind,
  size,
  style,
}: {
  walletToken: WalletToken
  title?: string
  disabled?: boolean
  kind?: ButtonKind
  size?: ButtonSize
  style?: CSSProperties
}) => {
  const dispatch = useAppDispatch()

  const contracts = waitForContracts(selector, dispatch)
  const chainID = getChainIDFromState(selector(state => state.chainID))
  const tokensAddedToWallet = selector(state => state.tokensAddedToWallet)
  const userAddress = selector(state => state.wallet.address)

  const getTokenAddress = (contractsInfo: contractsInfo) => {
    switch(walletToken) {
      case WalletToken.Hue:
        return contractsInfo.Hue
      case WalletToken.LendHue:
        return contractsInfo.LendHue
      case WalletToken.TCP:
        return contractsInfo.Tcp
    }
  }

  const getTokenIcon = () => {
    switch(walletToken) {
      case WalletToken.Hue:
      case WalletToken.LendHue:
        return convertSVGtoURI(TrustlessLogos.black.hue)
      case WalletToken.TCP:
        return convertSVGtoURI(TrustlessLogos.black.tcp)
    }
  }

  const onClick = async () => {
    if (contracts === null || chainID === null || userAddress === null) return
    await addTokenToWallet({
      address: getTokenAddress(contracts),
      symbol: walletToken,
      decimals: 18,
      image: getTokenIcon(),
    })
    dispatch(tokenAddedToWallet({ walletToken, chainID: chainID, address: userAddress}))
  }

  const alreadyAdded =
    chainID !== null &&
    userAddress !== null &&
    tokensAddedToWallet[walletToken][chainID] !== undefined &&
    tokensAddedToWallet[walletToken][chainID][userAddress] === true

  return (
    <Button
      kind={kind === undefined ? (alreadyAdded ? 'ghost' : 'secondary') : kind}
      size={size}
      style={style}
      onClick={onClick}
      disabled={
        disabled ||
        contracts === null ||
        chainID === null ||
        userAddress === null
      }>
      {
        title === undefined
        ? (
          alreadyAdded
          ? `Re-add ${walletToken} token to wallet`
          : `Add ${walletToken} token to wallet`
        )
        : title
      }
      </Button>
  )
}

AddTokenToWalletButton.defaultProps = {
  size: 'sm'
}

export default AddTokenToWalletButton
