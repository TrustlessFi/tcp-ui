import { ethers } from 'ethers'

export default () => window.hasOwnProperty('ethereum') && window.ethereum
  ? new ethers.providers.Web3Provider(window.ethereum)
  : null
