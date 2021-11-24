import { Position } from './'
import { BigNumber } from "ethers"
import { timeToPeriod, unscale, scale } from '../../utils'
import { positionsInfo, positionsArgs } from './'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { getDuplicateFuncMulticall, executeMulticalls } from '@trustlessfi/multicall'
import { PromiseType } from '@trustlessfi/utils'

import { Accounting, HuePositionNFT } from '@trustlessfi/typechain'
import { ProtocolContract } from '../contracts'

export const fetchPositions = async (args: positionsArgs) => {
  const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
  const positionNFT = getContract(args.contracts[ProtocolContract.HuePositionNFT], ProtocolContract.HuePositionNFT) as HuePositionNFT
  const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

  const marketLastUpdatePeriod = args.marketInfo.lastPeriodGlobalInterestAccrued

  // fetch the positions
  const positionIDs = await positionNFT.positionIDs(args.userAddress)

  const { positions } = await executeMulticalls(trustlessMulticall, {
    positions: getDuplicateFuncMulticall(
      accounting,
      'getPosition',
      (result: any) => result as PromiseType<ReturnType<Accounting['getPosition']>>,
      Object.fromEntries(positionIDs.map(positionID => [positionID.toString(), [positionID]]))
    ),
  })

  const positionsInfo = positionIDs.map((positionID) => {
    const position = positions[positionID.toString()]

    let positionDebt = position.debt

    // calcuate estimated position debt
    const debtExchangeRate = scale(args.sdi.debtExchangeRate)
    if (!position.startDebtExchangeRate.eq(0) && !position.startDebtExchangeRate.eq(debtExchangeRate)) {
      positionDebt = positionDebt.mul(debtExchangeRate).div(position.startDebtExchangeRate)
    }

    // calcuate estimated borrow rewards
    let approximateRewards = BigNumber.from(0)
    const lastTimeUpdated = position.lastTimeUpdated.toNumber()
    const lastPeriodUpdated = timeToPeriod(lastTimeUpdated, args.marketInfo.periodLength, args.marketInfo.firstPeriod)

    if (lastPeriodUpdated < marketLastUpdatePeriod)   {
      let avgDebtPerPeriod =
        scale(args.sdi.cumulativeDebt)
          .sub(position.startCumulativeDebt)
          .div(marketLastUpdatePeriod - lastPeriodUpdated)

      if (!avgDebtPerPeriod.eq(0)) {
        approximateRewards =
          position.debt
            .mul(scale(args.sdi.totalTCPRewards).sub(position.startTCPRewards))
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
    } as Position
  })

  const positionsMap: positionsInfo = {}
  positionsInfo.forEach(positionInfo => positionsMap[positionInfo.id] = positionInfo)
  return positionsMap
}
