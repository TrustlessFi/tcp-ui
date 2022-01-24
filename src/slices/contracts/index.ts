import { thunkArgs, RootState } from '../fetchNodes'
import { Governor } from '@trustlessfi/typechain'
import { RootContract } from '../contracts/ProtocolContract'
import getContract from '../../utils/getContract'
import { createChainDataSlice } from '../'
import { getMulticallContract } from '../../utils/getContract';
import { executeMulticalls, oneContractManyFunctionMC, rc } from '@trustlessfi/multicall'
import  ProtocolContract from './ProtocolContract'

export type contractsInfo = { [key in ProtocolContract]: string }

const contractsSlice = createChainDataSlice({
  name: 'contracts',
  dependencies: ['rootContracts'],
  stateSelector: (state: RootState) => state.contracts,
  thunkFunction:
    async (args: thunkArgs<'rootContracts' >) => {
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const governor = getContract(args.rootContracts.governor, RootContract.Governor) as Governor

      const { contracts } = await executeMulticalls(
        trustlessMulticall,
        {
          contracts: oneContractManyFunctionMC(
            governor,
            {
              accounting: rc.String,
              auctions: rc.String,
              tcp: rc.String,
              hue: rc.String,
              huePositionNFT: rc.String,
              enforcedDecentralization: rc.String,
              lendHue: rc.String,
              liquidations: rc.String,
              market: rc.String,
              prices: rc.String,
              protocolLock: rc.String,
              rates: rc.String,
              rewards: rc.String,
              settlement: rc.String,
              timelock: rc.String,
              governorAlpha: rc.String,
              tcpAllocation: rc.String,
            }
          )
        }
      )

      return {
        [ProtocolContract.Accounting]: contracts.accounting,
        [ProtocolContract.Auctions]: contracts.auctions,
        [ProtocolContract.EnforcedDecentralization]: contracts.enforcedDecentralization,
        [ProtocolContract.Hue]: contracts.hue,
        [ProtocolContract.HuePositionNFT]: contracts.huePositionNFT,
        [ProtocolContract.LendHue]: contracts.lendHue,
        [ProtocolContract.Liquidations]: contracts.liquidations,
        [ProtocolContract.Market]: contracts.market,
        [ProtocolContract.Prices]: contracts.prices,
        [ProtocolContract.ProtocolLock]: contracts.protocolLock,
        [ProtocolContract.Rates]: contracts.rates,
        [ProtocolContract.Rewards]: contracts.rewards,
        [ProtocolContract.Settlement]: contracts.settlement,
        [ProtocolContract.Tcp]: contracts.tcp,
        [ProtocolContract.TcpGovernorAlpha]: contracts.governorAlpha,
        [ProtocolContract.TcpTimelock]: contracts.timelock,
      }
    },
})

export default contractsSlice
