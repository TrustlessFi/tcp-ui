import { Position } from './'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts'
import { BigNumber } from "ethers"
import { timeToPeriod, unscale, scale } from '../../utils'
import { positionsInfo, positionsArgs } from './'

import { Accounting } from '../../utils/typechain/Accounting'
import { HuePositionNFT } from '../../utils/typechain/HuePositionNFT'
import { createPositionArgs } from './index'
import getProvider from '../../utils/getProvider'
import { Market } from '../../utils/typechain'
import { UIID } from '../../constants';
import { ContractTransaction, ContractReceipt } from 'ethers'

export const fetchPositions = async (data: positionsArgs) => {
  console.log("here 1")
  const accounting = await getProtocolContract(data.chainID, ProtocolContract.Accounting) as Accounting | null
  const positionNFT = await getProtocolContract(data.chainID, ProtocolContract.HuePositionNFT) as HuePositionNFT | null
  if (accounting === null || positionNFT === null) return null

  // fetch the positions
  const positionIDs = await positionNFT.positionIDs(data.userAddress)

  const marketLastUpdatePeriod = data.marketInfo.lastPeriodGlobalInterestAccrued
  console.log("here 112")

  const positions = await Promise.all(positionIDs.map(async (positionID) => {
    console.log("here a")
    const position = await accounting.getPosition(positionID);

    let positionDebt = position.debt;
    console.log("here b")

    // calcuate estimated position debt
    const debtExchangeRate  = scale(data.sdi.debtExchangeRate)
      console.log("here bbbb")
    if (!position.startDebtExchangeRate.eq(0)) {
      console.log("here bb")
      if (!position.startDebtExchangeRate.eq(debtExchangeRate)) {
      console.log("here bbc")

      positionDebt = positionDebt.mul(debtExchangeRate).div(position.startDebtExchangeRate)
      }
    }
    console.log("here c")

    // calcuate estimated borrow rewards
    let approximateRewards = BigNumber.from(0)
    let lastTimeUpdated = position.lastTimeUpdated.toNumber()
    let lastPeriodUpdated = timeToPeriod(lastTimeUpdated, data.marketInfo.periodLength, data.marketInfo.firstPeriod)

    console.log("here d")

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
  console.log("here 2")

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
  }))

  let positionsMap: positionsInfo = {}
  positions.forEach(position => positionsMap[position.id] = position)
  return positionsMap;
}


export const genExecuteTransaction = async(
  rawTransaction: Promise<ContractTransaction>
): Promise<ContractReceipt> => {
  try {
    const tx = await rawTransaction;

    // showAlert({ content: `Executing ${tx.hash}` });

    const receipt = await tx.wait(1)
    // if (isDevEnvironment) await sleepS(2)

    // hideAlert();
    // showAlert({ content: `Transaction complete!` });

    return receipt;
  } catch(e: any) {
    // handleFailure(e);
    throw e;
  }
}

export const executeCreatePosition = async (data: createPositionArgs) => {
  const market = (await getProtocolContract(data.chainID, ProtocolContract.Market)) as Market
  const signer = getProvider()!.getSigner()

  const transaction = market.connect(getProvider()!.getSigner()).createPosition(scale(data.debtCount), UIID, {
    gasLimit: 1e10,
    value: scale(data.collateralCount)
  });
  await genExecuteTransaction(transaction)
}
