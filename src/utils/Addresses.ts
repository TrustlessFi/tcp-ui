import { ChainID } from '../slices/chainID'

export enum rootContracts {
  USDC = 'USDC',
  USDT = 'USDT',
  TUSD = 'TUSD',
  WETH = 'WETH',
  Governor = 'Governor',
  TcpGovernorAlpha = 'TcpGovernorAlpha',
  UniswapRouter = 'UniswapRouter',
}

const addresses: {[key in ChainID]: { [key in rootContracts]: string}} = {
  4: {
    USDC: "0x640cE1dF688d0Dcb2f3Bf9B1E69d8F64c59D439E",
    USDT: "0xE800ecE7C7B8682C9Af830fAE95514F7c20BACFb",
    TUSD: "0x000000000000000000000000000000000000dEaD",
    WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
    Governor: "0x1DAa43c4e03d62dc6850Fc3702279b1320b8e2AA",
    TcpGovernorAlpha: "0x974fc7052Fa0faf573b6fC1c0FacC0ED0A69c075",
    UniswapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  },
  // TODO remove governor and derive from tcp governoralpha
  1337: {
    USDC: "0x153900C946e33AED5F1ee79C92E149A262E2B1E9",
    USDT: "0x5cB425A6f9563F7679381D28e3a22D8a64c7d1e3",
    TUSD: "0x77958cEf4823d759F23b57427702cf1Dcd290aF1",
    WETH: "0x870A7E07DaDF987f17ac08aF1a0015ebc78d2258",
    Governor: "0x07F49133e93b0766883819C888E7928E947E72fd",
    TcpGovernorAlpha: "0x940392f0F9053e33eFDa21f31108F3A6d3c3191C",
    UniswapRouter: "0xfE0cae103cB3aA14eF7fbf1Cee4B3EDeC7301D5B",
  }
}

export const getAddress = (chainID: ChainID, contract: rootContracts) => addresses[chainID][contract]
