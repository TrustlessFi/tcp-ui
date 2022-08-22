import cacheBreakerSlice from './cacheBreaker'
import chainIDSlice from './chainID'
import errorsSlice from './errors'
import userAddressSlice from './userAddress'
import balancesSlice from './balances'
import contractsSlice from './contracts'
import counterSlice from './counter'
import currentChainInfoSlice from './currentChainInfo'
import governorSlice from './governor'
import hueSlice from './hue'
import huePositionNftSlice from './huePositionNft'
import liquidationsSlice from './liquidations'
import liquidityPageSlice from './liquidityPage'
import marketSlice from './market'
import poolsCurrentDataSlice from './poolsCurrentData'
import poolsMetadataSlice from './poolsMetadata'
import positionsSlice from './positions'
import pricesSlice from './prices'
import ratesSlice from './rates'
import truEthSlice from './truEth'
import onboardingSlice from './onboarding'
import rewardsSlice from './rewards'
import rootContractsSlice from './rootContracts'
import systemDebtSlice from './systemDebt'
import stakingSlice from './staking'
import notificationsSlice from './notifications'
import tabsSlice from './tabs'
import tcpAllocationSlice from './tcpAllocation'
import tcpTimelockSlice from './tcpTimelock'
import testnetBannerSlice from './testnetBanner'
import transactionsSlice from './transactions'
import walletSlice from './wallet'

import { RootState }  from './fetchNodes'

const allSlicesRaw = {
  cacheBreaker: cacheBreakerSlice,
  chainID: chainIDSlice,
  errors: errorsSlice,
  rootContracts: rootContractsSlice,
  userAddress: userAddressSlice,
  liquidityPage: liquidityPageSlice,
  notifications: notificationsSlice,
  onboarding: onboardingSlice,
  staking: stakingSlice,
  testnetBanner: testnetBannerSlice,
  transactions: transactionsSlice,
  tabs: tabsSlice,
  wallet: walletSlice,

  balances: balancesSlice,
  contracts: contractsSlice,
  currentChainInfo: currentChainInfoSlice,
  governorInfo: governorSlice,
  hueInfo: hueSlice,
  huePositionNftInfo: huePositionNftSlice,
  liquidationsInfo: liquidationsSlice,
  marketInfo: marketSlice,
  counterInfo: counterSlice,
  poolsCurrentData: poolsCurrentDataSlice,
  poolsMetadata: poolsMetadataSlice,
  positions: positionsSlice,
  pricesInfo: pricesSlice,
  ratesInfo: ratesSlice,
  truEthInfo: truEthSlice,
  rewardsInfo: rewardsSlice,
  sdi: systemDebtSlice,
  tcpAllocation: tcpAllocationSlice,
  tcpTimelock: tcpTimelockSlice,
}

const allSlices: {[key in keyof RootState]: (typeof allSlicesRaw)[key]} = allSlicesRaw

export default allSlices
