import { ChainID } from '../slices/chainID'
import { store } from '../app/store'

export enum rootContracts {
  USDC = 'USDC',
  USDT = 'USDT',
  TUSD = 'TUSD',
  Governor = 'Governor',
  UniswapRouter = 'UniswapRouter',
}

const addresses: {[key in ChainID]: { [key in rootContracts]: string}} = {
  4: {
    USDC: '0x640cE1dF688d0Dcb2f3Bf9B1E69d8F64c59D439E',
    USDT: '0xE800ecE7C7B8682C9Af830fAE95514F7c20BACFb',
    TUSD: '0x000000000000000000000000000000000000dEaD',
    Governor: 'UNSET',
    UniswapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  },
  // TODO remove governor and derive from tcp governoralpha
  1337: {
    USDC: '0x5930a362f5f107e2E0628Ca9D2371a4fAcF31BFA',
    USDT: '0x5cB425A6f9563F7679381D28e3a22D8a64c7d1e3',
    TUSD: '0x25C042b1Cfde068E58C3FDa8B1B90b860eea2E2d',
    Governor: '0xa590AEc8427F2468B7fA9c639E31FD0C50F1e1A1',
    UniswapRouter: '0x870A7E07DaDF987f17ac08aF1a0015ebc78d2258',
  }
}

export const getAddress = (chainID: ChainID, contract: rootContracts) => addresses[chainID][contract]
