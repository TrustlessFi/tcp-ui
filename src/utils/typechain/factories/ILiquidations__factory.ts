/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ILiquidations, ILiquidationsInterface } from "../ILiquidations";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountCovered",
        type: "uint256",
      },
    ],
    name: "CoveredUnbackedDebt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "incentive",
        type: "uint64",
      },
    ],
    name: "DiscoveryIncentiveUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "baseTokensToRepay",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralToReceive",
        type: "uint256",
      },
    ],
    name: "Liquidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "incentive",
        type: "uint64",
      },
    ],
    name: "LiquidationIncentiveUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "ratio",
        type: "uint64",
      },
    ],
    name: "MaxRewardsRatioUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "incentive",
        type: "uint64",
      },
    ],
    name: "MinLiquidationIncentiveUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "positionID",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "debtCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "UndercollatPositionDiscovered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "duration",
        type: "uint32",
      },
    ],
    name: "twapDurationUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "stop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ILiquidations__factory {
  static readonly abi = _abi;
  static createInterface(): ILiquidationsInterface {
    return new utils.Interface(_abi) as ILiquidationsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ILiquidations {
    return new Contract(address, _abi, signerOrProvider) as ILiquidations;
  }
}
