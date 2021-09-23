import { ChainID } from '../slices/chainID'

export enum rootContracts {
  USDC = 'USDC',
  USDT = 'USDT',
  TUSD = 'TUSD',
  WETH = 'WETH',
  ProtocolDataAggregator = 'ProtocolDataAggregator',
  TCPGovernorAlpha = 'TCPGovernorAlpha',
  Governor = 'Governor',
  UniswapRouter = 'UniswapRouter',
  TcpMulticall = 'TcpMulticall',
}

const addresses: {[key in ChainID]: { [key in rootContracts]: string}} = {
  4: {
    USDC: 'UNSET',
    USDT: 'UNSET',
    TUSD: 'UNSET',
    WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
    Governor: 'UNSET',
    ProtocolDataAggregator: "",
    TCPGovernorAlpha: "0x974fc7052Fa0faf573b6fC1c0FacC0ED0A69c075",
    UniswapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    TcpMulticall: 'UNSET',
  },
  // TODO remove governor and derive from tcp governoralpha
  1337: {
    USDC: '0xE74b281b820c039c215feFF841127216925663EB',
    USDT: '0xa720e517309af2698deb6eefFFF70ea110Fa3dF1',
    TUSD: '0x77958cEf4823d759F23b57427702cf1Dcd290aF1',
    WETH: "0x10BFF065F1e70f782108005E9B4917C536F7FF51",
    Governor: '0x8A48EC415781EaFc316E9657F367B8Adf7d6393B',
    ProtocolDataAggregator: "0x9A56C1a66C518ced297D154140004adF2F332917",
    TCPGovernorAlpha: "0x07F49133e93b0766883819C888E7928E947E72fd",
    UniswapRouter: '0x5f5bCE32f8b8aE0977DE9fb8298B9074602899F5',
    TcpMulticall: '0x153900C946e33AED5F1ee79C92E149A262E2B1E9',
  }
}

export const getAddress = (chainID: ChainID, contract: rootContracts) => addresses[chainID][contract]
