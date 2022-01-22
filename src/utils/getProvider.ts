import { ethers } from 'ethers'

export const getNullableProvider = () =>
  window.hasOwnProperty('ethereum') && window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : null

const getProvider = () => {
  const provider = getNullableProvider()
  if (provider === null) throw new Error('Provider not found')
  return provider
}

export default getProvider
