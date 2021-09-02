/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TCPSafeMath, TCPSafeMathInterface } from "../TCPSafeMath";

const _abi = [
  {
    inputs: [],
    name: "ONE",
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
];

const _bytecode =
  "0x609a610027600b82828239805160001a6073141515601957fe5b30600052607381538281f350fe730000000000000000000000000000000000000000301460806040526004361060365760003560e01c8063c2ee3a0814603c576036565b60006000fd5b60426058565b6040518082815260200191505060405180910390f35b670de0b6b3a76400008156fea2646970667358221220eafb41c3aa8909d69bafa83935012f4270a16c3ebe3b2eec0f8e9519125115a264736f6c63430007060033";

export class TCPSafeMath__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TCPSafeMath> {
    return super.deploy(overrides || {}) as Promise<TCPSafeMath>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TCPSafeMath {
    return super.attach(address) as TCPSafeMath;
  }
  connect(signer: Signer): TCPSafeMath__factory {
    return super.connect(signer) as TCPSafeMath__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TCPSafeMathInterface {
    return new utils.Interface(_abi) as TCPSafeMathInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TCPSafeMath {
    return new Contract(address, _abi, signerOrProvider) as TCPSafeMath;
  }
}
