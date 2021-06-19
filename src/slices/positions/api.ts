import { Position } from './'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { SystemDebtInfoState, getSystemDebtInfo } from '../systemDebt'
import { ChainIDState } from '../chainID'
import { BigNumber } from "ethers"
import { MarketState, getMarketInfo } from "../market"
import { timeToPeriod, unscale, scale } from '../../utils'
import { PositionMap, getPositions } from './'
import { idle } from '../'
import { AppDispatch, store } from '../../app/store'
import { AppSelector } from '../../app/hooks'

import { Accounting } from "../../utils/typechain/Accounting";
import { ZhuPositionNft } from "../../utils/typechain/ZhuPositionNft";

export interface fetchPositionsArgs {
  dispatch: AppDispatch,
  chainIDState: ChainIDState,
  userAddress: string | null,
  sdi: SystemDebtInfoState,
  marketInfo: MarketState,
}

export const waitForPositions = (selector: AppSelector, dispatch: AppDispatch): PositionMap | null => {
  const chainIDState = selector(state => state.chainID)
  const userAddress = selector(state => state.wallet.address)
  const sdi = selector(state => state.systemDebt)
  const marketInfo = selector(state => state.market)
  const positions = selector(state => state.positions.data)

  // cant subscribe to loading or else we would get an infinite loop
  if (positions === null && !store.getState().positions.loading) {
    dispatch(getPositions({dispatch, chainIDState, userAddress, sdi, marketInfo }))
  }
  return positions
}

export const fetchPositions = async (data: fetchPositionsArgs) => {
  // check dependencies are met for dependencies we cant fetch
  const chainID = data.chainIDState.chainID
  if (chainID === null || data.userAddress === null) return null

  // check that dependencies are met for dependecies we can fetch,
  // and trigger fetch if they are not met and they are not already being fetched
  if (idle(data.sdi)) data.dispatch(getSystemDebtInfo(data.chainIDState))
  if (idle(data.marketInfo)) data.dispatch(getMarketInfo(data.chainIDState))

  // check that all dependencies are met
  const sdi = data.sdi.data
  const marketInfo = data.marketInfo.data
  if (sdi === null || marketInfo === null) return null

  const accounting = await getProtocolContract(chainID, ProtocolContract.Accounting) as Accounting | null
  const positionNFT = await getProtocolContract(chainID, ProtocolContract.ZhuPositionNFT) as ZhuPositionNft | null
  if (accounting === null || positionNFT === null) return null

  // fetch the positions
  const positionIDs = await positionNFT.positionIDs(data.userAddress)

  const marketLastUpdatePeriod = marketInfo.lastPeriodGlobalInterestAccrued

  const positions = await Promise.all(positionIDs.map(async (positionID) => {
    const position = await accounting.getPosition(positionID);

    let positionDebt = position.debt;

    // calcuate estimated position debt
    if (!position.startDebtExchangeRate.eq(sdi.debtExchangeRate) && !position.startDebtExchangeRate.eq(0)) {
      positionDebt = positionDebt.mul(scale(sdi.debtExchangeRate)).div(position.startDebtExchangeRate);
    }

    // calcuate estimated borrow rewards
    let approximateRewards = BigNumber.from(0)
    let lastTimeUpdated = position.lastTimeUpdated.toNumber()
    let lastPeriodUpdated = timeToPeriod(lastTimeUpdated, marketInfo.periodLength, marketInfo.firstPeriod)

    if (lastPeriodUpdated < marketLastUpdatePeriod)   {
      let avgDebtPerPeriod =
        scale(sdi.cumulativeDebt)
          .sub(position.startCumulativeDebt)
          .div(marketLastUpdatePeriod - lastPeriodUpdated)

      if (!avgDebtPerPeriod.eq(0)) {
        approximateRewards =
          position.debt
            .mul(scale(sdi.totalTCPRewards).sub(position.startTCPRewards))
            .div(avgDebtPerPeriod)
      }
    }

    return {
      collateralCount: unscale(position.collateral),
      debtCount: unscale(positionDebt),
      approximateRewards: Math.round(unscale(approximateRewards)),
      id: positionID.toNumber(),
      lastBorrowTime: position.lastBorrowTime.toNumber(),
      updating: false,
      updated: false,
      claimingRewards: false,
      claimedRewards: false,
    } as Position;
  }));

  let positionsMap: PositionMap = {}
  positions.forEach(position => positionsMap[position.id] = position)
  return positionsMap;
}
