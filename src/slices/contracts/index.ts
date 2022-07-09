import { thunkArgs, RootState } from '../fetchNodes'
import { Governor } from '@trustlessfi/typechain'
import ProtocolContract, { RootContract, TDaoContract, TDaoRootContract } from '../contracts/ProtocolContract'
import getContract from '../../utils/getContract'
import { createChainDataSlice, CacheDuration } from '../'
import { getMulticallContract } from '../../utils/getContract'
import { executeMulticalls, oneContractManyFunctionMC } from '@trustlessfi/multicall'
import { Accounting, TDao } from '@trustlessfi/typechain'

export type contractsInfo = { [key in ProtocolContract | TDaoContract]: string }

const contractsSlice = createChainDataSlice({
  name: 'contracts',
  dependencies: ['rootContracts'],
  stateSelector: (state: RootState) => state.contracts,
  cacheDuration: CacheDuration.LONG,
  thunkFunction:
    async (args: thunkArgs<'rootContracts' >) => {
      const trustlessMulticall = getMulticallContract(args.rootContracts.trustlessMulticall)
      const governor = getContract(RootContract.Governor, args.rootContracts.governor) as Governor
      const tdao = getContract(TDaoRootContract.TDao, args.rootContracts.tdao) as TDao

      const { tcpContracts, tdaoContracts } = await executeMulticalls(
        trustlessMulticall,
        {
          tcpContracts: oneContractManyFunctionMC(
            governor,
            {
              accounting: [],
              auctions: [],
              tcp: [],
              hue: [],
              huePositionNFT: [],
              enforcedDecentralization: [],
              lendHue: [],
              liquidations: [],
              market: [],
              prices: [],
              protocolLock: [],
              rates: [],
              rewards: [],
              settlement: [],
              timelock: [],
              governorAlpha: [],
              tcpAllocation: [],
            }
          ),
          tdaoContracts: oneContractManyFunctionMC(
            tdao,
            {
              timelock: [],
              tDaoGovernorAlpha: [],
              tDaoToken: [],
              tDaoPositionNFT: [],
              votingRewardsSafe: []
            }
          )
        }
      )

      const accounting = getContract<Accounting>(ProtocolContract.Accounting, tcpContracts.accounting)

      const { truEth } = await executeMulticalls(
        trustlessMulticall,
        {
          truEth: oneContractManyFunctionMC(
            accounting,
            { truEth: [] }
          )
        }
      )

      return {
        [ProtocolContract.Accounting]: tcpContracts.accounting,
        [ProtocolContract.Auctions]: tcpContracts.auctions,
        [ProtocolContract.EnforcedDecentralization]: tcpContracts.enforcedDecentralization,
        [ProtocolContract.Hue]: tcpContracts.hue,
        [ProtocolContract.HuePositionNFT]: tcpContracts.huePositionNFT,
        [ProtocolContract.LendHue]: tcpContracts.lendHue,
        [ProtocolContract.Liquidations]: tcpContracts.liquidations,
        [ProtocolContract.Market]: tcpContracts.market,
        [ProtocolContract.Prices]: tcpContracts.prices,
        [ProtocolContract.ProtocolLock]: tcpContracts.protocolLock,
        [ProtocolContract.Rates]: tcpContracts.rates,
        [ProtocolContract.Rewards]: tcpContracts.rewards,
        [ProtocolContract.Settlement]: tcpContracts.settlement,
        [ProtocolContract.Tcp]: tcpContracts.tcp,
        [ProtocolContract.TcpGovernorAlpha]: tcpContracts.governorAlpha,
        [ProtocolContract.TcpTimelock]: tcpContracts.timelock,
        [ProtocolContract.TcpAllocation]: tcpContracts.tcpAllocation,

        [ProtocolContract.TruEth]: truEth.truEth,

        [TDaoContract.TDaoToken]: tdaoContracts.tDaoToken,
        [TDaoContract.TDaoPositionNFT]: tdaoContracts.tDaoPositionNFT,
        [TDaoContract.TDaoGovernorAlpha]: tdaoContracts.tDaoGovernorAlpha,
        [TDaoContract.TDaoTimelock]: tdaoContracts.timelock,
        [TDaoContract.TDaoVotingRewardsSafe]: tdaoContracts.votingRewardsSafe,
      }
    },
})

export default contractsSlice
