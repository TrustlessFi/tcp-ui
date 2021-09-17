import { Position } from './'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { BigNumber } from "ethers"
import { timeToPeriod, unscale, scale } from '../../utils'
import { positionsInfo, positionsArgs } from './'
import { AppDispatch, store, RootState } from '../../app/store'

import { Accounting } from '../../utils/typechain/Accounting'
import { HuePositionNFT } from '../../utils/typechain/HuePositionNFT'
import { createPositionArgs } from './index'
import getProvider from '../../utils/getProvider'
import { Market } from '../../utils/typechain'
import { UIID } from '../../constants'
import { getPositions } from './'
import { ContractTransaction, ContractReceipt } from 'ethers'
import { mnt } from '../../utils/index';

export const fetchPositions = async (data: positionsArgs) => {
  const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting | null
  const positionNFT = await getProtocolContract(data.chainID, ProtocolContract.HuePositionNFT) as HuePositionNFT | null
  if (accounting === null || positionNFT === null) return null

  // fetch the positions
  const positionIDs = await positionNFT.positionIDs(data.userAddress)

  const marketLastUpdatePeriod = data.marketInfo.lastPeriodGlobalInterestAccrued

  const positions = await Promise.all(positionIDs.map(async (positionID) => {
    const position = await accounting.getPosition(positionID)

    let positionDebt = position.debt

    // calcuate estimated position debt
    const debtExchangeRate  = scale(data.sdi.debtExchangeRate)
    if (!position.startDebtExchangeRate.eq(0) && !position.startDebtExchangeRate.eq(debtExchangeRate)) {
      positionDebt = positionDebt.mul(debtExchangeRate).div(position.startDebtExchangeRate)
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
    } as Position
  }))

  const positionsMap: positionsInfo = {}
  positions.forEach(position => positionsMap[position.id] = position)
  return positionsMap
}

export const executeCreatePosition = async (dispatch: AppDispatch, args: createPositionArgs) => {
  const chainID = args.chainID
  const market = (await getProtocolContract(chainID, ProtocolContract.Market)) as Market
  const signer = getProvider()!.getSigner()

  const tx = await market.connect(signer).createPosition(scale(args.debtCount), UIID, {
    gasLimit: 1e10,
    value: scale(args.collateralCount)
  })

  // TODO dispatch action registering this hash

  return tx.hash
}

  /*
  const state = store.getState()

  const userAddress = state.wallet.address
  const sdi = state.systemDebt.data.value
  const marketInfo = state.market.data.value

  if (userAddress === null) throw 'User Address null on create position'
  if (sdi === null) throw 'Sdi null on create position'
  if (marketInfo === null) throw 'MarketInfo null on create position'

  dispatch(getPositions({chainID, userAddress, sdi, marketInfo}))
  */
