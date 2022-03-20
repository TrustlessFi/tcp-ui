const assertUnreachable = (_x: never): never => { throw new Error('Incomplete switch') }

export enum PublicChainID {
  ZKSyncGoerli = 280,
}

export enum TestChainID {
  Hardhat = 1337,
}

// TODO MUST MANUALLY KEEP THIS UP TO DATE!
// Typescript won't merge the enums for us even though there is no value collision
export enum ChainID {
  ZKSyncGoerli = 280,
  Hardhat = 1337,
}

export const isPublicChain = (n: number): n is PublicChainID => n in PublicChainID

export const chainIDToName = (chainID: ChainID) => {
  switch(chainID) {
    case ChainID.Hardhat:
      return 'Hardhat'
    case ChainID.ZKSyncGoerli:
      return 'zkSync Testnet'
    default:
      assertUnreachable(chainID)
  }
}

export interface chainAddresses {
  TDAO: { TDao: string }
  TCP: {
    Governor: string
    ProtocolDataAggregator: string
    GenesisAllocation: string
  }
  TrustlessMulticall: { multicall: string }
  Uniswap: {
    factory: string
    router: string
  }
  Aux: {
    ethPriceProvider: string
    weth: string
  }
}

const addresses: { [key in PublicChainID]: chainAddresses } = {
  [ChainID.ZKSyncGoerli]: {
    TDAO: { TDao: '0x3C3E833BD1c03A04cA4FDF49fbb816CF1235FA12' },
    TCP: {
      Governor: '0x82ff0E86798a22B0499B350544639291BA2dA38c',
      ProtocolDataAggregator: '0xd6E0Aac60Fad29cDAc518865DDB9643C939E8c9c',
      GenesisAllocation: '0xC5E1C361c5dd61C03bf731C393Dad2275cdad554',
    },
    TrustlessMulticall: { multicall: '0x82839A7bAa876155DDdE62080226467Cc6535521'},
    Uniswap: {
      factory: '0xae24D65D8E88A8903cc88aC12dEF86628E06007e',
      router: '0x48A9CA5829B1A13CD5c9165243B27E437753082f',
    },
    Aux: {
      ethPriceProvider: '0x7156ee2525C9863e5d9DC8e35716BA3fdDeaeA1D',
      weth: '0xF603ADe76e27417375485E14eF100BFdA559CC0f',
    }
  }
}

const getAddressFromChainAddresses = <protocol extends keyof chainAddresses>(
  addresses: chainAddresses,
  protocol: protocol,
  contract: keyof chainAddresses[protocol]
) => {
  if (!addresses.hasOwnProperty(protocol)) {
    throw new Error('GET LOCAL ADDRESS: Unknown protocol: ' + protocol)
  }
  if (!addresses[protocol].hasOwnProperty(contract)) {
    throw new Error('GET LOCAL ADDRESS: Unknown contract ' + contract + ' in protocol: ' + protocol)
  }
  const address = addresses[protocol][contract] as unknown as string
  if (address.length === 0) throw new Error('GET LOCAL ADDRESS: address for protocol ' + protocol + ' and contract ' + contract + ' not found')
  return address
}

export const getAddress = <
  protocol extends keyof chainAddresses,
  contract extends keyof chainAddresses[protocol]
> (
  chainID: PublicChainID | number,
  protocol: protocol,
  contract: contract,
  localAddresses: chainAddresses = emptyChainAddresses
): string =>
  isPublicChain(chainID)
    ? getAddressFromChainAddresses(addresses[chainID], protocol, contract)
    : getAddressFromChainAddresses(localAddresses, protocol, contract)

// ================ DISK STORAGE =================
export const emptyChainAddresses: chainAddresses = {
  TDAO: {
    TDao: ''
  },
  TCP: {
    Governor: '',
    ProtocolDataAggregator: '',
    GenesisAllocation: '',
  },
  TrustlessMulticall: {
    multicall: ''
  },
  Uniswap: {
    factory: '',
    router: '',
  },
  Aux: {
    ethPriceProvider: '',
    weth: '',
  }
}
