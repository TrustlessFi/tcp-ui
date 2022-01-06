import { FunctionComponent } from "react"
import React, { useState } from "react"

import { Button } from "carbon-components-react"
import { ChainID, chainIDToName } from '@trustlessfi/addresses'

import Center from '../library/Center'
import SpacedList from '../library/SpacedList'

import { useAppSelector as selector } from "../../app/hooks"
import { makeRPCRequest, first, RpcMethod, numberToHex } from '../../utils'


const SwitchNetwork: FunctionComponent<{}> = ({ children }) => {
  const chainID = selector((state) => state.chainID.chainID)

  const [ clicked, setClicked ] = useState(false)

  const correctChainID =
    first((Object.values(ChainID).filter(id => Number.isInteger(id)) as number[]).sort((a, b) => a - b))

  const switchNetwork = async () => {
    setClicked(true)
    await makeRPCRequest({
      method: RpcMethod.SwitchChain,
      chainId: numberToHex(correctChainID as number),
    }).catch(_e => setClicked(false))
  }

  return chainID === null
    ? <SpacedList style={{marginTop: '20%'}}>
        <Center>
          <Button kind='danger' onClick={switchNetwork}>
            {clicked ? 'Confirm in Metamask...' : `Switch to ${chainIDToName(correctChainID)}`}
          </Button>
        </Center>
      </SpacedList>
    : <>{children}</>



}
export default SwitchNetwork
