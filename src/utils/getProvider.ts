import { ethers } from 'ethers'
import * as zkSync from 'zksync-web3'

export type provider = ethers.providers.Web3Provider

export const getNullableProvider = (): provider | null =>
  window.hasOwnProperty('ethereum') && window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : null

const getProvider = () => {
  const provider = getNullableProvider()
  if (provider === null) throw new Error('Provider not found')
  return provider
}

export const getZkSyncProvider = new zkSync.Provider('https://zksync2-testnet.zksync.dev')


export default getProvider
