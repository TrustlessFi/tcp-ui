import { RootState  } from '../fetchNodes'
import { BigNumber } from "ethers"
import { timeToPeriod, unscale, bnf } from '../../utils'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { oneContractOneFunctionMC, executeMulticalls } from '@trustlessfi/multicall'
import { PromiseType } from '@trustlessfi/utils'
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
  dependencies: ['userAddress', 'sdi', 'marketInfo', 'contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.positions,
  cacheDuration: CacheDuration.SHORT,
  isUserData: true,
  thunkFunction:
    async (args: thunkArgs<'userAddress' | 'sdi' | 'marketInfo' | 'contracts' | 'rootContracts'>) => {
      const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting
      const positionNFT = getContract(args.contracts[ProtocolContract.HuePositionNFT], ProtocolContract.HuePositionNFT) as HuePositionNFT
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const marketLastUpdatePeriod = args.marketInfo.lastPeriodGlobalInterestAccrued

      // fetch the positions
      const positionIDs = await positionNFT.positionIDs(args.userAddress)

      const { positions } = await executeMulticalls(trustlessMulticall, {
        positions: oneContractOneFunctionMC(
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
        if (!position.startDebtExchangeRate.eq(0) && !position.startDebtExchangeRate.eq(args.sdi.debtExchangeRate)) {
          positionDebt = positionDebt.mul(args.sdi.debtExchangeRate).div(position.startDebtExchangeRate)
        }

        // calcuate estimated borrow rewards
        let approximateRewards = BigNumber.from(0)
        const lastTimeUpdated = position.lastTimeUpdated.toNumber()
        const lastPeriodUpdated = timeToPeriod(lastTimeUpdated, args.marketInfo.periodLength, args.marketInfo.firstPeriod)


        if (lastPeriodUpdated < marketLastUpdatePeriod)   {
          let avgDebtPerPeriod =
            bnf(args.sdi.cumulativeDebt)
              .sub(position.startCumulativeDebt)
              .div(marketLastUpdatePeriod - lastPeriodUpdated)

          if (!avgDebtPerPeriod.eq(0)) {
            approximateRewards =
              position.debt
                .mul(bnf(args.sdi.totalTCPRewards).sub(position.startTCPRewards))
                .div(avgDebtPerPeriod)
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
