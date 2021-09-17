import { getAddress, rootContracts } from '../../utils/Addresses';
import getProvider from '../../utils/getProvider'
import { Governor, TCPGovernorAlpha } from "../../utils/typechain"
import ethers from 'ethers'
import { getGovernorContractArgs, getContractArgs, ProtocolContract, getContractReturnType } from './'

import tcpGovernorAlphaArtifact from '../../utils/artifacts/contracts/core/governance/TCPGovernorAlpha.sol/TCPGovernorAlpha.json'
import governorArtifact from '../../utils/artifacts/contracts/core/governance/Governor.sol/Governor.json'

export const executeGetGovernorAlpha = async () => ({
  address: getAddress(rootContracts.TcpGovernorAlpha),
  contract: ProtocolContract.TCPGovernorAlpha,
})

export const executeGetGovernor = async (args: getGovernorContractArgs): Promise<getContractReturnType> => {
  const governorAlpha = new ethers.Contract(
    args.governorAlpha,
    tcpGovernorAlphaArtifact.abi,
    getProvider()!
  ) as TCPGovernorAlpha

  return { address: await governorAlpha.governor(), contract: ProtocolContract.TCPGovernorAlpha }
}

export const executeGetContract = async (args: getContractArgs): Promise<getContractReturnType> => {
  const governor = new ethers.Contract(
    args.governor,
    governorArtifact.abi,
    getProvider()!
  ) as Governor

  return {
    contract: args.contract,
    address: await getContract(governor, args.contract),
  }
}

const getContract = async (governor: Governor, contract: ProtocolContract): Promise<string> => {
  switch (contract) {
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
    default:
      throw 'unknown contract ' + contract
  }
}
