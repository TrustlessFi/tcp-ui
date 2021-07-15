/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC20Decimals, ERC20DecimalsInterface } from "../Erc20Decimals";

const _abi = [
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ERC20Decimals__factory {
  static readonly abi = _abi;
  static createInterface(): ERC20DecimalsInterface {
    return new utils.Interface(_abi) as ERC20DecimalsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20Decimals {
    return new Contract(address, _abi, signerOrProvider) as ERC20Decimals;
  }
}
