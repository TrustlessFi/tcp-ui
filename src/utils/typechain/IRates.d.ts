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
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IRatesInterface extends ethers.utils.Interface {
  functions: {
    "addReferencePool(address)": FunctionFragment;
    "completeSetup()": FunctionFragment;
    "interestRateAbsoluteValue()": FunctionFragment;
    "positiveInterestRate()": FunctionFragment;
    "removeReferencePool(address)": FunctionFragment;
    "setInterestRateStep(uint128)": FunctionFragment;
    "stop()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addReferencePool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "completeSetup",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "interestRateAbsoluteValue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "positiveInterestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeReferencePool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setInterestRateStep",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "stop", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "addReferencePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "completeSetup",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "interestRateAbsoluteValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "positiveInterestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeReferencePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setInterestRateStep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stop", data: BytesLike): Result;

  events: {
    "ParameterUpdated128(string,uint128)": EventFragment;
    "ParameterUpdated64(string,uint64)": EventFragment;
    "ParameterUpdatedAddress(string,address)": EventFragment;
    "ParameterUpdatedInt128(string,int128)": EventFragment;
    "RateUpdated(int256,uint256,uint256,uint64)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ParameterUpdated128"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdated64"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdatedAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdatedInt128"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RateUpdated"): EventFragment;
}

export class IRates extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IRatesInterface;

  functions: {
    addReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    completeSetup(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<[BigNumber]>;

    positiveInterestRate(overrides?: CallOverrides): Promise<[boolean]>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addReferencePool(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  completeSetup(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

  positiveInterestRate(overrides?: CallOverrides): Promise<boolean>;

  removeReferencePool(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setInterestRateStep(
    step: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stop(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addReferencePool(pool: string, overrides?: CallOverrides): Promise<void>;

    completeSetup(overrides?: CallOverrides): Promise<void>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

    positiveInterestRate(overrides?: CallOverrides): Promise<boolean>;

    removeReferencePool(pool: string, overrides?: CallOverrides): Promise<void>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stop(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    ParameterUpdated128(
      paramName?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { paramName: string; value: BigNumber }
    >;

    ParameterUpdated64(
      paramName?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { paramName: string; value: BigNumber }
    >;

    ParameterUpdatedAddress(
      paramName?: string | null,
      addr?: string | null
    ): TypedEventFilter<[string, string], { paramName: string; addr: string }>;

    ParameterUpdatedInt128(
      paramName?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { paramName: string; value: BigNumber }
    >;

    RateUpdated(
      interestRate?: null,
      price?: null,
      rewardCount?: null,
      nextUpdateTime?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, BigNumber],
      {
        interestRate: BigNumber;
        price: BigNumber;
        rewardCount: BigNumber;
        nextUpdateTime: BigNumber;
      }
    >;
  };

  estimateGas: {
    addReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    completeSetup(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

    positiveInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    completeSetup(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    interestRateAbsoluteValue(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    positiveInterestRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
