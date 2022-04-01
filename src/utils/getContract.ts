// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED

import { ContractInterface, Contract } from "ethers"
import { Web3Provider } from '@ethersproject/providers'

import getProvider from './getProvider'
import { zeroAddress } from '../utils/'
import ProtocolContract, { RootContract, TDaoContract, TDaoRootContract } from '../slices/contracts/ProtocolContract'

// ==================== Typechain =========================
import { TrustlessMulticallViewOnly } from "@trustlessfi/typechain"

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
import trustlessMulticallArtifact from "@trustlessfi/artifacts/dist/contracts/core/auxiliary/multicall/TrustlessMulticall.sol/TrustlessMulticall.json"
import trustlessMulticallViewOnlyArtifact from "@trustlessfi/artifacts/dist/contracts/core/auxiliary/multicall/TrustlessMulticallViewOnly.sol/TrustlessMulticallViewOnly.json"
import truEthArtifact from "@trustlessfi/artifacts/dist/contracts/core/tokens/TruEth.sol/TruEth.json"
import tcpTimelockArtifact from "@trustlessfi/artifacts/dist/contracts/core/governance/TcpTimelock.sol/TcpTimelock.json"
import tcpAllocationArtifact from '@trustlessfi/artifacts/dist/contracts/core/auxiliary/allocations/TcpAllocation.sol/TcpAllocation.json'

import tDaoArtifact from '@trustlessfi/artifacts/dist/contracts/core/TDao/TDao.sol/TDao.json'

import tDaoTokenArtifact from '@trustlessfi/artifacts/dist/contracts/core/TDao/TDaoToken.sol/TDaoToken.json'
import tDaoPositionNFTArtifact from '@trustlessfi/artifacts/dist/contracts/core/TDao/TDaoPositionNFT.sol/TDaoPositionNFT.json'
// import tDaoPositionNFTDescriptorArtifact from '@trustlessfi/artifacts/dist/contracts/core/TDao/TDaoPositionNFTDescriptor.sol/TDaoPositionNFTDescriptor.json'
import tDaoGovernorAlphaArtifact from '@trustlessfi/artifacts/dist/contracts/core/TDao/TDaoGovernorAlpha.sol/TDaoGovernorAlpha.json'
import tDaoTimelockArtifact from '@trustlessfi/artifacts/dist/contracts/core/TDao/TDaoTimelock.sol/TDaoTimelock.json'
import tDaoVotingRewardsSafeArtifact from '@trustlessfi/artifacts/dist/contracts/core/TDao/TDaoTimelock.sol/TDaoTimelock.json'

type abi = {[key in string]: any}[]
type contractAbi = { abi: abi }
type TrustlessContract = ProtocolContract | RootContract | TDaoContract | TDaoRootContract

const artifactLookup = (): {[key in TrustlessContract]: contractAbi} => ({
  [ProtocolContract.Accounting]: accountingArtifact,
  [ProtocolContract.Auctions]: auctionsArtifact,
  [ProtocolContract.EnforcedDecentralization]: enforcedDecentralizationArtifact,
  [ProtocolContract.Hue]: hueArtifact,
  [ProtocolContract.HuePositionNFT]: huePositionNFTArtifact,
  [ProtocolContract.LendHue]: lendHueArtifact,
  [ProtocolContract.Liquidations]: liquidationsArtifact,
  [ProtocolContract.Market]: marketArtifact,
  [ProtocolContract.Prices]: pricesArtifact,
  [ProtocolContract.ProtocolLock]: protocolLockArtifact,
  [ProtocolContract.Rates]: ratesArtifact,
  [ProtocolContract.Rewards]: rewardsArtifact,
  [ProtocolContract.Settlement]: settlementArtifact,
  [ProtocolContract.Tcp]: tcpArtifact,
  [ProtocolContract.TcpGovernorAlpha]: tcpGovernorAlphaArtifact,
  [ProtocolContract.TcpTimelock]: tcpTimelockArtifact,
  [ProtocolContract.TcpAllocation]: tcpAllocationArtifact,

  [ProtocolContract.TruEth]: truEthArtifact,

  [RootContract.Governor]: governorArtifact,
  [RootContract.ProtocolDataAggregator]: protocolDataAggregatorArtifact,

  [RootContract.TrustlessMulticall]: trustlessMulticallArtifact,

  [TDaoRootContract.TDao]: tDaoArtifact,

  [TDaoContract.TDaoToken]: tDaoTokenArtifact,
  [TDaoContract.TDaoPositionNFT]: tDaoPositionNFTArtifact,
  [TDaoContract.TDaoGovernorAlpha]: tDaoGovernorAlphaArtifact,
  [TDaoContract.TDaoTimelock]: tDaoTimelockArtifact,
  [TDaoContract.TDaoVotingRewardsSafe]: tDaoVotingRewardsSafeArtifact,
})

export const contract = <T>(args: {
  address?: string,
  contract?: TrustlessContract,
  abi?: ContractInterface,
  provider?: Web3Provider
  multicallViewOnly?: boolean
}): T => {
  if (args.abi === undefined && args.contract === undefined) {
    throw new Error('Abi not provided.')
  }

  const abi =
    args.abi === undefined
    ? (
        args.contract! === RootContract.TrustlessMulticall
        ? (
            args.multicallViewOnly === true
            ? trustlessMulticallViewOnlyArtifact.abi
            : trustlessMulticallArtifact.abi
          )
        : artifactLookup()[args.contract!].abi
      )
    : args.abi

  return new Contract(
    args.address === undefined ? zeroAddress : args.address,
    abi,
    args.provider === undefined ? getProvider() : args.provider) as unknown as T
}

export const getContract = <T>(theContract: TrustlessContract, address = zeroAddress) =>
  contract<T>({contract: theContract, address})

export const getMulticallContract = (address: string) =>
  contract<TrustlessMulticallViewOnly>({
    address,
    contract: RootContract.TrustlessMulticall,
    multicallViewOnly: true
  })

export default getContract
