/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TcpMulticall, TcpMulticallInterface } from "../TcpMulticall";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct TcpMulticall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "all",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "returnData",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBlockNumber",
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
    name: "getChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockCoinbase",
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
    name: "getCurrentBlockDifficulty",
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
    name: "getCurrentBlockGasLimit",
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
    name: "getCurrentBlockTimestamp",
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
        name: "addr",
        type: "address",
      },
    ],
    name: "getEthBalance",
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
    name: "getLastBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156100115760006000fd5b50610017565b6107cb806100266000396000f3fe60806040523480156100115760006000fd5b50600436106100c35760003560e01c806372425d9d116100775780638f1316d51161005c5780638f1316d5146101ad578063a8b0574e146101de578063ee82ac5e146101fc576100c3565b806372425d9d1461017157806386d516e81461018f576100c3565b80633408e470116100a85780633408e4701461010557806342cbb15c146101235780634d2301cc14610141576100c3565b80630f28c97d146100c957806327e86d6e146100e7576100c3565b60006000fd5b6100d161022c565b6040516100de91906105e4565b60405180910390f35b6100ef610239565b6040516100fc9190610593565b60405180910390f35b61010d61024a565b60405161011a91906105e4565b60405180910390f35b61012b61025e565b60405161013891906105e4565b60405180910390f35b61015b60048036038101906101569190610481565b61026b565b60405161016891906105e4565b60405180910390f35b610179610291565b60405161018691906105e4565b60405180910390f35b61019761029e565b6040516101a491906105e4565b60405180910390f35b6101c760048036038101906101c291906104c2565b6102ab565b6040516101d59291906105f6565b60405180910390f35b6101e6610460565b6040516101f3919061056b565b60405180910390f35b61021660048036038101906102119190610537565b61046d565b6040516102239190610593565b60405180910390f35b6000429050610236565b90565b600060014303409050610247565b90565b600060004690508091505061025b56505b90565b6000439050610268565b90565b60008173ffffffffffffffffffffffffffffffffffffffff1631905061028c565b919050565b600044905061029b565b90565b60004590506102a8565b90565b600060608383905067ffffffffffffffff811180156102ca5760006000fd5b506040519080825280602002602001820160405280156102fe57816020015b60608152602001906001900390816102e95790505b50905080506000600090505b8484905081101561044d576000858583818110151561032557fe5b90506020028101906103379190610752565b60000160208101906103499190610481565b73ffffffffffffffffffffffffffffffffffffffff16868684818110151561036d57fe5b905060200281019061037f9190610752565b806020019061038e91906106df565b60405161039c929190610553565b6000604051808303816000865af19150503d80600081146103d9576040519150601f19603f3d011682016040523d82523d6000602084013e6103de565b606091505b5084848151811015156103ed57fe5b60200260200101819052819250505080151561043e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610435906105a5565b60405180910390fd5b505b808060010191505061030a565b50818191509150610459565b9250929050565b600041905061046a565b90565b600081409050610478565b91905056610794565b600060208284031215610492578081fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811415156104b7578182fd5b809150505b92915050565b60006000602083850312156104d5578081fd5b823567ffffffffffffffff808211156104ec578283fd5b818501915085601f8301121515610501578283fd5b81358181111561050f578384fd5b866020602083028501011115610523578384fd5b6020830194508093505050505b9250929050565b600060208284031215610548578081fd5b813590505b92915050565b600082848337828201818152809150505b9392505050565b600060208201905073ffffffffffffffffffffffffffffffffffffffff831682525b92915050565b60006020820190508282525b92915050565b600060208252602060208301527f4d756c746963616c6c206167677265676174653a2063616c6c206661696c656460408301526060820190505b919050565b60006020820190508282525b92915050565b600060408201848352602060408185015281855180845260608601915060608382028701019350828701855b828110156106ce577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa088870301845281518051808852885b818110156106795787818401015188828b0101525b878101905061065a565b81811115610689578988838b0101525b50867fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011689010197505050848201915084840193505b600181019050610622565b5050505050809150505b9392505050565b6000600083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe18436030181121515610716578283fd5b80840190508035915067ffffffffffffffff821115610733578283fd5b6020810192505080360382131561074a5760006000fd5b5b9250929050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc18336030181121515610787578182fd5b8083019150505b92915050565bfea2646970667358221220eb120b56584d0240a065bfb791be9d1e168ecc75cf28588feea6584a40a10cd164736f6c63430007060033";

export class TcpMulticall__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TcpMulticall> {
    return super.deploy(overrides || {}) as Promise<TcpMulticall>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TcpMulticall {
    return super.attach(address) as TcpMulticall;
  }
  connect(signer: Signer): TcpMulticall__factory {
    return super.connect(signer) as TcpMulticall__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TcpMulticallInterface {
    return new utils.Interface(_abi) as TcpMulticallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TcpMulticall {
    return new Contract(address, _abi, signerOrProvider) as TcpMulticall;
  }
}
