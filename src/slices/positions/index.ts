import { RootState  } from '../fetchNodes'
import { BigNumber } from "ethers"
import {
  timeToPeriod, unscale, bnf,
 } from '../../utils'
import getContract, { getMulticallContract } from '../../utils/getContract'
import {
  oneContractOneFunctionMC,
  executeMulticalls,
  idsToIds,
} from '@trustlessfi/multicall'
import { thunkArgs } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

import { Accounting, HuePositionNFT } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'

export interface Position {
  collateralCount: number,
  debtCount: number,
  approximateRewards: number,
  rewards: number,
  id: number,
  claimingRewards: boolean,
  claimedRewards: boolean,
}

export interface positions { [key: number]: Position }

const positionsSlice = createChainDataSlice({
  name: 'positions',
  dependencies: ['userAddress', 'sdi', 'marketInfo', 'contracts', 'rootContracts', 'currentChainInfo'],
  stateSelector: (state: RootState) => state.positions,
  cacheDuration: CacheDuration.SHORT,
  isUserData: true,
  thunkFunction:
    async (args: thunkArgs<'userAddress' | 'sdi' | 'marketInfo' | 'contracts' | 'rootContracts' | 'currentChainInfo'>) => {
      const accounting = getContract<Accounting>(ProtocolContract.Accounting, args.contracts.Accounting)
      const positionNFT = getContract<HuePositionNFT>(ProtocolContract.HuePositionNFT, args.contracts.HuePositionNFT)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      // fetch the positions
      const positionIDs = await positionNFT.positionIDs(args.userAddress)

      const { positions } = await executeMulticalls(trustlessMulticall, {
        positions: oneContractOneFunctionMC(
          accounting,
          'getPosition',
          idsToIds(positionIDs.map(pid => pid.toString())),
        ),
      })

      const positionsInfo = positionIDs.map((positionID) => {
        const position = positions[positionID.toString()]

        let positionDebt = position.debt

        // calcuate estimated position debt
        if (!position.startDebtExchangeRate.eq(0) && !position.startDebtExchangeRate.eq(args.sdi.debtExchangeRate)) {
          positionDebt = positionDebt.mul(args.sdi.debtExchangeRate).div(position.startDebtExchangeRate)
        }

        // calcuate estimated borrow rewards
        let approximateRewards = BigNumber.from(0)

        const getMarketPeriodForTime = (time: number) =>
          timeToPeriod(time, args.marketInfo.periodLength, args.marketInfo.firstPeriod)

        const marketLastUpdatePeriod = args.marketInfo.lastPeriodGlobalInterestAccrued
        const lastPeriodPositionUpdated = getMarketPeriodForTime(position.lastTimeUpdated.toNumber())
        const currentMarketPeriod = getMarketPeriodForTime(args.currentChainInfo.blockTimestamp)

        if (lastPeriodPositionUpdated < marketLastUpdatePeriod) {
          const rewardsPeriods = marketLastUpdatePeriod - lastPeriodPositionUpdated
          let avgDebtPerPeriod =
            bnf(args.sdi.cumulativeDebt)
              .sub(position.startCumulativeDebt)
              .div(rewardsPeriods)

          if (!avgDebtPerPeriod.eq(0)) {
            approximateRewards =
              position.debt
                .mul(bnf(args.sdi.totalTCPRewards).sub(position.startTCPRewards))
                .div(avgDebtPerPeriod)

            if (marketLastUpdatePeriod < currentMarketPeriod) {
              const approximateRewardsPerPeriod = approximateRewards.div(rewardsPeriods)
              const extraRewardsPeriods = currentMarketPeriod - marketLastUpdatePeriod
              approximateRewards = approximateRewards.add(approximateRewardsPerPeriod.mul(extraRewardsPeriods))
            }
          }
        }

        return {
          collateralCount: unscale(position.collateral),
          debtCount: unscale(positionDebt),
          approximateRewards: unscale(approximateRewards),
          id: positionID.toNumber(),
          claimingRewards: false,
          claimedRewards: false,
        } as Position
      })

      const positionsMap: positions = {}
      positionsInfo.forEach(positionInfo => positionsMap[positionInfo.id] = positionInfo)
      return positionsMap
    },
})

export default positionsSlice
