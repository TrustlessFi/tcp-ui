/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { TimeTestable } from "./TimeTestable";

export class TimeTestableFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    periodLength: BigNumberish,
    overrides?: Overrides
  ): Promise<TimeTestable> {
    return super.deploy(periodLength, overrides || {}) as Promise<TimeTestable>;
  }
  getDeployTransaction(
    periodLength: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(periodLength, overrides || {});
  }
  attach(address: string): TimeTestable {
    return super.attach(address) as TimeTestable;
  }
  connect(signer: Signer): TimeTestableFactory {
    return super.connect(signer) as TimeTestableFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TimeTestable {
    return new Contract(address, _abi, signerOrProvider) as TimeTestable;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "periodLength",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "currentPeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "period",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentTime",
    outputs: [
      {
        internalType: "uint64",
        name: "time",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstPeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "addition",
        type: "uint64",
      },
    ],
    name: "futureTime",
    outputs: [
      {
        internalType: "uint64",
        name: "time",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPeriodLength",
    outputs: [
      {
        internalType: "uint64",
        name: "length",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "periodLength",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "period",
        type: "uint64",
      },
    ],
    name: "periodToTime",
    outputs: [
      {
        internalType: "uint64",
        name: "time",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "time",
        type: "uint64",
      },
    ],
    name: "timeToPeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "period",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60c06040523480156100115760006000fd5b506040516109bf3803806109bf833981810160405260208110156100355760006000fd5b81019080805190602001909291905050505b805b60018167ffffffffffffffff166100646100c560201b60201c565b67ffffffffffffffff1681151561007757fe5b040367ffffffffffffffff1660a08167ffffffffffffffff1660c01b815260080150508067ffffffffffffffff1660808167ffffffffffffffff1660c01b815260080150505b505b50610176565b60006100dc426100e460201b61035417909060201c565b905080505b90565b60006801000000000000000082101515610169576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f6d6f7265207468616e203634206269747300000000000000000000000000000081526020015060200191505060405180910390fd5b819050610171565b919050565b60805160c01c60a05160c01c6107fd6101c2600039806102db52806103ea52806104a0528061053c5250806102975280610317528061040b52806104d9528061055d52506107fd6000f3fe60806040523480156100115760006000fd5b506004361061008d5760003560e01c8063c4e3a63b1161005c578063c4e3a63b14610191578063d18e81b3146101b9578063d2ca2115146101e1578063dccee221146102095761008d565b806306040618146100935780631ef293eb146100bb5780638469ddc714610112578063955e232e1461013a5761008d565b60006000fd5b61009b610260565b604051808267ffffffffffffffff16815260200191505060405180910390f35b6100f2600480360360208110156100d25760006000fd5b81019080803567ffffffffffffffff169060200190929190505050610278565b604051808267ffffffffffffffff16815260200191505060405180910390f35b61011a610293565b604051808267ffffffffffffffff16815260200191505060405180910390f35b610171600480360360208110156101515760006000fd5b81019080803567ffffffffffffffff1690602001909291905050506102be565b604051808267ffffffffffffffff16815260200191505060405180910390f35b6101996102d9565b604051808267ffffffffffffffff16815260200191505060405180910390f35b6101c16102fd565b604051808267ffffffffffffffff16815260200191505060405180910390f35b6101e9610315565b604051808267ffffffffffffffff16815260200191505060405180910390f35b610240600480360360208110156102205760006000fd5b81019080803567ffffffffffffffff169060200190929190505050610339565b604051808267ffffffffffffffff16815260200191505060405180910390f35b60006102706103e663ffffffff16565b905080505b90565b60006102898261045f63ffffffff16565b905080505b919050565b60007f0000000000000000000000000000000000000000000000000000000000000000905080505b90565b60006102cf8261049563ffffffff16565b905080505b919050565b7f000000000000000000000000000000000000000000000000000000000000000081565b600061030d61051a63ffffffff16565b905080505b90565b7f000000000000000000000000000000000000000000000000000000000000000081565b600061034a8261053563ffffffff16565b905080505b919050565b600068010000000000000000821015156103d9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f6d6f7265207468616e203634206269747300000000000000000000000000000081526020015060200191505060405180910390fd5b8190506103e1565b919050565b60007f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000067ffffffffffffffff1661044261051a63ffffffff16565b67ffffffffffffffff1681151561045557fe5b0403905080505b90565b600061048b8261047361051a63ffffffff16565b67ffffffffffffffff166105bd90919063ffffffff16565b905080505b919050565b60006105106104d7837f000000000000000000000000000000000000000000000000000000000000000067ffffffffffffffff166105bd90919063ffffffff16565b7f000000000000000000000000000000000000000000000000000000000000000067ffffffffffffffff1661065a90919063ffffffff16565b905080505b919050565b600061052d42610354909063ffffffff16565b905080505b90565b60006105b37f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000067ffffffffffffffff168467ffffffffffffffff1681151561059a57fe5b0467ffffffffffffffff1661072a90919063ffffffff16565b905080505b919050565b60008267ffffffffffffffff1682840191508167ffffffffffffffff1610151515610653576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f6164642d6f766572666c6f77000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050565b600060008267ffffffffffffffff1614806106ac57508267ffffffffffffffff168267ffffffffffffffff1683850292508267ffffffffffffffff1681151561069f57fe5b0467ffffffffffffffff16145b1515610723576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f6d756c2d6f766572666c6f77000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050565b60008267ffffffffffffffff1682840391508167ffffffffffffffff16111515156107c0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f7375622d756e646572666c6f770000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b9291505056fea2646970667358221220212dd70873d422e8ade67cc6a88b40a334c06cb2a3361e392bc4bce0e6acb34b64736f6c63430007060033";
