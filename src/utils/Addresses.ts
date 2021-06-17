// Rinkeby addresses

enum chainIds {
  Rinkeby = 4,
  Hardhat = 1337,
}

export enum rootContracts {
  USDC = 'USDC',
  USDT = 'USDT',
  TUSD = 'TUSD',
  WETH = 'WETH',
  Governor = 'Governor',
  TcpGovernorAlpha = 'TcpGovernorAlpha',
  UniswapRouter = 'UniswapRouter',
}


const addresses: {[key in chainIds]: { [key in rootContracts]: string}} = {
  4: {
    USDC: "0x640cE1dF688d0Dcb2f3Bf9B1E69d8F64c59D439E",
    USDT: "0xE800ecE7C7B8682C9Af830fAE95514F7c20BACFb",
    TUSD: "0x000000000000000000000000000000000000dEaD",
    WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
    Governor: "0x1DAa43c4e03d62dc6850Fc3702279b1320b8e2AA",
    TcpGovernorAlpha: "0x974fc7052Fa0faf573b6fC1c0FacC0ED0A69c075",
    UniswapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  },
  1337: {
    USDC: "0x5930a362f5f107e2E0628Ca9D2371a4fAcF31BFA",
    USDT: "0xE74b281b820c039c215feFF841127216925663EB",
    TUSD: "0x2A614418E99F102bE2F9e8Ca79C0C97eb262E15c",
    WETH: "0x153900C946e33AED5F1ee79C92E149A262E2B1E9",
    Governor: "0xFA6826d5290B24946A3EA65B39Bc8D5899020EeA",
    TcpGovernorAlpha: "0x28f5D55Df47d1505DfdBfE803aE1F3391E21Ad1b",
    UniswapRouter: "0xfE0cae103cB3aA14eF7fbf1Cee4B3EDeC7301D5B",
  }
}

export const getAddress = (contract: rootContracts): string => {
  let chainId = chainIds.Rinkeby
  // TODO
  // let chainId = WalletStore.getState().chainId;
  return addresses[chainId][contract]
}
