import { getAddress, rootContracts } from '../../utils/Addresses';
import { Governor } from "../../utils/typechain"
import { ChainID } from '../chainID'
import { getContractArgs, ProtocolContract, getContractReturnType, getSingleContractArgs } from './'

import getProvider from '../../utils/getProvider'
import { assertUnreachable } from '../../utils'
import { Contract } from 'ethers'

import governorArtifact from '../../utils/artifacts/contracts/core/governance/Governor.sol/Governor.json'

export const executeGetGovernor = async (args: getSingleContractArgs) => getAddress(args.chainID, rootContracts.Governor)

export const executeGetTcpMulticall = async (args: getSingleContractArgs) => getAddress(args.chainID, rootContracts.TcpMulticall)

export const executeGetContract = async (args: getContractArgs): Promise<getContractReturnType> => {
  const governor = new Contract(
    args.Governor,
    governorArtifact.abi,
    getProvider(),
  ) as Governor

  const contractAddress = await getContract(governor, args.contract)
  return contractAddress
}

const getContract = async (governor: Governor, contract: ProtocolContract, chainID?: ChainID): Promise<string> => {
  switch (contract) {
    case ProtocolContract.TcpGovernorAlpha:
      return await governor.governorAlpha()
    case ProtocolContract.Accounting:
      return await governor.accounting()
    case ProtocolContract.Auctions:
      return await governor.auctions()
    case ProtocolContract.EnforcedDecentralization:
      return await governor.enforcedDecentralization()
    case ProtocolContract.LendHue:
      return await governor.lendHue()
    case ProtocolContract.Liquidations:
      return await governor.liquidations()
    case ProtocolContract.Market:
      return await governor.market()
    case ProtocolContract.Prices:
      return await governor.prices()
    case ProtocolContract.ProtocolDataAggregator:
      return chainID ? await getAddress(chainID, contract as unknown as rootContracts) : ''
    case ProtocolContract.ProtocolLock:
      return await governor.protocolLock()
    case ProtocolContract.Rates:
      return await governor.rates()
    case ProtocolContract.Rewards:
      return await governor.rewards()
    case ProtocolContract.Settlement:
      return await governor.settlement()
    case ProtocolContract.Tcp:
      return await governor.tcp()
    case ProtocolContract.TcpTimelock:
      return await governor.timelock()
    case ProtocolContract.Hue:
      return await governor.hue()
    case ProtocolContract.HuePositionNFT:
      return await governor.huePositionNFT()

    case ProtocolContract.Governor:
      throw new Error('getContract: Handled in executeGetGovernor')
    case ProtocolContract.TcpMulticall:
      throw new Error('getContract: Handled in executeGetMulticall')

    default:
      assertUnreachable(contract)

    throw new Error('getContract: Shouldnt get here')
  }
}
