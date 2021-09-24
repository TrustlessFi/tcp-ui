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
import type {
  GenesisAllocation,
  GenesisAllocationInterface,
} from "../GenesisAllocation";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "Governor",
            type: "address",
          },
          {
            internalType: "address",
            name: "Tcp",
            type: "address",
          },
          {
            internalType: "address",
            name: "Authenticator",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "GenesisClaimDuration",
            type: "uint64",
          },
        ],
        internalType: "struct GenesisAllocation.ConstructorParams",
        name: "params",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "deadline",
        type: "uint64",
      },
    ],
    name: "DeadlineSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dest",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "IncentiveDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "count",
        type: "uint128",
      },
    ],
    name: "LockPositionIncreased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newGuardian",
        type: "address",
      },
    ],
    name: "NewGuardian",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "count",
        type: "uint128",
      },
    ],
    name: "SignatureProcessed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "lockDurationMonths",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "TokensLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "TokensRemoved",
    type: "event",
  },
  {
    inputs: [],
    name: "NAME",
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
    name: "abdicateTokenRemoval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "authenticator",
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
    name: "canRemoveTokens",
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
    inputs: [],
    name: "chainID",
    outputs: [
      {
        internalType: "uint256",
        name: "_chainID",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "v",
            type: "uint8",
          },
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
        ],
        internalType: "struct GenesisAllocation.Auth",
        name: "auth",
        type: "tuple",
      },
      {
        internalType: "uint8",
        name: "roundID",
        type: "uint8",
      },
      {
        internalType: "uint128",
        name: "count",
        type: "uint128",
      },
    ],
    name: "claimAllocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "claimedSig",
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
    inputs: [],
    name: "dao",
    outputs: [
      {
        internalType: "contract ITokenLockDao",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deadline",
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
        name: "newDeadline",
        type: "uint64",
      },
    ],
    name: "extendDeadline",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "roundID",
        type: "uint8",
      },
      {
        internalType: "uint128",
        name: "count",
        type: "uint128",
      },
    ],
    name: "getMessage",
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
    inputs: [
      {
        internalType: "uint128",
        name: "count",
        type: "uint128",
      },
    ],
    name: "getTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "guardian",
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
        name: "",
        type: "address",
      },
    ],
    name: "lockPositions",
    outputs: [
      {
        internalType: "uint128",
        name: "totalAllocation",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "tokensAllocated",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "cumulativeTokensAllocatedxLockYears",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "count",
        type: "uint128",
      },
      {
        internalType: "uint8",
        name: "lockDurationMonths",
        type: "uint8",
      },
    ],
    name: "lockTokensIntoDao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "minAverageYearsLocked",
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
    name: "pendingGuardian",
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
    name: "recieveGuardianship",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dest",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "removeTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dao",
        type: "address",
      },
    ],
    name: "setDao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
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
    inputs: [],
    name: "token",
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
    name: "tokenMinter",
    outputs: [
      {
        internalType: "contract ITokenIncentiveMinter",
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
        name: "newGuardian",
        type: "address",
      },
    ],
    name: "transferGuardianship",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101206040526001600460086101000a81548160ff0219169083151502179055503480156200002e5760006000fd5b506040516200364f3803806200364f833981810160405281019062000054919062000461565b5b80600001518160200151670de0b6b3a76400005b82825b8173ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b815260140150508073ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff1660601b81526014015050620000f133620001a060201b60201c565b5b5050620001046200022860201b60201c565b67ffffffffffffffff1660c08167ffffffffffffffff1660c01b815260080150508060e081815260200150505b505050806040015173ffffffffffffffffffffffffffffffffffffffff166101008173ffffffffffffffffffffffffffffffffffffffff1660601b81526014015050620001986200018c82606001516200024a60201b60201c565b6200028960201b60201c565b5b506200050e565b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff167fb6182387b7ea948602a7e04e662a27ce251dc3dd014eacaed10dce36b41bf1a560405160405180910390a25b50565b600062000242426200030560201b6200149417909060201c565b905080505b90565b60006200027f82620002616200022860201b60201c565b67ffffffffffffffff166200039960201b620015261790919060201c565b905080505b919050565b80600460006101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055507f4f9cd54e7c3589d8772371faadbfc749621246794485e3bd944fdb91c5a3257e600460009054906101000a900467ffffffffffffffff16604051620002f99190620004f2565b60405180910390a15b50565b600068010000000000000000821015156200038b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f6d6f7265207468616e203634206269747300000000000000000000000000000081526020015060200191505060405180910390fd5b81905062000394565b919050565b60008267ffffffffffffffff1682840191508167ffffffffffffffff161015151562000430576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f6164642d6f766572666c6f77000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050566200050d565b6000815190506001600160a01b038116811415156200045b5760006000fd5b5b919050565b60006080828403121562000473578081fd5b604051608081016001600160401b0382821081831117156200049157fe5b81604052620004a0856200043c565b8352620004b0602086016200043c565b6020840152620004c3604086016200043c565b60408401526060850151915080821682141515620004df578384fd5b5080606083015250809150505b92915050565b60006020820190506001600160401b03831682525b92915050565b5b60805160601c60a05160601c60c05160c01c60e0516101005160601c6130d762000578600039806108495280610e5a525080611428528061222f52508061114a52806121a8525080610d3652806114725280612420525080611404528061255552506130d76000f3fe60806040523480156100115760006000fd5b506004361061019d5760003560e01c806378e97925116100e4578063c5c57a221161008d578063f15ef91911610067578063f15ef9191461041d578063f60d7af41461043b578063fc0c546a146104575761019d565b8063c5c57a22146103af578063cfb3647b146103e1578063d4ce8c10146103ff5761019d565b8063a3f4df7e116100be578063a3f4df7e14610343578063adc879e914610361578063bea676cd1461037f5761019d565b806378e97925146102d957806380c806b0146102f75780639cef4240146103275761019d565b80634162169f116101465780636637b882116101205780636637b882146102835780636f89dcc41461029f578063762c31ba146102bb5761019d565b80634162169f1461023d578063452a93201461025b57806356a02cf5146102795761019d565b80632335c76b116101775780632335c76b146101f757806329dcb0cf146102155780633d2ec400146102335761019d565b806308805f75146101a35780630b54d683146101bf5780631e10eeaf146101db5761019d565b60006000fd5b6101bd60048036038101906101b89190612c20565b610475565b005b6101d960048036038101906101d49190612bec565b61063a565b005b6101f560048036038101906101f09190612ac5565b61064f565b005b6101ff610847565b60405161020c9190612d33565b60405180910390f35b61021d61086b565b60405161022a919061300b565b60405180910390f35b61023b610885565b005b6102456109a6565b6040516102529190612da9565b60405180910390f35b6102636109cc565b6040516102709190612d33565b60405180910390f35b6102816109f2565b005b61029d60048036038101906102989190612aa2565b610ad9565b005b6102b960048036038101906102b49190612b7e565b610d87565b005b6102c3611122565b6040516102d09190612d33565b60405180910390f35b6102e1611148565b6040516102ee919061300b565b60405180910390f35b610311600480360381019061030c9190612b3a565b61116c565b60405161031e9190612d6f565b60405180910390f35b610341600480360381019061033c9190612aa2565b6111f2565b005b61034b611300565b6040516103589190612dd1565b60405180910390f35b61036961133c565b6040516103769190612ff9565b60405180910390f35b61039960048036038101906103949190612af2565b611345565b6040516103a69190612d5b565b60405180910390f35b6103c960048036038101906103c49190612aa2565b61139a565b6040516103d893929190612fc3565b60405180910390f35b6103e9611402565b6040516103f69190612d81565b60405180910390f35b610407611426565b6040516104149190612ff9565b60405180910390f35b61042561144a565b6040516104329190612d5b565b60405180910390f35b61045560048036038101906104509190612bc9565b61145d565b005b61045f611470565b60405161046c9190612d33565b60405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561053d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f7420417574686f72697a656400000000000000000000000000000000000081526020015060200191505060405180910390fd5b600460009054906101000a900467ffffffffffffffff1667ffffffffffffffff1661056c6115c363ffffffff16565b67ffffffffffffffff161015156105b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105af90612ee2565b60405180910390fd5b8067ffffffffffffffff16600460009054906101000a900467ffffffffffffffff1667ffffffffffffffff16101515610626576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161061d90612ea3565b60405180910390fd5b610635816115de63ffffffff16565b5b5b50565b61064a828261165863ffffffff16565b5b5050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610717576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f7420417574686f72697a656400000000000000000000000000000000000081526020015060200191505060405180910390fd5b6107256115c363ffffffff16565b67ffffffffffffffff16600460009054906101000a900467ffffffffffffffff1667ffffffffffffffff16101515610792576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078990612e64565b60405180910390fd5b600460089054906101000a900460ff1615156107e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107da90612f21565b60405180910390fd5b6107f382826116af63ffffffff16565b8173ffffffffffffffffffffffffffffffffffffffff167f079bee7f865179f632bcb69702978d375656a5decc8ca5fc5c3acc636412e35d826040516108399190612ff9565b60405180910390a25b5b5050565b7f000000000000000000000000000000000000000000000000000000000000000081565b600460009054906101000a900467ffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561094d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f7420417574686f72697a656400000000000000000000000000000000000081526020015060200191505060405180910390fd5b61097e600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661171263ffffffff16565b600160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690555b565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610aba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f7420417574686f72697a656400000000000000000000000000000000000081526020015060200191505060405180910390fd5b6000600460086101000a81548160ff0219169083151502179055505b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610ba1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f7420417574686f72697a656400000000000000000000000000000000000081526020015060200191505060405180910390fd5b610bb08161179a63ffffffff16565b1515610c27576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f74206120636f6e747261637400000000000000000000000000000000000081526020015060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610cf0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f416c72656164792073657400000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610d827f0000000000000000000000000000000000000000000000000000000000000000827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6117b463ffffffff16565b5b5b50565b600460009054906101000a900467ffffffffffffffff1667ffffffffffffffff16610db66115c363ffffffff16565b67ffffffffffffffff16101515610e02576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610df990612ee2565b60405180910390fd5b6000610e56610e26610e1b33868661116c63ffffffff16565b6119c063ffffffff16565b856000016020810190610e399190612c55565b866020013560001916876040013560001916611a2463ffffffff16565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515610ee8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610edf90612f60565b60405180910390fd5b600560005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000856000016020810190610f429190612c55565b60ff1660ff16815260200190815260200160002060005060008560200135600019166000191660001916815260200190815260200160002060005060008560400135600019166000191660001916815260200190815260200160002060009054906101000a900460ff16151515610fee576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fe590612e25565b60405180910390fd5b6001600560005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050600086600001602081019061104a9190612c55565b60ff1660ff16815260200190815260200160002060005060008660200135600019166000191660001916815260200190815260200160002060005060008660400135600019166000191660001916815260200190815260200160002060006101000a81548160ff0219169083151502179055506110cd3383611c3f63ffffffff16565b3373ffffffffffffffffffffffffffffffffffffffff167fd97029b868ed1d773b6868c2a058a6ea01aae0b499d9d269365425791444c7a2836040516111139190612f9f565b60405180910390a2505b505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b7f000000000000000000000000000000000000000000000000000000000000000081565b60006040518060400160405280601281526020017f47656e6573697320416c6c6f636174696f6e00000000000000000000000000008152602001506111b561133c63ffffffff16565b308686866040516020016111ce96959493929190612c78565b6040516020818303038152906040528051906020012090506111eb565b9392505050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156112ba576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f4e6f7420417574686f72697a656400000000000000000000000000000000000081526020015060200191505060405180910390fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b50565b6040518060400160405280601281526020017f47656e6573697320416c6c6f636174696f6e000000000000000000000000000081526020015081565b60004690505b90565b600560005060205283600052604060002060005060205282600052604060002060005060205281600052604060002060005060205280600052604060002060009350935050509054906101000a900460ff1681565b60036000506020528060005260406000206000915090508060000160009054906101000a90046fffffffffffffffffffffffffffffffff16908060000160109054906101000a90046fffffffffffffffffffffffffffffffff16908060010160005054905083565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b600460089054906101000a900460ff1681565b61146c81611e3863ffffffff16565b5b50565b7f000000000000000000000000000000000000000000000000000000000000000081565b60006801000000000000000082101515611519576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f6d6f7265207468616e203634206269747300000000000000000000000000000081526020015060200191505060405180910390fd5b819050611521565b919050565b60008267ffffffffffffffff1682840191508167ffffffffffffffff16101515156115bc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f6164642d6f766572666c6f77000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050565b60006115d642611494909063ffffffff16565b905080505b90565b80600460006101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055507f4f9cd54e7c3589d8772371faadbfc749621246794485e3bd944fdb91c5a3257e600460009054906101000a900467ffffffffffffffff1660405161164c919061300b565b60405180910390a15b50565b6116878261167c6116718460ff16611e7b63ffffffff16565b611edd63ffffffff16565b611f1363ffffffff16565b6116aa826fffffffffffffffffffffffffffffffff1682336123d063ffffffff16565b5b5050565b6116bf828261255363ffffffff16565b8173ffffffffffffffffffffffffffffffffffffffff167faf2b23cbaeeb4ac51eb45799ad2661590f109d149e349e2c1b8a89b769c46846826040518082815260200191505060405180910390a25b5050565b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff167fb6182387b7ea948602a7e04e662a27ce251dc3dd014eacaed10dce36b41bf1a560405160405180910390a25b50565b60006000823b9050600081119150506117af56505b919050565b600060008473ffffffffffffffffffffffffffffffffffffffff1663095ea7b360e01b8585604051602401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040518082805190602001908083835b60208310151561189957805182525b602082019150602081019050602083039250611873565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146118fb576040519150601f19603f3d011682016040523d82523d6000602084013e611900565b606091505b50915091508180156119415750600081511480611940575080806020019051602081101561192e5760006000fd5b81019080805190602001909291905050505b5b15156119b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260028152602001807f534100000000000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b50505b505050565b60008160405160200180807f19457468657265756d205369676e6564204d6573736167653a0a333200000000815260200150601c0182600019168152602001915050604051602081830303815290604052805190602001209050611a1f565b919050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08260001c11151515611aa4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602281526020018061305e6022913960400191505060405180910390fd5b601b8460ff161480611ab95750601c8460ff16145b1515611b10576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806130806022913960400191505060405180910390fd5b60006001868686866040516000815260200160405260405180856000191681526020018460ff16815260200183600019168152602001826000191681526020019450505050506020604051602081039080840390855afa158015611b79573d600060003e3d6000fd5b505050602060405103519050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515611c2d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f45434453413a20696e76616c6964207369676e6174757265000000000000000081526020015060200191505060405180910390fd5b80915050611c3756505b949350505050565b6000816fffffffffffffffffffffffffffffffff16111515611ccc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260058152602001807f4e6f6f702e00000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b611d5581600360005060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060000160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff1661260390919063ffffffff16565b600360005060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060000160006101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff167f39269bcc94baba79914cd1fbb42780568649c4411ad91db4c52e1e029bde31e28260405180826fffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5050565b611e5581611e4a6115c363ffffffff16565b611f1363ffffffff16565b611e7733826fffffffffffffffffffffffffffffffff166116af63ffffffff16565b5b50565b6000600c611ebd62015180611ea561016d8667ffffffffffffffff166126b090919063ffffffff16565b67ffffffffffffffff166126b090919063ffffffff16565b67ffffffffffffffff16811515611ed057fe5b049050611ed8565b919050565b6000611f0982611ef16115c363ffffffff16565b67ffffffffffffffff1661152690919063ffffffff16565b905080505b919050565b6000826fffffffffffffffffffffffffffffffff16111515611fa0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260048152602001807f4e6f6f700000000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b6000600360005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506040518060600160405290816000820160009054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff1681526020016000820160109054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff16815260200160018201600050548152602001505090506120c18382602001516fffffffffffffffffffffffffffffffff1661260390919063ffffffff16565b81602001906fffffffffffffffffffffffffffffffff1690816fffffffffffffffffffffffffffffffff168152602001505080600001516fffffffffffffffffffffffffffffffff1681602001516fffffffffffffffffffffffffffffffff161115151561219a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f546f6f206d616e7920746f6b656e73000000000000000000000000000000000081526020015060200191505060405180910390fd5b61221f61220c6121eb6121e07f00000000000000000000000000000000000000000000000000000000000000008667ffffffffffffffff1661278090919063ffffffff16565b61281d63ffffffff16565b856fffffffffffffffffffffffffffffffff1661284c90919063ffffffff16565b826040015161287290919063ffffffff16565b81604001909081815260200150507f000000000000000000000000000000000000000000000000000000000000000061227b82602001516fffffffffffffffffffffffffffffffff1683604001516128fb90919063ffffffff16565b101515156122f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f4176657261676520756e6c6f636b2074696d6520746f6f2073686f727400000081526020015060200191505060405180910390fd5b80600360005060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008201518160000160006101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff16021790555060208201518160000160106101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff160217905550604082015181600101600050909055905050505b5050565b6123e0308461255363ffffffff16565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166327fb04747f00000000000000000000000000000000000000000000000000000000000000008585856040518563ffffffff1660e01b8152600401808573ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018360ff1681526020018273ffffffffffffffffffffffffffffffffffffffff168152602001945050505050602060405180830381600087803b1580156124bd5760006000fd5b505af11580156124d2573d600060003e3d6000fd5b505050506040513d60208110156124e95760006000fd5b8101908080519060200190929190505050508160ff168173ffffffffffffffffffffffffffffffffffffffff167f603b80bf3fe3620c8b3029a98c48ed6d0a750f155cd9ad74e5a33637b6e27612856040518082815260200191505060405180910390a35b505050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16634cd7a31583836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1580156125e55760006000fd5b505af11580156125fa573d600060003e3d6000fd5b505050505b5050565b6000826fffffffffffffffffffffffffffffffff168284019150816fffffffffffffffffffffffffffffffff16101515156126a9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f6164642d6f766572666c6f77000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050565b600060008267ffffffffffffffff16148061270257508267ffffffffffffffff168267ffffffffffffffff1683850292508267ffffffffffffffff168115156126f557fe5b0467ffffffffffffffff16145b1515612779576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f6d756c2d6f766572666c6f77000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050565b60008267ffffffffffffffff1682840391508167ffffffffffffffff1611151515612816576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f7375622d756e646572666c6f770000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050565b60006128406301e133808367ffffffffffffffff166128fb90919063ffffffff16565b9050612847565b919050565b60006128678383670de0b6b3a764000061292163ffffffff16565b905080505b92915050565b600082828401915081101515156128f4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f6164642d6f766572666c6f77000000000000000000000000000000000000000081526020015060200191505060405180910390fd5b5b92915050565b600061291683670de0b6b3a76400008461292163ffffffff16565b905080505b92915050565b6000600060006000198587098587029250828110838203039150506000811415612964576000841115156129555760006000fd5b83820492508292505050612a1b565b80841115156129735760006000fd5b6000848688099050828111820391508083039250600085866000031690508086049550808404935060018182600003040190508083028417935083506000600287600302189050808702600203810290508050808702600203810290508050808702600203810290508050808702600203810290508050808702600203810290508050808702600203810290508050808502955085508595505050505050612a1b5650505050505b93925050505661305c565b60008135905073ffffffffffffffffffffffffffffffffffffffff811681141515612a515760006000fd5b5b919050565b6000813590506fffffffffffffffffffffffffffffffff811681141515612a7e5760006000fd5b5b919050565b60008135905060ff811681141515612a9c5760006000fd5b5b919050565b600060208284031215612ab3578081fd5b612abc82612a26565b90505b92915050565b6000600060408385031215612ad8578081fd5b612ae183612a26565b9150602083013590505b9250929050565b600060006000600060808587031215612b09578182fd5b612b1285612a26565b9350612b2060208601612a84565b925060408501359150606085013590505b92959194509250565b60006000600060608486031215612b4f578283fd5b612b5884612a26565b9250612b6660208501612a84565b9150612b7460408501612a57565b90505b9250925092565b60006000600083850360a0811215612b94578384fd5b6060811215612ba1578384fd5b50839250612bb160608501612a84565b9150612bbf60808501612a57565b90505b9250925092565b600060208284031215612bda578081fd5b612be382612a57565b90505b92915050565b6000600060408385031215612bff578182fd5b612c0883612a57565b9150612c1660208401612a84565b90505b9250929050565b600060208284031215612c31578081fd5b813567ffffffffffffffff811681141515612c4a578182fd5b809150505b92915050565b600060208284031215612c66578081fd5b612c6f82612a84565b90505b92915050565b60008751612c8a818460208c01613027565b80830190508781527fffffffffffffffffffffffffffffffffffffffff000000000000000000000000808860601b166020830152808760601b166034830152507fff000000000000000000000000000000000000000000000000000000000000008560f81b1660488201527fffffffffffffffffffffffffffffffff000000000000000000000000000000008460801b166049820152605981019150505b979650505050505050565b600060208201905073ffffffffffffffffffffffffffffffffffffffff831682525b92915050565b600060208201905082151582525b92915050565b60006020820190508282525b92915050565b600060208201905073ffffffffffffffffffffffffffffffffffffffff831682525b92915050565b600060208201905073ffffffffffffffffffffffffffffffffffffffff831682525b92915050565b6000602082528251806020840152612df0816040850160208701613027565b60407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168401019150505b92915050565b600060208252600f60208301527f416c726561647920636c61696d6564000000000000000000000000000000000060408301526060820190505b919050565b600060208252601360208301527f446561646c696e65206e6f74207061737365640000000000000000000000000060408301526060820190505b919050565b600060208252600b60208301527f4d75737420657874656e6400000000000000000000000000000000000000000060408301526060820190505b919050565b600060208252600f60208301527f446561646c696e6520706173736564000000000000000000000000000000000060408301526060820190505b919050565b600060208252600960208301527f416264696361746564000000000000000000000000000000000000000000000060408301526060820190505b919050565b600060208252600b60208301527f41757468206661696c656400000000000000000000000000000000000000000060408301526060820190505b919050565b60006020820190506fffffffffffffffffffffffffffffffff831682525b92915050565b60006060820190506fffffffffffffffffffffffffffffffff80861683528085166020840152508260408301525b949350505050565b60006020820190508282525b92915050565b600060208201905067ffffffffffffffff831682525b92915050565b60005b838110156130465780820151818401525b60208101905061302a565b83811115613055576000848401525b505b505050565bfe45434453413a20696e76616c6964207369676e6174757265202773272076616c756545434453413a20696e76616c6964207369676e6174757265202776272076616c7565a26469706673582212208834498c745923b1f25e55f5a2d044b896855c4e44a6f8a0eb17b9e4e5809b7064736f6c63430007060033";

export class GenesisAllocation__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    params: {
      Governor: string;
      Tcp: string;
      Authenticator: string;
      GenesisClaimDuration: BigNumberish;
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<GenesisAllocation> {
    return super.deploy(params, overrides || {}) as Promise<GenesisAllocation>;
  }
  getDeployTransaction(
    params: {
      Governor: string;
      Tcp: string;
      Authenticator: string;
      GenesisClaimDuration: BigNumberish;
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(params, overrides || {});
  }
  attach(address: string): GenesisAllocation {
    return super.attach(address) as GenesisAllocation;
  }
  connect(signer: Signer): GenesisAllocation__factory {
    return super.connect(signer) as GenesisAllocation__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GenesisAllocationInterface {
    return new utils.Interface(_abi) as GenesisAllocationInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GenesisAllocation {
    return new Contract(address, _abi, signerOrProvider) as GenesisAllocation;
  }
}
