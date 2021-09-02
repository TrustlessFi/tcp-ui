/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  UniswapInterfaceMulticall,
  UniswapInterfaceMulticallInterface,
} from "../UniswapInterfaceMulticall";

const _abi = [
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
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
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapInterfaceMulticall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "gasUsed",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapInterfaceMulticall.Result[]",
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156100115760006000fd5b50610017565b610634806100266000396000f3fe60806040523480156100115760006000fd5b50600436106100465760003560e01c80630f28c97d1461004c5780631749e1e31461006a5780634d2301cc1461009b57610046565b60006000fd5b6100546100cb565b60405161006191906104a5565b60405180910390f35b610084600480360381019061007f9190610316565b6100d6565b6040516100929291906104b7565b60405180910390f35b6100b560048036038101906100b091906102f3565b610274565b6040516100c291906104a5565b60405180910390f35b600042905080505b90565b600060604391508150825167ffffffffffffffff811180156100f85760006000fd5b5060405190808252806020026020018201604052801561013257816020015b61011f610298565b8152602001906001900390816101175790505b50905080506000600090505b835181101561026d57600060006000868481518110151561015b57fe5b602002602001015160000151878581518110151561017557fe5b602002602001015160200151888681518110151561018f57fe5b60200260200101516040015192509250925060005a9050600060008573ffffffffffffffffffffffffffffffffffffffff1685856040516101d09190610486565b60006040518083038160008787f1925050503d806000811461020e576040519150601f19603f3d011682016040523d82523d6000602084013e610213565b606091505b509150915060005a840390506040518060600160405280841515815260200182815260200183815260200150898981518110151561024d57fe5b6020026020010181905250505050505050505b808060010191505061013e565b505b915091565b60008173ffffffffffffffffffffffffffffffffffffffff1631905080505b919050565b604051806060016040528060001515815260200160008152602001606081526020015090566105fd565b60008135905073ffffffffffffffffffffffffffffffffffffffff8116811415156102ed5760006000fd5b5b919050565b600060208284031215610304578081fd5b61030d826102c2565b90505b92915050565b60006020808385031215610328578182fd5b823567ffffffffffffffff8082111561033f578384fd5b818501915085601f8301121515610354578384fd5b81358181111561036057fe5b61036d848583020161059d565b808282528582019150858501875b8481101561047457813587017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0606081838f030112156103b9578a8bfd5b60408051606081018181108b821117156103cf57fe5b808352506103de8c85016102c2565b8152818401358c82015260608401358a8111156103f9578d8efd5b8085019450508e603f850112151561040f578c8dfd5b8b8401358a81111561041d57fe5b61042d8d85601f8401160161059d565b93508084528f83828701011115610442578d8efd5b808386018e8601378d8d828601015250828282015280885250505050878401935087820191505b60018101905061037b565b50508096505050505050505b92915050565b600082516104988184602087016105c8565b8083019150505b92915050565b60006020820190508282525b92915050565b600060408083018584526020828186015281865180845260609350838701915083838202880101838901875b8381101561058a577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa08a8403018552815180511515845286810151878501528881015190508789850152805180898601526080610545828288018b86016105c8565b807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8401168701019550505050858201915085850194505b6001810190506104e3565b50508096505050505050505b9392505050565b6000604051905081810181811067ffffffffffffffff821117156105bd57fe5b80604052505b919050565b60005b838110156105e75780820151818401525b6020810190506105cb565b838111156105f6576000848401525b505b505050565bfea2646970667358221220cf2657f2a07abd26032e89a6c018723ce1a063021d20774c298cb2dc08bbf0ba64736f6c63430007060033";

export class UniswapInterfaceMulticall__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<UniswapInterfaceMulticall> {
    return super.deploy(overrides || {}) as Promise<UniswapInterfaceMulticall>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): UniswapInterfaceMulticall {
    return super.attach(address) as UniswapInterfaceMulticall;
  }
  connect(signer: Signer): UniswapInterfaceMulticall__factory {
    return super.connect(signer) as UniswapInterfaceMulticall__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UniswapInterfaceMulticallInterface {
    return new utils.Interface(_abi) as UniswapInterfaceMulticallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapInterfaceMulticall {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as UniswapInterfaceMulticall;
  }
}
