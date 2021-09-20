import { ethers } from 'ethers'

export default () => {
  if (window.hasOwnProperty('ethereum') && window.ethereum) return new ethers.providers.Web3Provider(window.ethereum)
  else throw 'Provider not found'
}
