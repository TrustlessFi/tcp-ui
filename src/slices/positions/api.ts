import { Position } from './'
import { BigNumber } from "ethers"
import { timeToPeriod, unscale, scale } from '../../utils'
import { positionsInfo, positionsArgs } from './'
import { AppDispatch } from '../../app/store'
import { waitForTransaction } from '../transactions'
import { createPositionArgs } from './index'
import getProvider from '../../utils/getProvider'
import { UIID } from '../../constants'
import { ProtocolContract } from '../contracts/index';
import getContract from '../../utils/getContract'
import { TransactionType } from '../transactions/index';
import { getDuplicateFuncMulticall, executeMulticalls } from '../../utils/Multicall/index';
import * as mc from '../../utils/Multicall/index'

import { Accounting, HuePositionNFT, Market } from '../../utils/typechain'

export const fetchPositions = async (args: positionsArgs) => {
  const accounting = getContract(args.Accounting, ProtocolContract.Accounting) as Accounting
  const positionNFT = getContract(args.HuePositionNFT, ProtocolContract.HuePositionNFT) as HuePositionNFT

  const marketLastUpdatePeriod = args.marketInfo.lastPeriodGlobalInterestAccrued

  // fetch the positions
  const positionIDs = await positionNFT.positionIDs(args.userAddress)

  const { positions } = await executeMulticalls({
    positions: getDuplicateFuncMulticall(
      accounting,
      'getPosition',
      mc.PositionData,
      Object.fromEntries(positionIDs.map(positionID => [positionID.toString(), [positionID]]))
    ),
  })

  const positionsInfo = positionIDs.map((positionID) => {
    const position = positions[positionID.toString()]

    let positionDebt = position.debt

    // calcuate estimated position debt
    const debtExchangeRate  = scale(args.sdi.debtExchangeRate)
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

export const executeCreatePosition = async (dispatch: AppDispatch, args: createPositionArgs) => {
  const provider = getProvider()
  const signer = provider.getSigner()
  const userAddress = await signer.getAddress()

  const market = getContract(args.Market, ProtocolContract.Market) as Market

  const tx = await market.connect(signer).createPosition(scale(args.debtCount), UIID, {
    gasLimit: 1e10,
    value: scale(args.collateralCount)
  })
  const hash = tx.hash

  dispatch(waitForTransaction({
    hash,
    message: 'Create Position',
    userAddress,
    nonce: tx.nonce,
    type: TransactionType.CreatePosition,
  }))

  return hash
}
