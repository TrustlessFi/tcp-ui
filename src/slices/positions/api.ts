import { Position } from './'
import { BigNumber } from "ethers"
import { timeToPeriod, unscale, scale } from '../../utils'
import { positionsInfo, positionsArgs, getPositions } from './'
import { AppDispatch } from '../../app/store'
import { waitForTransaction } from '../transactions'

import { Accounting } from '../../utils/typechain/Accounting'
import { HuePositionNFT } from '../../utils/typechain/HuePositionNFT'
import { createPositionArgs } from './index'
import getProvider from '../../utils/getProvider'
import { Market } from '../../utils/typechain'
import { UIID } from '../../constants'
import { ProtocolContract } from '../contracts/index';
import getContract from '../../utils/getContract'

export const fetchPositions = async (args: positionsArgs) => {
  const accounting = getContract(args.Accounting, ProtocolContract.Accounting) as Accounting
  const positionNFT = getContract(args.HuePositionNFT, ProtocolContract.HuePositionNFT) as HuePositionNFT

  // fetch the positions
  const positionIDs = await positionNFT.positionIDs(args.userAddress)

  const marketLastUpdatePeriod = args.marketInfo.lastPeriodGlobalInterestAccrued

  const positions = await Promise.all(positionIDs.map(async (positionID) => {
    const position = await accounting.getPosition(positionID)

    let positionDebt = position.debt

    // calcuate estimated position debt
    const debtExchangeRate  = scale(args.sdi.debtExchangeRate)
    if (!position.startDebtExchangeRate.eq(0) && !position.startDebtExchangeRate.eq(debtExchangeRate)) {
      positionDebt = positionDebt.mul(debtExchangeRate).div(position.startDebtExchangeRate)
    }

    // calcuate estimated borrow rewards
    let approximateRewards = BigNumber.from(0)
    let lastTimeUpdated = position.lastTimeUpdated.toNumber()
    let lastPeriodUpdated = timeToPeriod(lastTimeUpdated, args.marketInfo.periodLength, args.marketInfo.firstPeriod)

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

    const positionInfo = {
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
    return positionInfo
  }))

  const positionsMap: positionsInfo = {}
  positions.forEach(position => positionsMap[position.id] = position)
  return positionsMap
}

export const executeCreatePosition = async (dispatch: AppDispatch, args: createPositionArgs) => {
  const provider = getProvider()!
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
    title: 'Create Position',
    userAddress,
    nonce: tx.nonce
  }))

  return hash
}
