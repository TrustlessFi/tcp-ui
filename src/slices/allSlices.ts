import chainIDSlice from './chainID'
import userAddressSlice from './userAddress'
import balancesSlice from './balances'
import contractsSlice from './contracts'
import currentChainInfoSlice from './currentChainInfo'
import governorSlice from './governor'
import liquidationsSlice from './liquidations'
import liquidityPositionsSlice from './liquidityPositions'
import marketSlice from './market'
import poolsCurrentDataSlice from './poolsCurrentData'
import poolsMetadataSlice from './poolsMetadata'
import positionsSlice from './positions'
import positionStateSlice from './positionState'
import pricesSlice from './prices'
import ratesSlice from './rates'
import rewardsSlice from './rewards'
import rootContractsSlice from './rootContracts'
import systemDebtSlice from './systemDebt'
import stakingSlice from './staking'
import uniswapContractsSlice from './uniswapContracts'
import notificationsSlice from './notifications'
import tabsSlice from './tabs'
import transactionsSlice from './transactions'
import walletSlice from './wallet'
import { RootState }  from './fetchNodes'

const allSlicesRaw = {
  chainID: chainIDSlice,
  rootContracts: rootContractsSlice,
  userAddress: userAddressSlice,
  notifications: notificationsSlice,
  positionState: positionStateSlice,
  staking: stakingSlice,
  transactions: transactionsSlice,
  tabs: tabsSlice,
  wallet: walletSlice,

  balances: balancesSlice,
  contracts: contractsSlice,
  currentChainInfo: currentChainInfoSlice,
  governorInfo: governorSlice,
  liquidationsInfo: liquidationsSlice,
  liquidityPositions: liquidityPositionsSlice,
  marketInfo: marketSlice,
  poolsCurrentData: poolsCurrentDataSlice,
  poolsMetadata: poolsMetadataSlice,
  positions: positionsSlice,
  pricesInfo: pricesSlice,
  ratesInfo: ratesSlice,
  rewardsInfo: rewardsSlice,
  sdi: systemDebtSlice,
  uniswapContracts: uniswapContractsSlice,
}

const allSlices: {[key in keyof RootState]: (typeof allSlicesRaw)[key]} = allSlicesRaw

export default allSlices
