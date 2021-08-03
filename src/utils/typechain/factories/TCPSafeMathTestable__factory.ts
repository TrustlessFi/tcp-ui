/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TCPSafeMathTestable,
  TCPSafeMathTestableInterface,
} from "../TCPSafeMathTestable";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "_div",
    outputs: [
      {
        internalType: "uint256",
        name: "r",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "_mul",
    outputs: [
      {
        internalType: "uint256",
        name: "r",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "c",
        type: "uint256",
      },
    ],
    name: "_mulDiv",
    outputs: [
      {
        internalType: "uint256",
        name: "r",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156100115760006000fd5b50610017565b610323806100266000396000f3fe60806040523480156100115760006000fd5b50600436106100465760003560e01c806329f5278a1461004c57806340248bc3146100a35780634bad3327146100f057610046565b60006000fd5b61008d600480360360608110156100635760006000fd5b8101908080359060200190929190803590602001909291908035906020019092919050505061013d565b6040518082815260200191505060405180910390f35b6100da600480360360408110156100ba5760006000fd5b810190808035906020019092919080359060200190929190505050610160565b6040518082815260200191505060405180910390f35b610127600480360360408110156101075760006000fd5b810190808035906020019092919080359060200190929190505050610180565b6040518082815260200191505060405180910390f35b60006101548383866101a09092919063ffffffff16565b905080505b9392505050565b600061017582846102a190919063ffffffff16565b905080505b92915050565b600061019582846102c790919063ffffffff16565b905080505b92915050565b60006000600060001985870985870292508281108382030391505060008114156101e3576000841115156101d45760006000fd5b8382049250829250505061029a565b80841115156101f25760006000fd5b600084868809905082811182039150808303925060008586600003169050808604955080840493506001818260000304019050808302841793508350600060028760030218905080870260020381029050805080870260020381029050805080870260020381029050805080870260020381029050805080870260020381029050805080870260020381029050805080850295508550859550505050505061029a5650505050505b9392505050565b60006102bc83670de0b6b3a7640000846101a063ffffffff16565b905080505b92915050565b60006102e28383670de0b6b3a76400006101a063ffffffff16565b905080505b9291505056fea26469706673582212202f052e7c3e16a0abc9cb477a5ecdc91ae16cf6f7ae79f55b82da50d65c26b29864736f6c63430007060033";

export class TCPSafeMathTestable__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TCPSafeMathTestable> {
    return super.deploy(overrides || {}) as Promise<TCPSafeMathTestable>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TCPSafeMathTestable {
    return super.attach(address) as TCPSafeMathTestable;
  }
  connect(signer: Signer): TCPSafeMathTestable__factory {
    return super.connect(signer) as TCPSafeMathTestable__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TCPSafeMathTestableInterface {
    return new utils.Interface(_abi) as TCPSafeMathTestableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TCPSafeMathTestable {
    return new Contract(address, _abi, signerOrProvider) as TCPSafeMathTestable;
  }
}
