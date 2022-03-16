enum ProtocolContract {
  Accounting = 'Accounting',
  Auctions = 'Auctions',
  EnforcedDecentralization = 'EnforcedDecentralization',
  Hue = 'Hue',
  HuePositionNFT = 'HuePositionNFT',
  LendHue = 'LendHue',
  Liquidations = 'Liquidations',
  Market = 'Market',
  Prices = 'Prices',
  ProtocolLock = 'ProtocolLock',
  Rates = 'Rates',
  Rewards = 'Rewards',
  Settlement = 'Settlement',
  Tcp = 'Tcp',
  TcpGovernorAlpha = 'TcpGovernorAlpha',
  TcpTimelock = 'TcpTimelock',
  TcpAllocation = 'TcpAllocation',

  EthERC20 = 'EthERC20',
}

export enum RootContract {
  Governor = 'Governor',
  ProtocolDataAggregator = 'ProtocolDataAggregator',
  TrustlessMulticall = 'TrustlessMulticall',
}

export enum TDaoContract {
  TDaoToken = 'TDaoToken',
  TDaoPositionNFT = 'TDaoPositionNFT',
  TDaoGovernorAlpha = 'TDaoGovernorAlpha',
  TDaoTimelock = 'TDaoTimelock',
  TDaoVotingRewardsSafe = 'TDaoVotingRewardsSafe',
}

export enum TDaoRootContract {
  TDao = 'TDao',
}

export default ProtocolContract
