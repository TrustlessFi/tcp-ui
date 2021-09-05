/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockTokenDescriptor,
  MockTokenDescriptorInterface,
} from "../MockTokenDescriptor";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "positionID",
        type: "uint64",
      },
    ],
    name: "getTokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156100115760006000fd5b50610017565b610195806100266000396000f3fe60806040523480156100115760006000fd5b50600436106100305760003560e01c80632bf2bc8f1461003657610030565b60006000fd5b610050600480360381019061004b91906100b1565b610066565b60405161005d91906100e6565b60405180910390f35b60606040518060400160405280600881526020017f746573742075726900000000000000000000000000000000000000000000000081526020015090506100a8565b9190505661015e565b6000602082840312156100c2578081fd5b813567ffffffffffffffff8116811415156100db578182fd5b809150505b92915050565b6000602080835283518082850152825b8181101561011657828187010151604082870101525b82810190506100f6565b818111156101275783604083870101525b5060407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116850101925050505b92915050565bfea264697066735822122008c9b73ca6a550424eb15435b32918af3219b3c32a75e1f837bd77e17d40c6f064736f6c63430007060033";

export class MockTokenDescriptor__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockTokenDescriptor> {
    return super.deploy(overrides || {}) as Promise<MockTokenDescriptor>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockTokenDescriptor {
    return super.attach(address) as MockTokenDescriptor;
  }
  connect(signer: Signer): MockTokenDescriptor__factory {
    return super.connect(signer) as MockTokenDescriptor__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockTokenDescriptorInterface {
    return new utils.Interface(_abi) as MockTokenDescriptorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockTokenDescriptor {
    return new Contract(address, _abi, signerOrProvider) as MockTokenDescriptor;
  }
}