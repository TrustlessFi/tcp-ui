import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useState } from 'react'
import { Button, ButtonKind, ButtonSize } from 'carbon-components-react'
import { CSSProperties } from "react"
import { setSwitchNetworkButtonClicked } from '../../slices/wallet'
import SpacedList from '../library/SpacedList'
import { ChainID, chainIDToName } from '../../utils/addresses'
import { makeRPCRequest, first, RpcMethod, numberToHex } from '../../utils'
import waitFor from '../../slices/waitFor'

const SwitchNetworkButton = ({
  size,
  style,
  kind,
  showOneButton,
}: {
  size?: ButtonSize
  style?: CSSProperties
  kind?: ButtonKind
  showOneButton?: boolean
}) => {
  const dispatch = useAppDispatch()

  const [ showAddNetworkButton, setShowAddNetworkButton ] = useState(false)

  const {
    wallet,
  } = waitFor([
    'wallet',
  ], selector, dispatch)

  const correctChainID =
    first((
      Object.values(ChainID)
        .filter(id => Number.isInteger(id)) as number[]).sort((a, b) => a - b))

  const onClick = async () => {
    dispatch(setSwitchNetworkButtonClicked(true))
    await makeRPCRequest({
      method: RpcMethod.SwitchChain,
      chainId: numberToHex(correctChainID as number),
    }).catch(_e => {
      dispatch(setSwitchNetworkButtonClicked(false))
      setShowAddNetworkButton(true)
    })
  }

  const addZkSyncNetworkRequest = async () => await makeRPCRequest({
    method: RpcMethod.AddEthereumChain,
    chainId: '0x118',
    chainName: 'ZkSync Testnet - Goerli',
    nativeCurrency: {
      name: 'Eth',
      symbol: 'Eth',
      decimals: 18,
    },
    rpcUrls: ['https://zksync2-testnet.zksync.dev'],
    blockExplorerUrls: ['https://zksync2-testnet.zkscan.io/'],
  })

  const addZkSyncNetworkButton =
    <Button
      onClick={addZkSyncNetworkRequest}
      disabled={wallet.connecting}
      size={size}
      kind={kind}
      style={style}>
      Add zkSync to Metamask
    </Button>

  const switchNetworkButton =
    <Button
      size={size}
      style={style}
      kind={kind === undefined ? 'danger' : kind}
      onClick={onClick}>
      {wallet.switchNetworkButtonClicked ? 'Confirm in Metamask...' : `Switch to ${chainIDToName(correctChainID)}`}
    </Button>

  return showOneButton
    ? (
      showAddNetworkButton
      ? addZkSyncNetworkButton
      : switchNetworkButton
    ) : (
      showAddNetworkButton
      ? <SpacedList spacing={50}>
          {switchNetworkButton}
          {addZkSyncNetworkButton}
        </SpacedList>
      : switchNetworkButton
    )
}

export default SwitchNetworkButton
