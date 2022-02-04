import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Button, ButtonKind, ButtonSize } from 'carbon-components-react'
import { useEffect, CSSProperties } from "react"
import { setSwitchNetworkButtonClicked } from '../../slices/wallet'
import { ChainID, chainIDToName } from '@trustlessfi/addresses'
import { makeRPCRequest, first, RpcMethod, numberToHex } from '../../utils'
import waitFor from '../../slices/waitFor'

const SwitchNetworkButton = ({
  size,
  style,
  kind,
}: {
  size?: ButtonSize
  style?: CSSProperties
  kind?: ButtonKind
}) => {
  const dispatch = useAppDispatch()

  const {
    chainID,
    wallet,
  } = waitFor([
    'chainID',
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
    }).catch(_e => dispatch(setSwitchNetworkButtonClicked(false)))
  }

  return (
    <Button
      size={size}
      style={style}
      kind={kind === undefined ? 'danger' : kind}
      onClick={onClick}>
      {wallet.switchNetworkButtonClicked ? 'Confirm in Metamask...' : `Switch to ${chainIDToName(correctChainID)}`}
    </Button>
  )
}

export default SwitchNetworkButton
