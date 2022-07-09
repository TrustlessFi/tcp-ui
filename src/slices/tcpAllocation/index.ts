import getContract, { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { unscale } from '../../utils'
import { TcpAllocation } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { thunkArgs, RootState } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface tcpAllocationInfo {
  restrictedToUnlockDuration: boolean
  restrictedUnlockTime: number
  startTime: number
  totalAllocation: number
  minimumAverageTokensAllocatedxLockYears: string
  tokensAllocated: number
  cumulativeTokensAllocatedxLockYears: string
}

const tcpAllocationSlice = createChainDataSlice({
  name: 'tcpAllocation',
  dependencies: ['contracts', 'rootContracts', 'userAddress'],
  stateSelector: (state: RootState) => state.tcpAllocation,
  cacheDuration: CacheDuration.SHORT,
  isUserData: true,
  reducers: {
    clearTcpAllocationInfo: (state) => {
      state.value = null
    },
  },
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts' | 'userAddress'>) => {
      const tcpAllocation = getContract<TcpAllocation>(ProtocolContract.TcpAllocation, args.contracts.TcpAllocation)
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { tdaoInfo } = await executeMulticalls(trustlessMulticall, {
        tdaoInfo: oneContractManyFunctionMC(
          tcpAllocation,
          {
            restrictedToUnlockDuration: [args.userAddress],
            restrictedUnlockTime: [],
            startTime: [],
            getUserAllocation: [args.userAddress],
          },
        ),
      })

      return {
        restrictedToUnlockDuration: tdaoInfo.restrictedToUnlockDuration,
        restrictedUnlockTime: tdaoInfo.restrictedUnlockTime.toNumber(),
        startTime: tdaoInfo.startTime.toNumber(),
        totalAllocation: unscale(tdaoInfo.getUserAllocation.totalAllocation),
        minimumAverageTokensAllocatedxLockYears: tdaoInfo.getUserAllocation.minimumAverageTokensAllocatedxLockYears.toString(),
        tokensAllocated: unscale(tdaoInfo.getUserAllocation.tokensAllocated),
        cumulativeTokensAllocatedxLockYears: tdaoInfo.getUserAllocation.cumulativeTokensAllocatedxLockYears.toString(),
      }
    }
})

export const { clearTcpAllocationInfo } = tcpAllocationSlice.slice.actions

export default tcpAllocationSlice
