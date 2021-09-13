import { ChainID } from '../slices/chainID'

export enum rootContracts {
  USDC = 'USDC',
  USDT = 'USDT',
  TUSD = 'TUSD',
  WETH = 'WETH',
  ProtocolDataAggregator = 'ProtocolDataAggregator',
  TCPGovernorAlpha = 'TCPGovernorAlpha',
  UniswapRouter = 'UniswapRouter',
}

const addresses: {[key in ChainID]: { [key in rootContracts]: string}} = {
  4: {
    USDC: "0x640cE1dF688d0Dcb2f3Bf9B1E69d8F64c59D439E",
    USDT: "0xE800ecE7C7B8682C9Af830fAE95514F7c20BACFb",
    TUSD: "0x000000000000000000000000000000000000dEaD",
    WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
    ProtocolDataAggregator: "",
    TCPGovernorAlpha: "0x974fc7052Fa0faf573b6fC1c0FacC0ED0A69c075",
    UniswapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  },
  // TODO remove governor and derive from tcp governoralpha
  1337: {
    USDC: "0x5930a362f5f107e2E0628Ca9D2371a4fAcF31BFA",
    USDT: "0x5cB425A6f9563F7679381D28e3a22D8a64c7d1e3",
    TUSD: "0x25C042b1Cfde068E58C3FDa8B1B90b860eea2E2d",
    WETH: "0x10BFF065F1e70f782108005E9B4917C536F7FF51",
    ProtocolDataAggregator: "0x9A56C1a66C518ced297D154140004adF2F332917",
    TCPGovernorAlpha: "0x07F49133e93b0766883819C888E7928E947E72fd",
    UniswapRouter: "0x870a7e07dadf987f17ac08af1a0015ebc78d2258",
  }
}

export const getAddress = (chainID: ChainID, contract: rootContracts) => addresses[chainID][contract]
