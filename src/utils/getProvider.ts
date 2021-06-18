import { ethers } from 'ethers'

const getProvider = () => window.hasOwnProperty('ethereum') && window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : null

export default getProvider
