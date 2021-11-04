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
  TrustlessMulticall,
  TrustlessMulticallViewOnly,
  Prices,
  ProtocolDataAggregator,
  ProtocolLock,
  Tcp,
  Rates,
  Rewards,
  Settlement,
  TcpTimelock,
  Hue,
  HuePositionNFT,
} from "@trustlessfi/typechain"

// ================ ARTIFACTS =======================
import accountingArtifact from "@trustlessfi/artifacts/dist/contracts/core/storage/Accounting.sol/Accounting.json"
import auctionsArtifact from "@trustlessfi/artifacts/dist/contracts/core/logic/Auctions.sol/Auctions.json"
import enforcedDecentralizationArtifact from "@trustlessfi/artifacts/dist/contracts/core/governance/EnforcedDecentralization.sol/EnforcedDecentralization.json"
import governorArtifact from "@trustlessfi/artifacts/dist/contracts/core/governance/Governor.sol/Governor.json"
import hueArtifact from "@trustlessfi/artifacts/dist/contracts/core/tokens/Hue.sol/Hue.json"
import huePositionNFTArtifact from "@trustlessfi/artifacts/dist/contracts/core/tokens/HuePositionNFT.sol/HuePositionNFT.json"
import lendHueArtifact from "@trustlessfi/artifacts/dist/contracts/core/tokens/LendHue.sol/LendHue.json"
import liquidationsArtifact from "@trustlessfi/artifacts/dist/contracts/core/logic/Liquidations.sol/Liquidations.json"
import marketArtifact from "@trustlessfi/artifacts/dist/contracts/core/logic/Market.sol/Market.json"
import pricesArtifact from "@trustlessfi/artifacts/dist/contracts/core/logic/Prices.sol/Prices.json"
import protocolDataAggregatorArtifact from "@trustlessfi/artifacts/dist/contracts/core/auxiliary/ProtocolDataAggregator.sol/ProtocolDataAggregator.json"
import protocolLockArtifact from "@trustlessfi/artifacts/dist/contracts/core/utils/ProtocolLock.sol/ProtocolLock.json"
import ratesArtifact from "@trustlessfi/artifacts/dist/contracts/core/logic/Rates.sol/Rates.json"
import rewardsArtifact from "@trustlessfi/artifacts/dist/contracts/core/logic/Rewards.sol/Rewards.json"
import settlementArtifact from "@trustlessfi/artifacts/dist/contracts/core/logic/Settlement.sol/Settlement.json"
import tcpArtifact from "@trustlessfi/artifacts/dist/contracts/core/governance/Tcp.sol/Tcp.json"
import tcpGovernorAlphaArtifact from "@trustlessfi/artifacts/dist/contracts/core/governance/TcpGovernorAlpha.sol/TcpGovernorAlpha.json"
import trustlessMulticallArtifact from "@trustlessfi/artifacts/dist/contracts/core/auxiliary/TrustlessMulticall.sol/TrustlessMulticall.json"
import trustlessMulticallViewOnlyArtifact from "@trustlessfi/artifacts/dist/contracts/core/auxiliary/TrustlessMulticallViewOnly.sol/TrustlessMulticallViewOnly.json"
import tcpTimelockArtifact from "@trustlessfi/artifacts/dist/contracts/core/governance/TcpTimelock.sol/TcpTimelock.json"
import { assertUnreachable } from '@trustlessfi/utils'

type abi = {[key in string]: any}[]
type contractAbi = { abi: abi }

const artifactLookup: {[key in ProtocolContract]: contractAbi} = {
  [ProtocolContract.Accounting]: accountingArtifact,
  [ProtocolContract.Auctions]: auctionsArtifact,
  [ProtocolContract.EnforcedDecentralization]: enforcedDecentralizationArtifact,
  [ProtocolContract.Governor]: governorArtifact,
  [ProtocolContract.Hue]: hueArtifact,
  [ProtocolContract.HuePositionNFT]: huePositionNFTArtifact,
  [ProtocolContract.LendHue]: lendHueArtifact,
  [ProtocolContract.Liquidations]: liquidationsArtifact,
  [ProtocolContract.Market]: marketArtifact,
  [ProtocolContract.TrustlessMulticall]: trustlessMulticallArtifact,
  [ProtocolContract.Prices]: pricesArtifact,
  [ProtocolContract.ProtocolDataAggregator]: protocolDataAggregatorArtifact,
  [ProtocolContract.ProtocolLock]: protocolLockArtifact,
  [ProtocolContract.Rates]: ratesArtifact,
  [ProtocolContract.Rewards]: rewardsArtifact,
  [ProtocolContract.Settlement]: settlementArtifact,
  [ProtocolContract.Tcp]: tcpArtifact,
  [ProtocolContract.TcpGovernorAlpha]: tcpGovernorAlphaArtifact,
  [ProtocolContract.TcpTimelock]: tcpTimelockArtifact,
}

export const contract = <T extends Contract>(address: string, abi: ContractInterface, provider?: Web3Provider): T =>
  new Contract(address, abi, provider === undefined ? getProvider() : provider) as T

export const getMulticallContract = (address: string) =>
  getContract(address, ProtocolContract.TrustlessMulticall, true) as unknown as TrustlessMulticallViewOnly

const getContract = (address: string, protocolContract: ProtocolContract, multicallViewOnly = false) => {
  const getAbi = (): abi => {
    if (protocolContract === ProtocolContract.TrustlessMulticall) {
      return multicallViewOnly ? trustlessMulticallViewOnlyArtifact.abi : trustlessMulticallArtifact.abi
    } else {
      return artifactLookup[protocolContract].abi
    }
  }

  const contract = new Contract(address, getAbi(), getProvider())

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
    case ProtocolContract.TrustlessMulticall:
      return contract as TrustlessMulticall
    case ProtocolContract.Prices:
      return contract as Prices
    case ProtocolContract.ProtocolDataAggregator:
      return contract as ProtocolDataAggregator
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
