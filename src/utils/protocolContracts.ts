// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED

import { ethers } from "ethers";

import { getAddress, rootContracts } from "./Addresses"
import { ChainID } from '../slices/chainID'
import getProvider from './getProvider'

// ================ CORE CONTRACTS =================
import { Accounting } from "./typechain/Accounting"
import { Auctions } from "./typechain/Auctions"
import { EnforcedDecentralization } from "./typechain/EnforcedDecentralization"
import { Governor } from "./typechain/Governor"
import { TCPGovernorAlpha } from "./typechain/TcpGovernorAlpha"
import { Lend } from "./typechain/Lend"
import { LendZhu } from "./typechain/LendZhu"
import { Liquidations } from "./typechain/Liquidations"
import { Market } from "./typechain/Market"
import { Prices } from "./typechain/Prices"
import { ProtocolLock } from "./typechain/ProtocolLock"
import { Tcp } from "./typechain/Tcp"
import { Rates } from "./typechain/Rates"
import { Rewards } from "./typechain/Rewards"
import { Settlement } from "./typechain/Settlement"
import { TcpTimelock } from "./typechain/TcpTimelock"
import { Zhu } from "./typechain/Zhu"
import { ZhuPositionNFT } from "./typechain/ZhuPositionNft"

// ================ ARTIFACTS =======================
import accountingArtifact from "./artifacts/contracts/core/storage/Accounting.sol/Accounting.json"
import auctionsArtifact from "./artifacts/contracts/core/logic/Auctions.sol/Auctions.json"
import enforcedDecentralizationArtifact from "./artifacts/contracts/core/governance/EnforcedDecentralization.sol/EnforcedDecentralization.json"
import governorArtifact from "./artifacts/contracts/core/governance/Governor.sol/Governor.json"
import tcpGovernorAlphaArtifact from "./artifacts/contracts/core/governance/TCPGovernorAlpha.sol/TCPGovernorAlpha.json"
import lendArtifact from "./artifacts/contracts/core/logic/Lend.sol/Lend.json"
import lendZhuArtifact from "./artifacts/contracts/core/tokens/LendZhu.sol/LendZhu.json"
import liquidationsArtifact from "./artifacts/contracts/core/logic/Liquidations.sol/Liquidations.json"
import marketArtifact from "./artifacts/contracts/core/logic/Market.sol/Market.json"
import pricesArtifact from "./artifacts/contracts/core/logic/Prices.sol/Prices.json"
import protocolLockArtifact from "./artifacts/contracts/core/utils/ProtocolLock.sol/ProtocolLock.json"
import ratesArtifact from "./artifacts/contracts/core/logic/Rates.sol/Rates.json"
import rewardsArtifact from "./artifacts/contracts/core/logic/Rewards.sol/Rewards.json"
import settlementArtifact from "./artifacts/contracts/core/logic/Settlement.sol/Settlement.json"
import tcpArtifact from "./artifacts/contracts/core/governance/Tcp.sol/Tcp.json"
import tcpTimelockArtifact from "./artifacts/contracts/core/governance/TCPTimelock.sol/TcpTimelock.json"
import zhuArtifact from "./artifacts/contracts/core/tokens/Zhu.sol/Zhu.json"
import zhuPositionNFTArtifact from "./artifacts/contracts/core/tokens/ZhuPositionNFT.sol/ZhuPositionNFT.json"

export enum ProtocolContract {
  Accounting = "Accounting",
  Auctions = "Auctions",
  EnforcedDecentralization = "EnforcedDecentralization",
  Governor = "Governor",
  TCPGovernorAlpha = "TCPGovernorAlpha",
  Lend = "Lend",
  LendZhu = "LendZhu",
  Liquidations = "Liquidations",
  Market = "Market",
  ZhuPositionNFT = "ZhuPositionNFT",
  Prices = "Prices",
  ProtocolLock = "ProtocolLock",
  Rates = "Rates",
  Rewards = "Rewards",
  Settlement = "Settlement",
  Tcp = "Tcp",
  TcpTimelock = "TcpTimelock",
  Zhu = "Zhu"
}

const artifactLookup = {
  [ProtocolContract.Accounting]: accountingArtifact,
  [ProtocolContract.Auctions]: auctionsArtifact,
  [ProtocolContract.EnforcedDecentralization]: enforcedDecentralizationArtifact,
  [ProtocolContract.Governor]: governorArtifact,
  [ProtocolContract.TCPGovernorAlpha]: tcpGovernorAlphaArtifact,
  [ProtocolContract.Lend]: lendArtifact,
  [ProtocolContract.LendZhu]: lendZhuArtifact,
  [ProtocolContract.Liquidations]: liquidationsArtifact,
  [ProtocolContract.Market]: marketArtifact,
  [ProtocolContract.Prices]: pricesArtifact,
  [ProtocolContract.ProtocolLock]: protocolLockArtifact,
  [ProtocolContract.Rates]: ratesArtifact,
  [ProtocolContract.Rewards]: rewardsArtifact,
  [ProtocolContract.Settlement]: settlementArtifact,
  [ProtocolContract.Tcp]: tcpArtifact,
  [ProtocolContract.TcpTimelock]: tcpTimelockArtifact,
  [ProtocolContract.Zhu]: zhuArtifact,
  [ProtocolContract.ZhuPositionNFT]: zhuPositionNFTArtifact
};

export type protocolContractsType = {
  [ProtocolContract.Accounting]?: Accounting;
  [ProtocolContract.Auctions]?: Auctions;
  [ProtocolContract.EnforcedDecentralization]?: EnforcedDecentralization;
  [ProtocolContract.Governor]?: Governor;
  [ProtocolContract.TCPGovernorAlpha]?: TCPGovernorAlpha;
  [ProtocolContract.Lend]?: Lend;
  [ProtocolContract.LendZhu]?: LendZhu;
  [ProtocolContract.Liquidations]?: Liquidations;
  [ProtocolContract.Market]?: Market;
  [ProtocolContract.Prices]?: Prices;
  [ProtocolContract.ProtocolLock]?: ProtocolLock;
  [ProtocolContract.Rates]?: Rates;
  [ProtocolContract.Rewards]?: Rewards;
  [ProtocolContract.Settlement]?: Settlement;
  [ProtocolContract.Tcp]?: Tcp;
  [ProtocolContract.TcpTimelock]?: TcpTimelock;
  [ProtocolContract.Zhu]?: Zhu;
  [ProtocolContract.ZhuPositionNFT]?: ZhuPositionNFT;
};

let protocolContracts: protocolContractsType = {};

const getGovernor = async (chainID: ChainID): Promise<Governor | null> => {
  const contract = ProtocolContract.Governor;
  let cachedContract = protocolContracts[contract];

  if (cachedContract !== undefined) {
    return cachedContract;
  } else {
    const provider = getProvider()
    if (provider === null) return null

    let result = new ethers.Contract(
      getAddress(chainID, rootContracts.Governor),
      artifactLookup[contract].abi,
      provider
    ) as unknown as Governor;
    protocolContracts[contract] = result;
    return result;
  }
};

const getTcpGovernorAlpha = async (chainID: ChainID): Promise<TCPGovernorAlpha | null> => {
  const contract = ProtocolContract.TCPGovernorAlpha;
  let cachedContract = protocolContracts[contract];

  if (cachedContract !== undefined) {
    return cachedContract;
  } else {
    const provider = getProvider()
    if (provider === null) return null

    let result = new ethers.Contract(
      getAddress(chainID, rootContracts.TcpGovernorAlpha),
      artifactLookup[contract].abi,
      provider
    ) as unknown as TCPGovernorAlpha;
    protocolContracts[contract] = result;
    return result;
  }
};

const getCachedContractFromGovernor = async (
  chainID: ChainID,
  contract: ProtocolContract,
) => {
  let cachedContract = protocolContracts[contract];

  if (cachedContract !== undefined) {
    return cachedContract;
  } else {
    const governor = await getGovernor(chainID);
    if (governor === null) return null

    const provider = getProvider()
    if (provider === null) return null

    switch (contract) {
      case ProtocolContract.Accounting:
        protocolContracts[contract] = new ethers.Contract(
          await governor.accounting(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Accounting
        break;
      case ProtocolContract.Auctions:
        protocolContracts[contract] = new ethers.Contract(
          await governor.auctions(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Auctions
        break;
      case ProtocolContract.EnforcedDecentralization:
        protocolContracts[contract] = new ethers.Contract(
          await governor.enforcedDecentralization(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as EnforcedDecentralization
        break;
      case ProtocolContract.Lend:
        protocolContracts[contract] = new ethers.Contract(
          await governor.lend(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Lend
        break;
      case ProtocolContract.LendZhu:
        protocolContracts[contract] = new ethers.Contract(
          await governor.lendZhu(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as LendZhu
        break;
      case ProtocolContract.Liquidations:
        protocolContracts[contract] = new ethers.Contract(
          await governor.liquidations(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Liquidations
        break;
      case ProtocolContract.Market:
        protocolContracts[contract] = new ethers.Contract(
          await governor.market(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Market
        break;
      case ProtocolContract.Prices:
        protocolContracts[contract] = new ethers.Contract(
          await governor.prices(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Prices
        break;
      case ProtocolContract.ProtocolLock:
        protocolContracts[contract] = new ethers.Contract(
          await governor.protocolLock(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as ProtocolLock
        break;
      case ProtocolContract.Rates:
        protocolContracts[contract] = new ethers.Contract(
          await governor.rates(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Rates
        break;
      case ProtocolContract.Rewards:
        protocolContracts[contract] = new ethers.Contract(
          await governor.rewards(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Rewards
        break;
      case ProtocolContract.Settlement:
        protocolContracts[contract] = new ethers.Contract(
          await governor.settlement(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Settlement
        break;
      case ProtocolContract.Tcp:
        protocolContracts[contract] = new ethers.Contract(
          await governor.tcp(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Tcp
        break;
      case ProtocolContract.TcpTimelock:
        protocolContracts[contract] = new ethers.Contract(
          await governor.timelock(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as TcpTimelock
        break;
      case ProtocolContract.Zhu:
        protocolContracts[contract] = new ethers.Contract(
          await governor.zhu(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as Zhu;
        break;
      case ProtocolContract.ZhuPositionNFT:
        protocolContracts[contract] = new ethers.Contract(
          await governor.zhuPositionNFT(),
          artifactLookup[contract].abi,
          provider
        ) as unknown as ZhuPositionNFT
        break;
      default:
        throw new Error("Contract not found")
    }

    return protocolContracts[contract]
  }
};

export const getProtocolContract = async (chainID: ChainID, contract: ProtocolContract) => {
  switch (contract) {
    case ProtocolContract.Governor:
      return await getGovernor(chainID)
    case ProtocolContract.TCPGovernorAlpha:
      return await getTcpGovernorAlpha(chainID)
    default:
      return await getCachedContractFromGovernor(chainID, contract)
  }
};
