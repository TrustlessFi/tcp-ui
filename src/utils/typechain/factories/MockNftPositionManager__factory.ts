/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockNftPositionManager,
  MockNftPositionManagerInterface,
} from "../MockNftPositionManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "WETH9",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156100115760006000fd5b50604051610168380380610168833981810160405260208110156100355760006000fd5b81019080805190602001909291905050505b8073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b815260140150505b50610088565b60805160601c60c66100a2600039806068525060c66000f3fe608060405234801560105760006000fd5b5060043610602c5760003560e01c80634aa4a4fc14603257602c565b60006000fd5b60386064565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60007f00000000000000000000000000000000000000000000000000000000000000009050608d565b9056fea2646970667358221220df3063e893646b2cd5c37fef882b1d8b42192a594cb90c112e1c40d33850a3d564736f6c63430007060033";

export class MockNftPositionManager__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _weth: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockNftPositionManager> {
    return super.deploy(
      _weth,
      overrides || {}
    ) as Promise<MockNftPositionManager>;
  }
  getDeployTransaction(
    _weth: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_weth, overrides || {});
  }
  attach(address: string): MockNftPositionManager {
    return super.attach(address) as MockNftPositionManager;
  }
  connect(signer: Signer): MockNftPositionManager__factory {
    return super.connect(signer) as MockNftPositionManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockNftPositionManagerInterface {
    return new utils.Interface(_abi) as MockNftPositionManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockNftPositionManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockNftPositionManager;
  }
}