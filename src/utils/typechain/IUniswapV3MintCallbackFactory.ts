/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import { IUniswapV3MintCallback } from "./IUniswapV3MintCallback";

export class IUniswapV3MintCallbackFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUniswapV3MintCallback {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IUniswapV3MintCallback;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount0Owed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1Owed",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "uniswapV3MintCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
