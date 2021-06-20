import { Position } from './'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { systemDebtInfo } from '../systemDebt'
import { ChainID } from '../chainID'
import { BigNumber } from "ethers"
import { marketInfo } from "../market"
import { timeToPeriod, unscale, scale } from '../../utils'
import { PositionMap } from './'

import { Accounting } from '../../utils/typechain/Accounting'
import { ZhuPositionNFT } from '../../utils/typechain/ZhuPositionNFT'

export interface fetchPositionsArgs {
  chainID: ChainID,
  userAddress: string,
  sdi: systemDebtInfo,
  marketInfo: marketInfo,
}

export const fetchPositions = async (data: fetchPositionsArgs) => {
  const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting | null
  const positionNFT = await getProtocolContract(data.chainID, ProtocolContract.ZhuPositionNFT) as ZhuPositionNFT | null
  if (accounting === null || positionNFT === null) return null

  // fetch the positions
  const positionIDs = await positionNFT.positionIDs(data.userAddress)

  const marketLastUpdatePeriod = data.marketInfo.lastPeriodGlobalInterestAccrued

  const positions = await Promise.all(positionIDs.map(async (positionID) => {
    const position = await accounting.getPosition(positionID);

    let positionDebt = position.debt;

    // calcuate estimated position debt
    if (!position.startDebtExchangeRate.eq(data.sdi.debtExchangeRate) && !position.startDebtExchangeRate.eq(0)) {
      positionDebt = positionDebt.mul(scale(data.sdi.debtExchangeRate)).div(position.startDebtExchangeRate);
    }

    // calcuate estimated borrow rewards
    let approximateRewards = BigNumber.from(0)
    let lastTimeUpdated = position.lastTimeUpdated.toNumber()
    let lastPeriodUpdated = timeToPeriod(lastTimeUpdated, data.marketInfo.periodLength, data.marketInfo.firstPeriod)

    if (lastPeriodUpdated < marketLastUpdatePeriod)   {
      let avgDebtPerPeriod =
        scale(data.sdi.cumulativeDebt)
          .sub(position.startCumulativeDebt)
          .div(marketLastUpdatePeriod - lastPeriodUpdated)

      if (!avgDebtPerPeriod.eq(0)) {
        approximateRewards =
          position.debt
            .mul(scale(data.sdi.totalTCPRewards).sub(position.startTCPRewards))
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
