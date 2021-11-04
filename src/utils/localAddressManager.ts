import { ethers } from 'ethers'
import { ChainID } from '@trustlessfi/addresses'

const getProvider = () => {
  if (window.hasOwnProperty('ethereum') && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum)
  } else {
    throw new Error('Provider not found')
  }
}

export const getChainID = async () => {
  const provider = getProvider()
  const rawChainID = parseInt(await provider.send('eth_chainId', []) as string)
  if (ChainID[rawChainID] === undefined) throw new Error('Invalid chainID ' + rawChainID)
  else return rawChainID as ChainID
}

export default getProvider
