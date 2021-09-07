import { ChainID } from '../slices/chainID'

export enum rootContracts {
  USDC = 'USDC',
  USDT = 'USDT',
  TUSD = 'TUSD',
  WETH = 'WETH',
  TcpGovernorAlpha = 'TcpGovernorAlpha',
  UniswapRouter = 'UniswapRouter',
}

const addresses: {[key in ChainID]: { [key in rootContracts]: string}} = {
  4: {
    USDC: "0x640cE1dF688d0Dcb2f3Bf9B1E69d8F64c59D439E",
    USDT: "0xE800ecE7C7B8682C9Af830fAE95514F7c20BACFb",
    TUSD: "0x000000000000000000000000000000000000dEaD",
    WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
    TcpGovernorAlpha: "0x974fc7052Fa0faf573b6fC1c0FacC0ED0A69c075",
    UniswapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  },
  // TODO remove governor and derive from tcp governoralpha
  1337: {
    USDC: "0x153900C946e33AED5F1ee79C92E149A262E2B1E9",
    USDT: "0x30B1050647C6b916741be1B2a7844A603931C4D9",
    TUSD: "0x43869F588CE7B61782F75935c15aBA0355ed98B1",
    WETH: "0x909D3601f147Ed08558b4747F01F80576dc627BF",
    TcpGovernorAlpha: "0x05240c67fC281F158Af0E81c13E61603e46F941a",
    UniswapRouter: "0xe0ad47d12Dd44E601eb7Cd07F574a8643B351A96",
  }
}

export const getAddress = (chainID: ChainID, contract: rootContracts) => addresses[chainID][contract]
