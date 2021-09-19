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

interface RatesInterface extends ethers.utils.Interface {
  functions: {
    "addReferencePool(address)": FunctionFragment;
    "collateralPool()": FunctionFragment;
    "currentRateData()": FunctionFragment;
    "deployer()": FunctionFragment;
    "getReferencePools()": FunctionFragment;
    "getRewardCount()": FunctionFragment;
    "governor()": FunctionFragment;
    "init(address,address[])": FunctionFragment;
    "interestRateAbsoluteValue()": FunctionFragment;
    "interestRateParameters()": FunctionFragment;
    "minTimeBetweenUpdates()": FunctionFragment;
    "positiveInterestRate()": FunctionFragment;
    "predictInterestRate()": FunctionFragment;
    "referencePools(uint256)": FunctionFragment;
    "removeReferencePool(address)": FunctionFragment;
    "setAcceptableError(uint128)": FunctionFragment;
    "setErrorInterval(uint128)": FunctionFragment;
    "setInterestRateStep(uint128)": FunctionFragment;
    "setMaxRate(int128)": FunctionFragment;
    "setMaxSteps(uint64)": FunctionFragment;
    "setMinRate(int128)": FunctionFragment;
    "setMinTimeBetweenUpdates(uint64)": FunctionFragment;
    "stop()": FunctionFragment;
    "stopped()": FunctionFragment;
    "update()": FunctionFragment;
    "validUpdate(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addReferencePool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "collateralPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "currentRateData",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getReferencePools",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardCount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "governor", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [string, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "interestRateAbsoluteValue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "interestRateParameters",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minTimeBetweenUpdates",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "positiveInterestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "predictInterestRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "referencePools",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeReferencePool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setAcceptableError",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setErrorInterval",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setInterestRateStep",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxSteps",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinTimeBetweenUpdates",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "stop", values?: undefined): string;
  encodeFunctionData(functionFragment: "stopped", values?: undefined): string;
  encodeFunctionData(functionFragment: "update", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "validUpdate",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addReferencePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collateralPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentRateData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getReferencePools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "governor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "interestRateAbsoluteValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "interestRateParameters",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minTimeBetweenUpdates",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "positiveInterestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "predictInterestRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "referencePools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeReferencePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAcceptableError",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setErrorInterval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setInterestRateStep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setMaxRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMaxSteps",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setMinRate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMinTimeBetweenUpdates",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stop", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stopped", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "update", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "validUpdate",
    data: BytesLike
  ): Result;

  events: {
    "AcceptableErrorUpdated(uint128)": EventFragment;
    "ErrorIntervalUpdated(uint128)": EventFragment;
    "InterestRateStepUpdated(uint128)": EventFragment;
    "MaxRateUpdated(int128)": EventFragment;
    "MaxStepsUpdated(uint64)": EventFragment;
    "MinRateUpdated(int128)": EventFragment;
    "MinTimeBetweenUpdatesUpdated(uint64)": EventFragment;
    "RateUpdated(int256,uint256,uint256,uint64)": EventFragment;
    "ReferencePoolAdded(address)": EventFragment;
    "ReferencePoolRemoved(address)": EventFragment;
    "Stopped()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AcceptableErrorUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ErrorIntervalUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "InterestRateStepUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxRateUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxStepsUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MinRateUpdated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "MinTimeBetweenUpdatesUpdated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RateUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReferencePoolAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReferencePoolRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Stopped"): EventFragment;
}

export class Rates extends BaseContract {
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

  interface: RatesInterface;

  functions: {
    addReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    collateralPool(overrides?: CallOverrides): Promise<[string]>;

    currentRateData(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        rate: BigNumber;
        nextUpdateTime: BigNumber;
        rewardCount: BigNumber;
      }
    >;

    deployer(overrides?: CallOverrides): Promise<[string]>;

    getReferencePools(overrides?: CallOverrides): Promise<[string[]]>;

    getRewardCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    governor(overrides?: CallOverrides): Promise<[string]>;

    init(
      _collateralPool: string,
      _referencePools: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<[BigNumber]>;

    interestRateParameters(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        acceptableError: BigNumber;
        errorInterval: BigNumber;
        interestRateStep: BigNumber;
        maxSteps: BigNumber;
        minRate: BigNumber;
        maxRate: BigNumber;
      }
    >;

    minTimeBetweenUpdates(overrides?: CallOverrides): Promise<[BigNumber]>;

    positiveInterestRate(overrides?: CallOverrides): Promise<[boolean]>;

    predictInterestRate(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { price: BigNumber; rate: BigNumber }>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxRate(
      max: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxSteps(
      steps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMinRate(
      min: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stopped(overrides?: CallOverrides): Promise<[boolean]>;

    update(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
  };

  addReferencePool(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  collateralPool(overrides?: CallOverrides): Promise<string>;

  currentRateData(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      rate: BigNumber;
      nextUpdateTime: BigNumber;
      rewardCount: BigNumber;
    }
  >;

  deployer(overrides?: CallOverrides): Promise<string>;

  getReferencePools(overrides?: CallOverrides): Promise<string[]>;

  getRewardCount(overrides?: CallOverrides): Promise<BigNumber>;

  governor(overrides?: CallOverrides): Promise<string>;

  init(
    _collateralPool: string,
    _referencePools: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

  interestRateParameters(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      acceptableError: BigNumber;
      errorInterval: BigNumber;
      interestRateStep: BigNumber;
      maxSteps: BigNumber;
      minRate: BigNumber;
      maxRate: BigNumber;
    }
  >;

  minTimeBetweenUpdates(overrides?: CallOverrides): Promise<BigNumber>;

  positiveInterestRate(overrides?: CallOverrides): Promise<boolean>;

  predictInterestRate(
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber] & { price: BigNumber; rate: BigNumber }>;

  referencePools(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  removeReferencePool(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAcceptableError(
    error: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setErrorInterval(
    interval: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setInterestRateStep(
    step: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxRate(
    max: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxSteps(
    steps: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMinRate(
    min: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMinTimeBetweenUpdates(
    time: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stop(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stopped(overrides?: CallOverrides): Promise<boolean>;

  update(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    addReferencePool(pool: string, overrides?: CallOverrides): Promise<void>;

    collateralPool(overrides?: CallOverrides): Promise<string>;

    currentRateData(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        rate: BigNumber;
        nextUpdateTime: BigNumber;
        rewardCount: BigNumber;
      }
    >;

    deployer(overrides?: CallOverrides): Promise<string>;

    getReferencePools(overrides?: CallOverrides): Promise<string[]>;

    getRewardCount(overrides?: CallOverrides): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<string>;

    init(
      _collateralPool: string,
      _referencePools: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

    interestRateParameters(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        acceptableError: BigNumber;
        errorInterval: BigNumber;
        interestRateStep: BigNumber;
        maxSteps: BigNumber;
        minRate: BigNumber;
        maxRate: BigNumber;
      }
    >;

    minTimeBetweenUpdates(overrides?: CallOverrides): Promise<BigNumber>;

    positiveInterestRate(overrides?: CallOverrides): Promise<boolean>;

    predictInterestRate(
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { price: BigNumber; rate: BigNumber }>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    removeReferencePool(pool: string, overrides?: CallOverrides): Promise<void>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxRate(max: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setMaxSteps(steps: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setMinRate(min: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stop(overrides?: CallOverrides): Promise<void>;

    stopped(overrides?: CallOverrides): Promise<boolean>;

    update(overrides?: CallOverrides): Promise<void>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    AcceptableErrorUpdated(
      error?: null
    ): TypedEventFilter<[BigNumber], { error: BigNumber }>;

    ErrorIntervalUpdated(
      error?: null
    ): TypedEventFilter<[BigNumber], { error: BigNumber }>;

    InterestRateStepUpdated(
      step?: null
    ): TypedEventFilter<[BigNumber], { step: BigNumber }>;

    MaxRateUpdated(
      max?: null
    ): TypedEventFilter<[BigNumber], { max: BigNumber }>;

    MaxStepsUpdated(
      steps?: null
    ): TypedEventFilter<[BigNumber], { steps: BigNumber }>;

    MinRateUpdated(
      min?: null
    ): TypedEventFilter<[BigNumber], { min: BigNumber }>;

    MinTimeBetweenUpdatesUpdated(
      time?: null
    ): TypedEventFilter<[BigNumber], { time: BigNumber }>;

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

    ReferencePoolAdded(
      pool?: null
    ): TypedEventFilter<[string], { pool: string }>;

    ReferencePoolRemoved(
      pool?: null
    ): TypedEventFilter<[string], { pool: string }>;

    Stopped(): TypedEventFilter<[], {}>;
  };

  estimateGas: {
    addReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    collateralPool(overrides?: CallOverrides): Promise<BigNumber>;

    currentRateData(overrides?: CallOverrides): Promise<BigNumber>;

    deployer(overrides?: CallOverrides): Promise<BigNumber>;

    getReferencePools(overrides?: CallOverrides): Promise<BigNumber>;

    getRewardCount(overrides?: CallOverrides): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      _collateralPool: string,
      _referencePools: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

    interestRateParameters(overrides?: CallOverrides): Promise<BigNumber>;

    minTimeBetweenUpdates(overrides?: CallOverrides): Promise<BigNumber>;

    positiveInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    predictInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxRate(
      max: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxSteps(
      steps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMinRate(
      min: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stopped(overrides?: CallOverrides): Promise<BigNumber>;

    update(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    collateralPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentRateData(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReferencePools(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRewardCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    governor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(
      _collateralPool: string,
      _referencePools: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    interestRateAbsoluteValue(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    interestRateParameters(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minTimeBetweenUpdates(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    positiveInterestRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    predictInterestRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxRate(
      max: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxSteps(
      steps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMinRate(
      min: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stopped(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    update(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validUpdate(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
