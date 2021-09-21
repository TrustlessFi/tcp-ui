// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED

import { ContractInterface, Contract } from "ethers"
import { Web3Provider } from '@ethersproject/providers'

import getProvider from './getProvider'
import { ProtocolContract } from '../slices/contracts'

// ==================== Typechain =========================
import {
  Accounting,
  Auctions,
  EnforcedDecentralization,
  Governor,
  TcpGovernorAlpha,
  LendHue,
  Liquidations,
  Market,
  Prices,
  ProtocolLock,
  Tcp,
  Rates,
  Rewards,
  Settlement,
  TcpTimelock,
  Hue,
  HuePositionNFT,
} from "./typechain"

// ================ ARTIFACTS =======================
import accountingArtifact from "./artifacts/contracts/core/storage/Accounting.sol/Accounting.json"
import auctionsArtifact from "./artifacts/contracts/core/logic/Auctions.sol/Auctions.json"
import enforcedDecentralizationArtifact from "./artifacts/contracts/core/governance/EnforcedDecentralization.sol/EnforcedDecentralization.json"
import governorArtifact from "./artifacts/contracts/core/governance/Governor.sol/Governor.json"
import tcpGovernorAlphaArtifact from "./artifacts/contracts/core/governance/TcpGovernorAlpha.sol/TcpGovernorAlpha.json"
import lendHueArtifact from "./artifacts/contracts/core/tokens/LendHue.sol/LendHue.json"
import liquidationsArtifact from "./artifacts/contracts/core/logic/Liquidations.sol/Liquidations.json"
import marketArtifact from "./artifacts/contracts/core/logic/Market.sol/Market.json"
import pricesArtifact from "./artifacts/contracts/core/logic/Prices.sol/Prices.json"
import protocolLockArtifact from "./artifacts/contracts/core/utils/ProtocolLock.sol/ProtocolLock.json"
import ratesArtifact from "./artifacts/contracts/core/logic/Rates.sol/Rates.json"
import rewardsArtifact from "./artifacts/contracts/core/logic/Rewards.sol/Rewards.json"
import settlementArtifact from "./artifacts/contracts/core/logic/Settlement.sol/Settlement.json"
import tcpArtifact from "./artifacts/contracts/core/governance/Tcp.sol/Tcp.json"
import tcpTimelockArtifact from "./artifacts/contracts/core/governance/TcpTimelock.sol/TcpTimelock.json"
import hueArtifact from "./artifacts/contracts/core/tokens/Hue.sol/Hue.json"
import huePositionNFTArtifact from "./artifacts/contracts/core/tokens/HuePositionNFT.sol/HuePositionNFT.json"
import { assertUnreachable } from './index';

const artifactLookup = {
  [ProtocolContract.Accounting]: accountingArtifact,
  [ProtocolContract.Auctions]: auctionsArtifact,
  [ProtocolContract.EnforcedDecentralization]: enforcedDecentralizationArtifact,
  [ProtocolContract.Governor]: governorArtifact,
  [ProtocolContract.TcpGovernorAlpha]: tcpGovernorAlphaArtifact,
  [ProtocolContract.LendHue]: lendHueArtifact,
  [ProtocolContract.Liquidations]: liquidationsArtifact,
  [ProtocolContract.Market]: marketArtifact,
  [ProtocolContract.Prices]: pricesArtifact,
  [ProtocolContract.ProtocolLock]: protocolLockArtifact,
  [ProtocolContract.Rates]: ratesArtifact,
  [ProtocolContract.Rewards]: rewardsArtifact,
  [ProtocolContract.Settlement]: settlementArtifact,
  [ProtocolContract.Tcp]: tcpArtifact,
  [ProtocolContract.TcpTimelock]: tcpTimelockArtifact,
  [ProtocolContract.Hue]: hueArtifact,
  [ProtocolContract.HuePositionNFT]: huePositionNFTArtifact
}

export const contract = <T extends Contract>(address: string, abi: ContractInterface, provider?: Web3Provider): T =>
  new Contract(address, abi, provider === undefined ? getProvider() : provider) as T


const getContract = (address: string, protocolContract: ProtocolContract) => {
  const contract =  new Contract(
    address,
    artifactLookup[protocolContract].abi,
    getProvider()
  )

  switch (protocolContract) {
    case ProtocolContract.Accounting:
      return contract as Accounting
    case ProtocolContract.Auctions:
      return contract as Auctions
    case ProtocolContract.EnforcedDecentralization:
      return contract as EnforcedDecentralization
    case ProtocolContract.Governor:
      return contract as Governor
    case ProtocolContract.Hue:
      return contract as Hue
    case ProtocolContract.HuePositionNFT:
      return contract as HuePositionNFT
    case ProtocolContract.LendHue:
      return contract as LendHue
    case ProtocolContract.Liquidations:
      return contract as Liquidations
    case ProtocolContract.Market:
      return contract as Market
    case ProtocolContract.Prices:
      return contract as Prices
    case ProtocolContract.ProtocolLock:
      return contract as ProtocolLock
    case ProtocolContract.Rates:
      return contract as Rates
    case ProtocolContract.Rewards:
      return contract as Rewards
    case ProtocolContract.Settlement:
      return contract as Settlement
    case ProtocolContract.Tcp:
      return contract as Tcp
    case ProtocolContract.TcpGovernorAlpha:
      return contract as TcpGovernorAlpha
    case ProtocolContract.TcpTimelock:
      return contract as TcpTimelock
    default:
      assertUnreachable(protocolContract)

    throw new Error('getContract: Should never get here')
  }
}

export default getContract
