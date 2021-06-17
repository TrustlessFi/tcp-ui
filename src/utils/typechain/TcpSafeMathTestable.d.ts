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
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface TcpSafeMathTestableInterface extends ethers.utils.Interface {
  functions: {
    "_div(uint256,uint256)": FunctionFragment;
    "_mul(uint256,uint256)": FunctionFragment;
    "_mulDiv(uint256,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "_div",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "_mul",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "_mulDiv",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "_div", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "_mul", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "_mulDiv", data: BytesLike): Result;

  events: {};
}

export class TcpSafeMathTestable extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: TcpSafeMathTestableInterface;

  functions: {
    _div(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      r: BigNumber;
      0: BigNumber;
    }>;

    "_div(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      r: BigNumber;
      0: BigNumber;
    }>;

    _mul(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      r: BigNumber;
      0: BigNumber;
    }>;

    "_mul(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      r: BigNumber;
      0: BigNumber;
    }>;

    _mulDiv(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      r: BigNumber;
      0: BigNumber;
    }>;

    "_mulDiv(uint256,uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      r: BigNumber;
      0: BigNumber;
    }>;
  };

  _div(
    a: BigNumberish,
    b: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "_div(uint256,uint256)"(
    a: BigNumberish,
    b: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  _mul(
    a: BigNumberish,
    b: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "_mul(uint256,uint256)"(
    a: BigNumberish,
    b: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  _mulDiv(
    a: BigNumberish,
    b: BigNumberish,
    c: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "_mulDiv(uint256,uint256,uint256)"(
    a: BigNumberish,
    b: BigNumberish,
    c: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    _div(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "_div(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _mul(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "_mul(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _mulDiv(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "_mulDiv(uint256,uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    _div(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "_div(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _mul(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "_mul(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    _mulDiv(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "_mulDiv(uint256,uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _div(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "_div(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _mul(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "_mul(uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _mulDiv(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "_mulDiv(uint256,uint256,uint256)"(
      a: BigNumberish,
      b: BigNumberish,
      c: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
