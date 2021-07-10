/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ITFDao, ITFDaoInterface } from "../ItfDao";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "IncentiveMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "currentPeriod",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "periods",
        type: "uint64",
      },
    ],
    name: "InflationAccrued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_contract",
        type: "address",
      },
    ],
    name: "LiquidationIncentiveContractSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "governorAlpha",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "decision",
        type: "bool",
      },
    ],
    name: "MetaGovernanceDecisionExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "positionNFTTokenID",
        type: "uint64",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "RewardsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "TFDaoStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "TokenAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint16",
        name: "tokenID",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "lockDurationMonths",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "TokensLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint16",
        name: "tokenID",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "TokensUnlocked",
    type: "event",
  },
  {
    inputs: [],
    name: "availableSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dest",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "incentiveContractMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract GovernorAlpha",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "voteInUnderlyingProtocol",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

export class ITFDao__factory {
  static readonly abi = _abi;
  static createInterface(): ITFDaoInterface {
    return new utils.Interface(_abi) as ITFDaoInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ITFDao {
    return new Contract(address, _abi, signerOrProvider) as ITFDao;
  }
}
