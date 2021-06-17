/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { MockErc20 } from "./MockErc20";

export class MockErc20Factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    initialHolder: string,
    initialTokens: BigNumberish,
    _name: string,
    _symbol: string,
    decimals: BigNumberish,
    overrides?: Overrides
  ): Promise<MockErc20> {
    return super.deploy(
      initialHolder,
      initialTokens,
      _name,
      _symbol,
      decimals,
      overrides || {}
    ) as Promise<MockErc20>;
  }
  getDeployTransaction(
    initialHolder: string,
    initialTokens: BigNumberish,
    _name: string,
    _symbol: string,
    decimals: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      initialHolder,
      initialTokens,
      _name,
      _symbol,
      decimals,
      overrides || {}
    );
  }
  attach(address: string): MockErc20 {
    return super.attach(address) as MockErc20;
  }
  connect(signer: Signer): MockErc20Factory {
    return super.connect(signer) as MockErc20Factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockErc20 {
    return new Contract(address, _abi, signerOrProvider) as MockErc20;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialHolder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "initialTokens",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
  {
    inputs: [],
    name: "symbol",
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
  {
    inputs: [],
    name: "totalSupply",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052348015620000125760006000fd5b506040516200181438038062001814833981810160405260a0811015620000395760006000fd5b810190808051906020019092919080519060200190929190805160405193929190846401000000008211156200006f5760006000fd5b83820191506020820185811115620000875760006000fd5b8251866001820283011164010000000082111715620000a65760006000fd5b8083526020830192505050908051906020019080838360005b83811015620000dd5780820151818401525b602081019050620000bf565b50505050905090810190601f1680156200010b5780820380516001836020036101000a031916815260200191505b5060405260200180516040519392919084640100000000821115620001305760006000fd5b83820191506020820185811115620001485760006000fd5b8251866001820283011164010000000082111715620001675760006000fd5b8083526020830192505050908051906020019080838360005b838110156200019e5780820151818401525b60208101905062000180565b50505050905090810190601f168015620001cc5780820380516001836020036101000a031916815260200191505b50604052602001805190602001909291905050505b82825b8160036000509080519060200190620001ff92919062000521565b5080600460005090805190602001906200021b92919062000521565b506012600560006101000a81548160ff021916908360ff1602179055505b50506200024c816200026a60201b60201c565b6200025e85856200028960201b60201c565b5b5050505050620005e3565b80600560006101000a81548160ff021916908360ff1602179055505b50565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151562000332576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f45524332303a206d696e7420746f20746865207a65726f20616464726573730081526020015060200191505060405180910390fd5b62000346600083836200048560201b60201c565b62000365816002600050546200048b60201b62000a8e1790919060201c565b6002600050819090905550620003cf81600060005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050546200048b60201b62000a8e1790919060201c565b600060005060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508190909055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35b5050565b5b505050565b60006000828401905083811015151562000510576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081526020015060200191505060405180910390fd5b809150506200051b56505b92915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282620005595760008555620005aa565b82601f106200057457805160ff1916838001178555620005aa565b82800160010185558215620005aa579182015b82811115620005a9578251826000509090559160200191906001019062000587565b5b509050620005b99190620005bd565b5090565b620005c3565b80821115620005df5760008181506000905550600101620005c3565b5090565b61122180620005f36000396000f3fe60806040523480156100115760006000fd5b50600436106100ce5760003560e01c80633950935111610082578063a457c2d71161005c578063a457c2d7146103c3578063a9059cbb14610428578063dd62ed3e1461048d576100ce565b8063395093511461028157806370a08231146102e657806395d89b411461033f576100ce565b806318160ddd116100b357806318160ddd146101bd57806323b872dd146101db578063313ce56714610260576100ce565b806306fdde03146100d4578063095ea7b314610158576100ce565b60006000fd5b6100dc610506565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561011d5780820151818401525b602081019050610101565b50505050905090810190601f16801561014a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101a56004803603604081101561016f5760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506105b0565b60405180821515815260200191505060405180910390f35b6101c56105df565b6040518082815260200191505060405180910390f35b610248600480360360608110156101f25760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506105f1565b60405180821515815260200191505060405180910390f35b6102686106f0565b604051808260ff16815260200191505060405180910390f35b6102ce600480360360408110156102985760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061070c565b60405180821515815260200191505060405180910390f35b610329600480360360208110156102fd5760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506107df565b6040518082815260200191505060405180910390f35b610347610833565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103885780820151818401525b60208101905061036c565b50505050905090810190601f1680156103b55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610410600480360360408110156103da5760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506108dd565b60405180821515815260200191505060405180910390f35b6104756004803603604081101561043f5760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506109ca565b60405180821515815260200191505060405180910390f35b6104f0600480360360408110156104a45760006000fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109f9565b6040518082815260200191505060405180910390f35b606060036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105a15780601f10610576576101008083540402835291602001916105a1565b820191906000526020600020905b81548152906001019060200180831161058457829003601f168201915b505050505090506105ad565b90565b60006105d06105c3610b2263ffffffff16565b8484610b2f63ffffffff16565b600190506105d9565b92915050565b600060026000505490506105ee565b90565b6000610604848484610d3663ffffffff16565b6106e084610616610b2263ffffffff16565b6106d58560405180606001604052806028815260200161115660289139600160005060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000610688610b2263ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050546110229092919063ffffffff16565b610b2f63ffffffff16565b600190506106e9565b9392505050565b6000600560009054906101000a900460ff169050610709565b90565b60006107d061071f610b2263ffffffff16565b846107c58560016000506000610739610b2263ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054610a8e90919063ffffffff16565b610b2f63ffffffff16565b600190506107d9565b92915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905061082e565b919050565b606060046000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108ce5780601f106108a3576101008083540402835291602001916108ce565b820191906000526020600020905b8154815290600101906020018083116108b157829003601f168201915b505050505090506108da565b90565b60006109bb6108f0610b2263ffffffff16565b846109b0856040518060600160405280602581526020016111c76025913960016000506000610923610b2263ffffffff16565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050546110229092919063ffffffff16565b610b2f63ffffffff16565b600190506109c4565b92915050565b60006109ea6109dd610b2263ffffffff16565b8484610d3663ffffffff16565b600190506109f3565b92915050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610a88565b92915050565b600060008284019050838110151515610b12576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081526020015060200191505060405180910390fd5b80915050610b1c56505b92915050565b6000339050610b2c565b90565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610bb7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806111a36024913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614151515610c3f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602281526020018061110e6022913960400191505060405180910390fd5b80600160005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508190909055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040518082815260200191505060405180910390a35b505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610dbe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061117e6025913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614151515610e46576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260238152602001806110eb6023913960400191505060405180910390fd5b610e578383836110e463ffffffff16565b610ec98160405180606001604052806026815260200161113060269139600060005060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050546110229092919063ffffffff16565b600060005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819090905550610f6c81600060005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054610a8e90919063ffffffff16565b600060005060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508190909055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35b505050565b600083831115829015156110d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b838110156110975780820151818401525b60208101905061107b565b50505050905090810190601f1680156110c45780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5082840390506110dd565b9392505050565b5b50505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220f33908612c8645367913b1d871ec4465267a1aeae750bbaddf1b116f44c033a764736f6c63430007060033";
