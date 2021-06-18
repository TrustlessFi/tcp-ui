import { Position } from './'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { systemDebtInfo, getSystemDebtInfo } from '../systemDebt'
import { ChainIDState } from '../chainID'
import { getMarketInfo } from '../market'
import { BigNumber } from "ethers"
import { marketInfo } from "../market"
import { timeToPeriod, unscale, scale } from '../../utils'
import { PositionMap } from './'
import { AppDispatch } from '../../app/store'

import { Accounting } from "../../utils/typechain/Accounting";
import { ZhuPositionNft } from "../../utils/typechain/ZhuPositionNft";

export interface fetchPositionsArgs {
  dispatch: AppDispatch,
  chainIDState: ChainIDState,
  userAddress: string | null,
  sdi: systemDebtInfo | null ,
  marketInfo: marketInfo | null,
}

export const fetchPositions = async (data: fetchPositionsArgs) => {
  console.log("inside fetch positions")
  // check for dependencies are met for dependencies we cant fetch
  const chainID = data.chainIDState.chainID
  console.log({chainID, address: data.userAddress})
  if (chainID === null || data.userAddress === null) return null

  console.log({sdi: data.sdi, marketInfo: data.marketInfo})

  // check that dependencies are met for dependecies we can fetch,
  // and trigger fetch if they are not met
  if (data.sdi === null) data.dispatch(getSystemDebtInfo(data.chainIDState))
  if (data.marketInfo === null) data.dispatch(getMarketInfo(data.chainIDState))

  // check that all dependencies are met
  if (data.sdi === null || data.marketInfo === null) return null
  const accounting = await getProtocolContract(chainID, ProtocolContract.Accounting) as Accounting | null
  const positionNFT = await getProtocolContract(chainID, ProtocolContract.ZhuPositionNFT) as ZhuPositionNft | null
  if (accounting === null || positionNFT === null) return null

  // fetch the positions
  const sdi = data.sdi
  const marketInfo = data.marketInfo

  const positionIDs = await positionNFT.positionIDs(data.userAddress)

  const marketLastUpdatePeriod = marketInfo.lastPeriodGlobalInterestAccrued

  const positions = await Promise.all(positionIDs.map(async (positionID) => {
    const position = await accounting.getPosition(positionID);

    let positionDebt = position.debt;

    // calcuate estimated position debt
    if (!position.startDebtExchangeRate.eq(sdi.debtExchangeRate) && !position.startDebtExchangeRate.eq(0)) {
      positionDebt = positionDebt.mul(sdi.debtExchangeRate).div(position.startDebtExchangeRate);
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
