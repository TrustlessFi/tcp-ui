/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import { PathTest } from "./PathTest";

export class PathTestFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<PathTest> {
    return super.deploy(overrides || {}) as Promise<PathTest>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PathTest {
    return super.attach(address) as PathTest;
  }
  connect(signer: Signer): PathTestFactory {
    return super.connect(signer) as PathTestFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PathTest {
    return new Contract(address, _abi, signerOrProvider) as PathTest;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
    ],
    name: "decodeFirstPool",
    outputs: [
      {
        internalType: "address",
        name: "tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenB",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "fee",
        type: "uint24",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
    ],
    name: "getFirstPool",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
    ],
    name: "getGasCostOfDecodeFirstPool",
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
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
    ],
    name: "hasMultiplePools",
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
  {
    inputs: [
      {
        internalType: "bytes",
        name: "path",
        type: "bytes",
      },
    ],
    name: "skipToken",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156100115760006000fd5b50610017565b610ba5806100266000396000f3fe60806040523480156100115760006000fd5b506004361061006c5760003560e01c8063bf8b627b11610051578063bf8b627b14610288578063d7c9ca0c146103c5578063eadc682a1461049c5761006c565b80637db6e246146100725780639dc1c391146101af5761006c565b60006000fd5b610133600480360360208110156100895760006000fd5b81019080803590602001906401000000008111156100a75760006000fd5b8201836020820111156100ba5760006000fd5b803590602001918460018302840111640100000000831117156100dd5760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509090919290909192905050506105b2565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101745780820151818401525b602081019050610158565b50505050905090810190601f1680156101a15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610270600480360360208110156101c65760006000fd5b81019080803590602001906401000000008111156101e45760006000fd5b8201836020820111156101f75760006000fd5b8035906020019184600183028401116401000000008311171561021a5760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509090919290909192905050506105cf565b60405180821515815260200191505060405180910390f35b6103496004803603602081101561029f5760006000fd5b81019080803590602001906401000000008111156102bd5760006000fd5b8201836020820111156102d05760006000fd5b803590602001918460018302840111640100000000831117156102f35760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509090919290909192905050506105ec565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561038a5780820151818401525b60208101905061036e565b50505050905090810190601f1680156103b75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610486600480360360208110156103dc5760006000fd5b81019080803590602001906401000000008111156103fa5760006000fd5b82018360208201111561040d5760006000fd5b803590602001918460018302840111640100000000831117156104305760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050909091929090919290505050610609565b6040518082815260200191505060405180910390f35b61055d600480360360208110156104b35760006000fd5b81019080803590602001906401000000008111156104d15760006000fd5b8201836020820111156104e45760006000fd5b803590602001918460018302840111640100000000831117156105075760006000fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050909091929090919290505050610633565b604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018262ffffff168152602001935050505060405180910390f35b60606105c38261065a63ffffffff16565b90506105ca565b919050565b60006105e08261068563ffffffff16565b90506105e7565b919050565b60606105fd826106a563ffffffff16565b9050610604565b919050565b600060005a905061061f836106d363ffffffff16565b5050505a810391505061062e56505b919050565b600060006000610648846106d363ffffffff16565b925092509250610653565b9193909250565b6060610679600060146003601401018461072c9092919063ffffffff16565b9050610680565b919050565b600060036014016014600360140101018251101590506106a0565b919050565b60606106c7600360140160036014018451038461072c9092919063ffffffff16565b90506106ce565b919050565b6000600060006106ed60008561092c90919063ffffffff16565b92508250610705601485610a5590919063ffffffff16565b9050805061072060036014018561092c90919063ffffffff16565b915081505b9193909250565b606081601f8301101515156107ac576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f736c6963655f6f766572666c6f7700000000000000000000000000000000000081526020015060200191505060405180910390fd5b8282840110151515610829576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f736c6963655f6f766572666c6f7700000000000000000000000000000000000081526020015060200191505060405180910390fd5b8183018451101515156108a7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f736c6963655f6f75744f66426f756e647300000000000000000000000000000081526020015060200191505060405180910390fd5b60608215600081146108c8576040519150600082526020820160405261091a565b6040519150601f8416801560200281840101858101878315602002848b0101015b8183101561090757805183525b6020830192506020810190506108e9565b5050858452601f19601f82011660405250505b508091505061092556505b9392505050565b60008160148301101515156109ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f746f416464726573735f6f766572666c6f77000000000000000000000000000081526020015060200191505060405180910390fd5b60148201835110151515610a2b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f746f416464726573735f6f75744f66426f756e6473000000000000000000000081526020015060200191505060405180910390fd5b60006c010000000000000000000000008360208601015104905080915050610a4f56505b92915050565b6000816003830110151515610ad5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f746f55696e7432345f6f766572666c6f7700000000000000000000000000000081526020015060200191505060405180910390fd5b60038201835110151515610b54576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f746f55696e7432345f6f75744f66426f756e647300000000000000000000000081526020015060200191505060405180910390fd5b600082600385010151905080915050610b6956505b9291505056fea2646970667358221220847228bb89f2ef3401f647eae13a880ff93dfab0bba977c87f0ce45d9d24467364736f6c63430007060033";
