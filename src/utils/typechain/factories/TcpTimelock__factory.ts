/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TcpTimelock, TcpTimelockInterface } from "../TcpTimelock";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "CancelTransaction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "ExecuteTransaction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "NewAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "newDelay",
        type: "uint256",
      },
    ],
    name: "NewDelay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newPendingAdmin",
        type: "address",
      },
    ],
    name: "NewPendingAdmin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "QueueTransaction",
    type: "event",
  },
  {
    inputs: [],
    name: "GRACE_PERIOD",
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
    inputs: [],
    name: "MAXIMUM_DELAY",
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
    inputs: [],
    name: "MINIMUM_DELAY",
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
    inputs: [],
    name: "admin",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "cancelTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IGovernor",
        name: "governor_",
        type: "address",
      },
      {
        internalType: "address",
        name: "admin_",
        type: "address",
      },
      {
        internalType: "address",
        name: "preLaunchAdmin_",
        type: "address",
      },
    ],
    name: "completeSetup",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentAdmin",
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
  {
    inputs: [],
    name: "delay",
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
        name: "target",
        type: "address",
      },
      {
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "executeTransaction",
    outputs: [
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "governor",
    outputs: [
      {
        internalType: "contract IGovernor",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "preLaunchAdmin",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "string",
        name: "signature",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "eta",
        type: "uint256",
      },
    ],
    name: "queueTransaction",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "queuedTransactions",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "delay_",
        type: "uint256",
      },
    ],
    name: "setDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "action",
        type: "bytes4",
      },
    ],
    name: "validUpdate",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156100115760006000fd5b506040516200229638038062002296833981810160405260408110156100375760006000fd5b8101908080519060200190929190805190602001909291905050505b81815b612a3081101515156100b4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526037815260200180620022276037913960400191505060405180910390fd5b621275008111151515610113576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260388152602001806200225e6038913960400191505060405180910390fd5b81600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060026000508190909055505b50505b505061016b565b6120ac806200017b6000396000f3fe60806040523480156100115760006000fd5b50600436106100f95760003560e01c80636a42b8f811610098578063c1a287e211610067578063c1a287e214610811578063e177246e1461082f578063f2b065371461085e578063f851a440146108a7576100f9565b80636a42b8f8146107835780637d645fab146107a1578063b1b43ae5146107bf578063ba4bcd72146107dd576100f9565b8063113cf1ab116100d4578063113cf1ab1461046157806327e3da43146104c55780633ec5ab321461054a5780635c1813921461074f576100f9565b80624b1f12146100ff5780630c340a241461028a5780630e70eace146102be576100f9565b60006000fd5b610288600480360360808110156101165760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156101545760006000fd5b8201836020820111156101675760006000fd5b8035906020019184600183028401116401000000008311171561018a5760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050909091929090919290803590602001906401000000008111156101f25760006000fd5b8201836020820111156102055760006000fd5b803590602001918460018302840111640100000000831117156102285760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050909091929090919290803590602001909291905050506108db565b005b610292610c01565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610447600480360360808110156102d55760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156103135760006000fd5b8201836020820111156103265760006000fd5b803590602001918460018302840111640100000000831117156103495760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050909091929090919290803590602001906401000000008111156103b15760006000fd5b8201836020820111156103c45760006000fd5b803590602001918460018302840111640100000000831117156103e75760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505090909192909091929080359060200190929190505050610c27565b604051808260001916815260200191505060405180910390f35b6104ad600480360360208110156104785760006000fd5b8101908080357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190929190505050610fd4565b60405180821515815260200191505060405180910390f35b610548600480360360608110156104dc5760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061102a565b005b6106d3600480360360808110156105615760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561059f5760006000fd5b8201836020820111156105b25760006000fd5b803590602001918460018302840111640100000000831117156105d55760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509090919290909192908035906020019064010000000081111561063d5760006000fd5b8201836020820111156106505760006000fd5b803590602001918460018302840111640100000000831117156106735760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509090919290909192908035906020019092919050505061125d565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107145780820151818401525b6020810190506106f8565b50505050905090810190601f1680156107415780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6107576119c3565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61078b6119e9565b6040518082815260200191505060405180910390f35b6107a96119f2565b6040518082815260200191505060405180910390f35b6107c76119f9565b6040518082815260200191505060405180910390f35b6107e56119ff565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610819611b62565b6040518082815260200191505060405180910390f35b61085c600480360360208110156108465760006000fd5b8101908080359060200190929190505050611b69565b005b61088f600480360360208110156108755760006000fd5b810190808035600019169060200190929190505050611d0e565b60405180821515815260200191505060405180910390f35b6108af611d33565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6108e96119ff63ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561096e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526037815260200180611e6f6037913960400191505060405180910390fd5b600084848484604051602001808573ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360005b838110156109de5780820151818401525b6020810190506109c2565b50505050905090810190601f168015610a0b5780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b83811015610a455780820151818401525b602081019050610a29565b50505050905090810190601f168015610a725780820380516001836020036101000a031916815260200191505b509650505050505050604051602081830303815290604052805190602001209050600060046000506000836000191660001916815260200190815260200160002060006101000a81548160ff0219169083151502179055508473ffffffffffffffffffffffffffffffffffffffff1681600019167f39805be0099a319b88cf17675318997e223b45eef7836c0bdfa20b4009e67cc6868686604051808060200180602001848152602001838103835286818151815260200191508051906020019080838360005b83811015610b555780820151818401525b602081019050610b39565b50505050905090810190601f168015610b825780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b83811015610bbc5780820151818401525b602081019050610ba0565b50505050905090810190601f168015610be95780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a3505b50505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000610c376119ff63ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610cbc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526036815260200180611ff86036913960400191505060405180910390fd5b610cde610ccd611d5963ffffffff16565b600260005054611d6663ffffffff16565b8210151515610d38576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252604981526020018061202e6049913960600191505060405180910390fd5b600085858585604051602001808573ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360005b83811015610da85780820151818401525b602081019050610d8c565b50505050905090810190601f168015610dd55780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b83811015610e0f5780820151818401525b602081019050610df3565b50505050905090810190601f168015610e3c5780820380516001836020036101000a031916815260200191505b509650505050505050604051602081830303815290604052805190602001209050600160046000506000836000191660001916815260200190815260200160002060006101000a81548160ff0219169083151502179055508573ffffffffffffffffffffffffffffffffffffffff1681600019167ed038d9209423c0ba06a7d606d7a0eeafe97cb5bdb3a9dd5b35c019b0966a95878787604051808060200180602001848152602001838103835286818151815260200191508051906020019080838360005b83811015610f1e5780820151818401525b602081019050610f02565b50505050905090810190601f168015610f4b5780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b83811015610f855780820151818401525b602081019050610f69565b50505050905090810190601f168015610fb25780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a380915050610fcc56505b949350505050565b600063e177246e60e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050611025565b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156110f2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f7420417574686f72697a656400000000000000000000000000000000000081526020015060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151561112f5760006000fd5b82600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f71614071b88dee5e0b2ae578a9dd7b2ebbe9ae832ba419dc0242cd065a290b6c60405160405180910390a25b505050565b606061126d6119ff63ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156112f2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526038815260200180611e376038913960400191505060405180910390fd5b600085858585604051602001808573ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360005b838110156113625780820151818401525b602081019050611346565b50505050905090810190601f16801561138f5780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b838110156113c95780820151818401525b6020810190506113ad565b50505050905090810190601f1680156113f65780820380516001836020036101000a031916815260200191505b50965050505050505060405160208183030381529060405280519060200120905060046000506000826000191660001916815260200190815260200160002060009054906101000a900460ff16151561149a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603d815260200180611f8a603d913960400191505060405180910390fd5b826114a9611d5963ffffffff16565b10151515611502576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526045815260200180611ed96045913960600191505060405180910390fd5b6115158362093a80611d6663ffffffff16565b611523611d5963ffffffff16565b1115151561157c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526033815260200180611ea66033913960400191505060405180910390fd5b600060046000506000836000191660001916815260200190815260200160002060006101000a81548160ff0219169083151502179055506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166333daf5d48888886040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156116665780820151818401525b60208101905061164a565b50505050905090810190601f1680156116935780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156116cd5780820151818401525b6020810190506116b1565b50505050905090810190601f1680156116fa5780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b15801561171d5760006000fd5b505af1158015611732573d600060003e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250604081101561175d5760006000fd5b8101908080519060200190929190805160405193929190846401000000008211156117885760006000fd5b8382019150602082018581111561179f5760006000fd5b82518660018202830111640100000000821117156117bd5760006000fd5b8083526020830192505050908051906020019080838360005b838110156117f25780820151818401525b6020810190506117d6565b50505050905090810190601f16801561181f5780820380516001836020036101000a031916815260200191505b506040526020015050508094508192505050801515611889576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252603c815260200180611dfb603c913960400191505060405180910390fd5b8673ffffffffffffffffffffffffffffffffffffffff1682600019167f73bcadb73827ad9a900198359278e77086ae03e9e17ef173ad7de9e7e39acaff888888604051808060200180602001848152602001838103835286818151815260200191508051906020019080838360005b838110156119145780820151818401525b6020810190506118f8565b50505050905090810190601f1680156119415780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b8381101561197b5780820151818401525b60208101905061195f565b50505050905090810190601f1680156119a85780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a350505b949350505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026000505481565b6212750081565b612a3081565b6000600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614158015611b0857506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663055ad42e6040518163ffffffff1660e01b815260040160206040518083038186803b158015611ac65760006000fd5b505afa158015611adb573d600060003e3d6000fd5b505050506040513d6020811015611af25760006000fd5b810190808051906020019092919050505060ff16145b611b3457600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611b58565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff165b9050611b5f565b90565b62093a8081565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611c11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526031815260200180611fc76031913960400191505060405180910390fd5b612a308110151515611c6e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526034815260200180611f1e6034913960400191505060405180910390fd5b621275008111151515611ccc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526038815260200180611f526038913960400191505060405180910390fd5b8060026000508190909055506002600050547f948b1f6a42ee138b7e34058ba85a37f716d55ff25ff05a763f15bed6a04c8d2c60405160405180910390a25b50565b600460005060205280600052604060002060009150909054906101000a900460ff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000429050611d63565b90565b600060008284019050838110151515611dea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f6164646974696f6e206f766572666c6f7700000000000000000000000000000081526020015060200191505060405180910390fd5b80915050611df456505b9291505056fe54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a205472616e73616374696f6e20657865637574696f6e20726576657274656454696d656c6f636b3a3a657865637574655472616e73616374696f6e3a2043616c6c206d75737420636f6d652066726f6d2061646d696e2e54696d656c6f636b3a3a63616e63656c5472616e73616374696f6e3a2043616c6c206d75737420636f6d652066726f6d2061646d696e2e54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a205472616e73616374696f6e206973207374616c652e54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a205472616e73616374696f6e206861736e2774207375727061737365642074696d65206c6f636b2e54696d656c6f636b3a3a73657444656c61793a2044656c6179206d75737420657863656564206d696e696d756d2064656c61792e54696d656c6f636b3a3a73657444656c61793a2044656c6179206d757374206e6f7420657863656564206d6178696d756d2064656c61792e54696d656c6f636b3a3a657865637574655472616e73616374696f6e3a205472616e73616374696f6e206861736e2774206265656e207175657565642e54696d656c6f636b3a3a73657444656c61793a2043616c6c206d75737420636f6d652066726f6d20476f7665726e6f722e54696d656c6f636b3a3a71756575655472616e73616374696f6e3a2043616c6c206d75737420636f6d652066726f6d2061646d696e2e54696d656c6f636b3a3a71756575655472616e73616374696f6e3a20457374696d6174656420657865637574696f6e20626c6f636b206d75737420736174697366792064656c61792ea26469706673582212204c2396c889f3461da4d48787f55b6a5dd2fd342a63e92685bde8067b96ef6f5664736f6c6343000706003354696d656c6f636b3a3a636f6e7374727563746f723a2044656c6179206d75737420657863656564206d696e696d756d2064656c61792e54696d656c6f636b3a3a73657444656c61793a2044656c6179206d757374206e6f7420657863656564206d6178696d756d2064656c61792e";

export class TcpTimelock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    admin: string,
    delay: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TcpTimelock> {
    return super.deploy(admin, delay, overrides || {}) as Promise<TcpTimelock>;
  }
  getDeployTransaction(
    admin: string,
    delay: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(admin, delay, overrides || {});
  }
  attach(address: string): TcpTimelock {
    return super.attach(address) as TcpTimelock;
  }
  connect(signer: Signer): TcpTimelock__factory {
    return super.connect(signer) as TcpTimelock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TcpTimelockInterface {
    return new utils.Interface(_abi) as TcpTimelockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TcpTimelock {
    return new Contract(address, _abi, signerOrProvider) as TcpTimelock;
  }
}
