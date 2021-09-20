import { ChainID } from '../slices/chainID'

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
    USDC: '0xE74b281b820c039c215feFF841127216925663EB',
    USDT: '0xa720e517309af2698deb6eefFFF70ea110Fa3dF1',
    TUSD: '0x77958cEf4823d759F23b57427702cf1Dcd290aF1',
    Governor: '0x8A48EC415781EaFc316E9657F367B8Adf7d6393B',
    UniswapRouter: '0x5f5bCE32f8b8aE0977DE9fb8298B9074602899F5',
  }
}

export const getAddress = (chainID: ChainID, contract: rootContracts) => addresses[chainID][contract]
