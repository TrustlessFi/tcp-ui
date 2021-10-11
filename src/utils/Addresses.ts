import { ChainID } from '../slices/chainID'

export enum rootContracts {
  ProtocolDataAggregator = 'ProtocolDataAggregator',
  TCPGovernorAlpha = 'TCPGovernorAlpha',
  Governor = 'Governor',
  UniswapRouter = 'UniswapRouter',
  TrustlessMulticall = 'TrustlessMulticall',
}

const addresses: {[key in ChainID]: { [key in rootContracts]: string}} = {
  4: {
    Governor: "0x95608b60e27a0448FcC5E9ce222a65F3aED6e67F",
    ProtocolDataAggregator: "0x8Fd52eD0d46B86aed9353C8df9CA70484EfD84Fc",
    TCPGovernorAlpha: "0x974fc7052Fa0faf573b6fC1c0FacC0ED0A69c075",
    UniswapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    TrustlessMulticall: '0x5b7De2452336Dbf13450C54518d463231cd58f56',
  },
  // TODO remove governor and derive from tcp governoralpha
  1337: {
    Governor: '0x8A48EC415781EaFc316E9657F367B8Adf7d6393B',
    ProtocolDataAggregator: "0x05240c67fC281F158Af0E81c13E61603e46F941a",
    TCPGovernorAlpha: "0x4B41f098a2e2d2d88aeC6112583A4C119B07e5f1",
    UniswapRouter: '0x5f5bCE32f8b8aE0977DE9fb8298B9074602899F5',
    TrustlessMulticall: '0x153900C946e33AED5F1ee79C92E149A262E2B1E9',
  }
}

export const getAddress = (chainID: ChainID, contract: rootContracts) => addresses[chainID][contract]
