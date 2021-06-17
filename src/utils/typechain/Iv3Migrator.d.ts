/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface Iv3MigratorInterface extends ethers.utils.Interface {
  functions: {
    "createAndInitializePoolIfNecessary(address,address,uint24,uint160)": FunctionFragment;
    "migrate(tuple)": FunctionFragment;
    "multicall(bytes[])": FunctionFragment;
    "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createAndInitializePoolIfNecessary",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "migrate",
    values: [
      {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "multicall",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermit",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermitAllowed",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermitAllowedIfNecessary",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "selfPermitIfNecessary",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "createAndInitializePoolIfNecessary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "migrate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "selfPermit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "selfPermitAllowed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "selfPermitAllowedIfNecessary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "selfPermitIfNecessary",
    data: BytesLike
  ): Result;

  events: {};
}

export class Iv3Migrator extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: Iv3MigratorInterface;

  functions: {
    createAndInitializePoolIfNecessary(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "createAndInitializePoolIfNecessary(address,address,uint24,uint160)"(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    migrate(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "migrate(tuple)"(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    multicall(
      data: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "multicall(bytes[])"(
      data: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    selfPermit(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    selfPermitAllowed(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    selfPermitAllowedIfNecessary(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    selfPermitIfNecessary(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;
  };

  createAndInitializePoolIfNecessary(
    token0: string,
    token1: string,
    fee: BigNumberish,
    sqrtPriceX96: BigNumberish,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  "createAndInitializePoolIfNecessary(address,address,uint24,uint160)"(
    token0: string,
    token1: string,
    fee: BigNumberish,
    sqrtPriceX96: BigNumberish,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  migrate(
    params: {
      pair: string;
      liquidityToMigrate: BigNumberish;
      percentageToMigrate: BigNumberish;
      token0: string;
      token1: string;
      fee: BigNumberish;
      tickLower: BigNumberish;
      tickUpper: BigNumberish;
      amount0Min: BigNumberish;
      amount1Min: BigNumberish;
      recipient: string;
      deadline: BigNumberish;
      refundAsETH: boolean;
    },
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "migrate(tuple)"(
    params: {
      pair: string;
      liquidityToMigrate: BigNumberish;
      percentageToMigrate: BigNumberish;
      token0: string;
      token1: string;
      fee: BigNumberish;
      tickLower: BigNumberish;
      tickUpper: BigNumberish;
      amount0Min: BigNumberish;
      amount1Min: BigNumberish;
      recipient: string;
      deadline: BigNumberish;
      refundAsETH: boolean;
    },
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  multicall(
    data: BytesLike[],
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  "multicall(bytes[])"(
    data: BytesLike[],
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  selfPermit(
    token: string,
    value: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)"(
    token: string,
    value: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  selfPermitAllowed(
    token: string,
    nonce: BigNumberish,
    expiry: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  "selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)"(
    token: string,
    nonce: BigNumberish,
    expiry: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  selfPermitAllowedIfNecessary(
    token: string,
    nonce: BigNumberish,
    expiry: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  "selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
    token: string,
    nonce: BigNumberish,
    expiry: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  selfPermitIfNecessary(
    token: string,
    value: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
    token: string,
    value: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  callStatic: {
    createAndInitializePoolIfNecessary(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "createAndInitializePoolIfNecessary(address,address,uint24,uint160)"(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    migrate(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: CallOverrides
    ): Promise<void>;

    "migrate(tuple)"(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: CallOverrides
    ): Promise<void>;

    multicall(data: BytesLike[], overrides?: CallOverrides): Promise<string[]>;

    "multicall(bytes[])"(
      data: BytesLike[],
      overrides?: CallOverrides
    ): Promise<string[]>;

    selfPermit(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    selfPermitAllowed(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    selfPermitAllowedIfNecessary(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    selfPermitIfNecessary(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    createAndInitializePoolIfNecessary(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    "createAndInitializePoolIfNecessary(address,address,uint24,uint160)"(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    migrate(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: Overrides
    ): Promise<BigNumber>;

    "migrate(tuple)"(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: Overrides
    ): Promise<BigNumber>;

    multicall(
      data: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    "multicall(bytes[])"(
      data: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    selfPermit(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    selfPermitAllowed(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    "selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    selfPermitAllowedIfNecessary(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    "selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    selfPermitIfNecessary(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createAndInitializePoolIfNecessary(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    "createAndInitializePoolIfNecessary(address,address,uint24,uint160)"(
      token0: string,
      token1: string,
      fee: BigNumberish,
      sqrtPriceX96: BigNumberish,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    migrate(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "migrate(tuple)"(
      params: {
        pair: string;
        liquidityToMigrate: BigNumberish;
        percentageToMigrate: BigNumberish;
        token0: string;
        token1: string;
        fee: BigNumberish;
        tickLower: BigNumberish;
        tickUpper: BigNumberish;
        amount0Min: BigNumberish;
        amount1Min: BigNumberish;
        recipient: string;
        deadline: BigNumberish;
        refundAsETH: boolean;
      },
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    multicall(
      data: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    "multicall(bytes[])"(
      data: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    selfPermit(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    "selfPermit(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    selfPermitAllowed(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    "selfPermitAllowed(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    selfPermitAllowedIfNecessary(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    "selfPermitAllowedIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    selfPermitIfNecessary(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    "selfPermitIfNecessary(address,uint256,uint256,uint8,bytes32,bytes32)"(
      token: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;
  };
}
