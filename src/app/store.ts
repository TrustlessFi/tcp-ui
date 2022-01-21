import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import balancesReducer from '../slices/balances'
import chainIDReducer from '../slices/chainID'
import contractsReducer from '../slices/contracts'
import currentChainInfoReducer from '../slices/currentChainInfo'
import governorReducer from '../slices/governor'
import liquidationsReducer from '../slices/liquidations'
import liquidityPositionsReducer from '../slices/liquidityPositions'
import marketReducer from '../slices/market'
import notificationsReducer from '../slices/notifications'
import poolsCurrentDataReducer from '../slices/poolsCurrentData'
import poolsMetadataReducer from '../slices/poolsMetadata'
import positionsReducer from '../slices/positions'
import pricesReducer from '../slices/prices'
import ratesReducer from '../slices/rates'
import rewardsReducer from '../slices/rewards'
import rootContractReducer from '../slices/rootContracts'
import systemDebtReducer from '../slices/systemDebt'
import tokensAddedToWalletReducer from '../slices/tokensAddedToWallet'
import transactionsReducer from '../slices/transactions'
import uniswapContractsReducer from '../slices/uniswapContracts'
import userAddressReducer from '../slices/userAddress'
import walletReducer from '../slices/wallet'


export const store = configureStore({
  reducer: {
    balances: balancesReducer,
    chainID: chainIDReducer,
    contracts: contractsReducer,
    currentChainInfo: currentChainInfoReducer,
    governor: governorReducer,
    liquidations: liquidationsReducer,
    liquidityPositions: liquidityPositionsReducer,
    market: marketReducer,
    notifications: notificationsReducer,
    poolsCurrentData: poolsCurrentDataReducer,
    poolsMetadata: poolsMetadataReducer,
    positions: positionsReducer,
    prices: pricesReducer,
    rates: ratesReducer,
    rewards: rewardsReducer,
    rootContracts: rootContractReducer,
    systemDebt: systemDebtReducer,
    tokensAddedToWallet: tokensAddedToWalletReducer,
    transactions: transactionsReducer,
    uniswapContracts: uniswapContractsReducer,
    userAddress: userAddressReducer,
    wallet: walletReducer,
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
