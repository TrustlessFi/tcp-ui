import { getAddress, rootContracts } from '../../utils/Addresses';
import { Governor } from "../../utils/typechain"
import { getContractArgs, ProtocolContract, getContractReturnType, getGovernorContractArgs } from './'

import getProvider from '../../utils/getProvider'
import { assertUnreachable } from '../../utils'
import { Contract } from 'ethers'

import governorArtifact from '../../utils/artifacts/contracts/core/governance/Governor.sol/Governor.json'

export const executeGetGovernor = async (args: getGovernorContractArgs) => getAddress(args.chainID, rootContracts.Governor)

export const executeGetContract = async (args: getContractArgs): Promise<getContractReturnType> => {
  const governor = new Contract(
    args.Governor,
    governorArtifact.abi,
    getProvider(),
  ) as Governor

  const contractAddress = await getContract(governor, args.contract)
  return contractAddress
}

const getContract = async (governor: Governor, contract: ProtocolContract): Promise<string> => {
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
    default:
      assertUnreachable(contract)

    throw new Error('getContract: Shouldnt get here')
  }
}
