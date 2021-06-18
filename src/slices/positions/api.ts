import { Position } from './'
import { ChainID } from '../chainID'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { systemDebtInfo } from '../systemDebt'
import { BigNumber } from "ethers"
import { marketInfo } from "../market"
import { timeToPeriod, unscale } from '../../utils'
import { PositionMap } from './'

import { Accounting } from "../../utils/typechain/Accounting";
import { ZhuPositionNft } from "../../utils/typechain/ZhuPositionNft";

export type fetchPositionsArgs = {
  chainID: ChainID,
  userAddress: string,
  sdi: systemDebtInfo,
  marketInfo: marketInfo,
}

export function fetchPositions(data: fetchPositionsArgs) {
  return new Promise<{ data: number }>(async () => {
    const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting
    const positionNFT = await getProtocolContract(data.chainID, ProtocolContract.ZhuPositionNFT) as ZhuPositionNft
    const positionIDs = await positionNFT.positionIDs(data.userAddress)

    const marketLastUpdatePeriod = data.marketInfo.lastPeriodGlobalInterestAccrued.toNumber()

    const positions = await Promise.all(positionIDs.map(async (positionID) => {
      const position = await accounting.getPosition(positionID);

      let positionDebt = position.debt;

      // calcuate estimated position debt
      if (!data.sdi.debtExchangeRate.eq(position.startDebtExchangeRate) && !position.startDebtExchangeRate.eq(0)) {
        positionDebt = positionDebt.mul(data.sdi.debtExchangeRate).div(position.startDebtExchangeRate);
      }

      // calcuate estimated borrow rewards
      let approximateRewards = BigNumber.from(0)
      let lastTimeUpdated = position.lastTimeUpdated.toNumber()
      let lastPeriodUpdated = timeToPeriod(lastTimeUpdated, data.marketInfo.periodLength, data.marketInfo.firstPeriod)

      if (lastPeriodUpdated < marketLastUpdatePeriod)   {
        let avgDebtPerPeriod =
          data.sdi.cumulativeDebt
            .sub(position.startCumulativeDebt)
            .div(marketLastUpdatePeriod - lastPeriodUpdated)

        if (!avgDebtPerPeriod.eq(0)) {
          approximateRewards =
            position.debt
              .mul(data.sdi.totalTCPRewards.sub(position.startTCPRewards))
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
  })
}
