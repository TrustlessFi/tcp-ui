import { thunkArgs, RootState } from '../fetchNodes'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { createChainDataSlice, CacheDuration } from '../'
import { TcpTimelock } from '@trustlessfi/typechain'
import ProtocolContract from '../contracts/ProtocolContract'
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'

export interface tcpTimelockInfo {
  guardian: string
}

const tcpTimelockSlice = createChainDataSlice({
  name: 'tcpTimelock',
  dependencies: ['contracts', 'rootContracts'],
  stateSelector: (state: RootState) => state.tcpTimelock,
  cacheDuration: CacheDuration.LONG,
  thunkFunction:
    async (args: thunkArgs<'contracts' | 'rootContracts'>) => {
      const tcpTimelock = getContract(args.contracts.TcpTimelock, ProtocolContract.TcpTimelock) as TcpTimelock
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)

      const { tcpTimelockInfo } = await executeMulticalls(
        trustlessMulticall,
        {
          tcpTimelockInfo: oneContractManyFunctionMC(
            tcpTimelock,
            {
              guardian: rc.String,
            }
          )
        }
      )

      return tcpTimelockInfo
    },
})

export default tcpTimelockSlice
