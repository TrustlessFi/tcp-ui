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
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface RatesInterface extends ethers.utils.Interface {
  functions: {
    "addReferencePool(address)": FunctionFragment;
    "completeSetup()": FunctionFragment;
    "currentRateData()": FunctionFragment;
    "deployer()": FunctionFragment;
    "getRewardCount()": FunctionFragment;
    "governor()": FunctionFragment;
    "init(address)": FunctionFragment;
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
    "setValidRangeForRawPrices(uint128)": FunctionFragment;
    "stop()": FunctionFragment;
    "stopped()": FunctionFragment;
    "update()": FunctionFragment;
    "validRangeForRawPrices()": FunctionFragment;
    "validUpdate(bytes4)": FunctionFragment;
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
    functionFragment: "currentRateData",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRewardCount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "governor", values?: undefined): string;
  encodeFunctionData(functionFragment: "init", values: [string]): string;
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
  encodeFunctionData(
    functionFragment: "setValidRangeForRawPrices",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "stop", values?: undefined): string;
  encodeFunctionData(functionFragment: "stopped", values?: undefined): string;
  encodeFunctionData(functionFragment: "update", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "validRangeForRawPrices",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "validUpdate",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addReferencePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "completeSetup",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentRateData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
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
  decodeFunctionResult(
    functionFragment: "setValidRangeForRawPrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stop", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stopped", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "update", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "validRangeForRawPrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validUpdate",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(address)": EventFragment;
    "ParameterUpdated128(string,uint128)": EventFragment;
    "ParameterUpdated64(string,uint64)": EventFragment;
    "ParameterUpdatedAddress(string,address)": EventFragment;
    "ParameterUpdatedInt128(string,int128)": EventFragment;
    "RateUpdated(int256,uint256,uint256,uint64)": EventFragment;
    "Stopped()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdated128"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdated64"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdatedAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdatedInt128"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RateUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Stopped"): EventFragment;
}

export class Rates extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: RatesInterface;

  functions: {
    addReferencePool(
      pool: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "addReferencePool(address)"(
      pool: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    completeSetup(overrides?: Overrides): Promise<ContractTransaction>;

    "completeSetup()"(overrides?: Overrides): Promise<ContractTransaction>;

    currentRateData(overrides?: CallOverrides): Promise<{
      rate: BigNumber;
      nextUpdateTime: BigNumber;
      rewardCount: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    "currentRateData()"(overrides?: CallOverrides): Promise<{
      rate: BigNumber;
      nextUpdateTime: BigNumber;
      rewardCount: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    deployer(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "deployer()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    getRewardCount(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "getRewardCount()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    governor(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "governor()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    init(
      _governor: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "init(address)"(
      _governor: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "interestRateAbsoluteValue()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    interestRateParameters(overrides?: CallOverrides): Promise<{
      acceptableError: BigNumber;
      errorInterval: BigNumber;
      interestRateStep: BigNumber;
      maxSteps: BigNumber;
      minRate: BigNumber;
      maxRate: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
    }>;

    "interestRateParameters()"(overrides?: CallOverrides): Promise<{
      acceptableError: BigNumber;
      errorInterval: BigNumber;
      interestRateStep: BigNumber;
      maxSteps: BigNumber;
      minRate: BigNumber;
      maxRate: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
    }>;

    minTimeBetweenUpdates(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "minTimeBetweenUpdates()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    positiveInterestRate(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    "positiveInterestRate()"(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    predictInterestRate(overrides?: CallOverrides): Promise<{
      price: BigNumber;
      rate: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    "predictInterestRate()"(overrides?: CallOverrides): Promise<{
      price: BigNumber;
      rate: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "referencePools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "removeReferencePool(address)"(
      pool: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setAcceptableError(uint128)"(
      error: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setErrorInterval(uint128)"(
      interval: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setInterestRateStep(uint128)"(
      step: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setMaxRate(
      max: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setMaxRate(int128)"(
      max: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setMaxSteps(
      steps: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setMaxSteps(uint64)"(
      steps: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setMinRate(
      min: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setMinRate(int128)"(
      min: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setMinTimeBetweenUpdates(uint64)"(
      time: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setValidRangeForRawPrices(
      range: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setValidRangeForRawPrices(uint128)"(
      range: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    stop(overrides?: Overrides): Promise<ContractTransaction>;

    "stop()"(overrides?: Overrides): Promise<ContractTransaction>;

    stopped(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    "stopped()"(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    update(overrides?: Overrides): Promise<ContractTransaction>;

    "update()"(overrides?: Overrides): Promise<ContractTransaction>;

    validRangeForRawPrices(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "validRangeForRawPrices()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    validUpdate(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    "validUpdate(bytes4)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;
  };

  addReferencePool(
    pool: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "addReferencePool(address)"(
    pool: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  completeSetup(overrides?: Overrides): Promise<ContractTransaction>;

  "completeSetup()"(overrides?: Overrides): Promise<ContractTransaction>;

  currentRateData(overrides?: CallOverrides): Promise<{
    rate: BigNumber;
    nextUpdateTime: BigNumber;
    rewardCount: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
  }>;

  "currentRateData()"(overrides?: CallOverrides): Promise<{
    rate: BigNumber;
    nextUpdateTime: BigNumber;
    rewardCount: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
  }>;

  deployer(overrides?: CallOverrides): Promise<string>;

  "deployer()"(overrides?: CallOverrides): Promise<string>;

  getRewardCount(overrides?: CallOverrides): Promise<BigNumber>;

  "getRewardCount()"(overrides?: CallOverrides): Promise<BigNumber>;

  governor(overrides?: CallOverrides): Promise<string>;

  "governor()"(overrides?: CallOverrides): Promise<string>;

  init(_governor: string, overrides?: Overrides): Promise<ContractTransaction>;

  "init(address)"(
    _governor: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

  "interestRateAbsoluteValue()"(overrides?: CallOverrides): Promise<BigNumber>;

  interestRateParameters(overrides?: CallOverrides): Promise<{
    acceptableError: BigNumber;
    errorInterval: BigNumber;
    interestRateStep: BigNumber;
    maxSteps: BigNumber;
    minRate: BigNumber;
    maxRate: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
    5: BigNumber;
  }>;

  "interestRateParameters()"(overrides?: CallOverrides): Promise<{
    acceptableError: BigNumber;
    errorInterval: BigNumber;
    interestRateStep: BigNumber;
    maxSteps: BigNumber;
    minRate: BigNumber;
    maxRate: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
    5: BigNumber;
  }>;

  minTimeBetweenUpdates(overrides?: CallOverrides): Promise<BigNumber>;

  "minTimeBetweenUpdates()"(overrides?: CallOverrides): Promise<BigNumber>;

  positiveInterestRate(overrides?: CallOverrides): Promise<boolean>;

  "positiveInterestRate()"(overrides?: CallOverrides): Promise<boolean>;

  predictInterestRate(overrides?: CallOverrides): Promise<{
    price: BigNumber;
    rate: BigNumber;
    0: BigNumber;
    1: BigNumber;
  }>;

  "predictInterestRate()"(overrides?: CallOverrides): Promise<{
    price: BigNumber;
    rate: BigNumber;
    0: BigNumber;
    1: BigNumber;
  }>;

  referencePools(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "referencePools(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  removeReferencePool(
    pool: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "removeReferencePool(address)"(
    pool: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setAcceptableError(
    error: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setAcceptableError(uint128)"(
    error: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setErrorInterval(
    interval: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setErrorInterval(uint128)"(
    interval: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setInterestRateStep(
    step: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setInterestRateStep(uint128)"(
    step: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setMaxRate(
    max: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setMaxRate(int128)"(
    max: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setMaxSteps(
    steps: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setMaxSteps(uint64)"(
    steps: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setMinRate(
    min: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setMinRate(int128)"(
    min: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setMinTimeBetweenUpdates(
    time: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setMinTimeBetweenUpdates(uint64)"(
    time: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setValidRangeForRawPrices(
    range: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setValidRangeForRawPrices(uint128)"(
    range: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  stop(overrides?: Overrides): Promise<ContractTransaction>;

  "stop()"(overrides?: Overrides): Promise<ContractTransaction>;

  stopped(overrides?: CallOverrides): Promise<boolean>;

  "stopped()"(overrides?: CallOverrides): Promise<boolean>;

  update(overrides?: Overrides): Promise<ContractTransaction>;

  "update()"(overrides?: Overrides): Promise<ContractTransaction>;

  validRangeForRawPrices(overrides?: CallOverrides): Promise<BigNumber>;

  "validRangeForRawPrices()"(overrides?: CallOverrides): Promise<BigNumber>;

  validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  "validUpdate(bytes4)"(
    arg0: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    addReferencePool(pool: string, overrides?: CallOverrides): Promise<void>;

    "addReferencePool(address)"(
      pool: string,
      overrides?: CallOverrides
    ): Promise<void>;

    completeSetup(overrides?: CallOverrides): Promise<void>;

    "completeSetup()"(overrides?: CallOverrides): Promise<void>;

    currentRateData(overrides?: CallOverrides): Promise<{
      rate: BigNumber;
      nextUpdateTime: BigNumber;
      rewardCount: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    "currentRateData()"(overrides?: CallOverrides): Promise<{
      rate: BigNumber;
      nextUpdateTime: BigNumber;
      rewardCount: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    deployer(overrides?: CallOverrides): Promise<string>;

    "deployer()"(overrides?: CallOverrides): Promise<string>;

    getRewardCount(overrides?: CallOverrides): Promise<BigNumber>;

    "getRewardCount()"(overrides?: CallOverrides): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<string>;

    "governor()"(overrides?: CallOverrides): Promise<string>;

    init(_governor: string, overrides?: CallOverrides): Promise<void>;

    "init(address)"(
      _governor: string,
      overrides?: CallOverrides
    ): Promise<void>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

    "interestRateAbsoluteValue()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    interestRateParameters(overrides?: CallOverrides): Promise<{
      acceptableError: BigNumber;
      errorInterval: BigNumber;
      interestRateStep: BigNumber;
      maxSteps: BigNumber;
      minRate: BigNumber;
      maxRate: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
    }>;

    "interestRateParameters()"(overrides?: CallOverrides): Promise<{
      acceptableError: BigNumber;
      errorInterval: BigNumber;
      interestRateStep: BigNumber;
      maxSteps: BigNumber;
      minRate: BigNumber;
      maxRate: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
    }>;

    minTimeBetweenUpdates(overrides?: CallOverrides): Promise<BigNumber>;

    "minTimeBetweenUpdates()"(overrides?: CallOverrides): Promise<BigNumber>;

    positiveInterestRate(overrides?: CallOverrides): Promise<boolean>;

    "positiveInterestRate()"(overrides?: CallOverrides): Promise<boolean>;

    predictInterestRate(overrides?: CallOverrides): Promise<{
      price: BigNumber;
      rate: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    "predictInterestRate()"(overrides?: CallOverrides): Promise<{
      price: BigNumber;
      rate: BigNumber;
      0: BigNumber;
      1: BigNumber;
    }>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "referencePools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    removeReferencePool(pool: string, overrides?: CallOverrides): Promise<void>;

    "removeReferencePool(address)"(
      pool: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setAcceptableError(uint128)"(
      error: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setErrorInterval(uint128)"(
      interval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setInterestRateStep(uint128)"(
      step: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxRate(max: BigNumberish, overrides?: CallOverrides): Promise<void>;

    "setMaxRate(int128)"(
      max: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxSteps(steps: BigNumberish, overrides?: CallOverrides): Promise<void>;

    "setMaxSteps(uint64)"(
      steps: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMinRate(min: BigNumberish, overrides?: CallOverrides): Promise<void>;

    "setMinRate(int128)"(
      min: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setMinTimeBetweenUpdates(uint64)"(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setValidRangeForRawPrices(
      range: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setValidRangeForRawPrices(uint128)"(
      range: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stop(overrides?: CallOverrides): Promise<void>;

    "stop()"(overrides?: CallOverrides): Promise<void>;

    stopped(overrides?: CallOverrides): Promise<boolean>;

    "stopped()"(overrides?: CallOverrides): Promise<boolean>;

    update(overrides?: CallOverrides): Promise<void>;

    "update()"(overrides?: CallOverrides): Promise<void>;

    validRangeForRawPrices(overrides?: CallOverrides): Promise<BigNumber>;

    "validRangeForRawPrices()"(overrides?: CallOverrides): Promise<BigNumber>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    "validUpdate(bytes4)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    Initialized(governor: string | null): EventFilter;

    ParameterUpdated128(paramName: string | null, value: null): EventFilter;

    ParameterUpdated64(paramName: string | null, value: null): EventFilter;

    ParameterUpdatedAddress(
      paramName: string | null,
      addr: string | null
    ): EventFilter;

    ParameterUpdatedInt128(paramName: string | null, value: null): EventFilter;

    RateUpdated(
      interestRate: null,
      price: null,
      rewardCount: null,
      nextUpdateTime: null
    ): EventFilter;

    Stopped(): EventFilter;
  };

  estimateGas: {
    addReferencePool(pool: string, overrides?: Overrides): Promise<BigNumber>;

    "addReferencePool(address)"(
      pool: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    completeSetup(overrides?: Overrides): Promise<BigNumber>;

    "completeSetup()"(overrides?: Overrides): Promise<BigNumber>;

    currentRateData(overrides?: CallOverrides): Promise<BigNumber>;

    "currentRateData()"(overrides?: CallOverrides): Promise<BigNumber>;

    deployer(overrides?: CallOverrides): Promise<BigNumber>;

    "deployer()"(overrides?: CallOverrides): Promise<BigNumber>;

    getRewardCount(overrides?: CallOverrides): Promise<BigNumber>;

    "getRewardCount()"(overrides?: CallOverrides): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<BigNumber>;

    "governor()"(overrides?: CallOverrides): Promise<BigNumber>;

    init(_governor: string, overrides?: Overrides): Promise<BigNumber>;

    "init(address)"(
      _governor: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    interestRateAbsoluteValue(overrides?: CallOverrides): Promise<BigNumber>;

    "interestRateAbsoluteValue()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    interestRateParameters(overrides?: CallOverrides): Promise<BigNumber>;

    "interestRateParameters()"(overrides?: CallOverrides): Promise<BigNumber>;

    minTimeBetweenUpdates(overrides?: CallOverrides): Promise<BigNumber>;

    "minTimeBetweenUpdates()"(overrides?: CallOverrides): Promise<BigNumber>;

    positiveInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    "positiveInterestRate()"(overrides?: CallOverrides): Promise<BigNumber>;

    predictInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    "predictInterestRate()"(overrides?: CallOverrides): Promise<BigNumber>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "referencePools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "removeReferencePool(address)"(
      pool: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setAcceptableError(uint128)"(
      error: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setErrorInterval(uint128)"(
      interval: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setInterestRateStep(uint128)"(
      step: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setMaxRate(max: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

    "setMaxRate(int128)"(
      max: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setMaxSteps(steps: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

    "setMaxSteps(uint64)"(
      steps: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setMinRate(min: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

    "setMinRate(int128)"(
      min: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setMinTimeBetweenUpdates(uint64)"(
      time: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setValidRangeForRawPrices(
      range: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setValidRangeForRawPrices(uint128)"(
      range: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    stop(overrides?: Overrides): Promise<BigNumber>;

    "stop()"(overrides?: Overrides): Promise<BigNumber>;

    stopped(overrides?: CallOverrides): Promise<BigNumber>;

    "stopped()"(overrides?: CallOverrides): Promise<BigNumber>;

    update(overrides?: Overrides): Promise<BigNumber>;

    "update()"(overrides?: Overrides): Promise<BigNumber>;

    validRangeForRawPrices(overrides?: CallOverrides): Promise<BigNumber>;

    "validRangeForRawPrices()"(overrides?: CallOverrides): Promise<BigNumber>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "validUpdate(bytes4)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addReferencePool(
      pool: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "addReferencePool(address)"(
      pool: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    completeSetup(overrides?: Overrides): Promise<PopulatedTransaction>;

    "completeSetup()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    currentRateData(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "currentRateData()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "deployer()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRewardCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getRewardCount()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    governor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "governor()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(
      _governor: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "init(address)"(
      _governor: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    interestRateAbsoluteValue(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "interestRateAbsoluteValue()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    interestRateParameters(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "interestRateParameters()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minTimeBetweenUpdates(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "minTimeBetweenUpdates()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    positiveInterestRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "positiveInterestRate()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    predictInterestRate(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "predictInterestRate()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    referencePools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "referencePools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeReferencePool(
      pool: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "removeReferencePool(address)"(
      pool: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setAcceptableError(
      error: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setAcceptableError(uint128)"(
      error: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setErrorInterval(
      interval: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setErrorInterval(uint128)"(
      interval: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setInterestRateStep(
      step: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setInterestRateStep(uint128)"(
      step: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setMaxRate(
      max: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setMaxRate(int128)"(
      max: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setMaxSteps(
      steps: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setMaxSteps(uint64)"(
      steps: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setMinRate(
      min: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setMinRate(int128)"(
      min: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setMinTimeBetweenUpdates(
      time: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setMinTimeBetweenUpdates(uint64)"(
      time: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setValidRangeForRawPrices(
      range: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setValidRangeForRawPrices(uint128)"(
      range: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    stop(overrides?: Overrides): Promise<PopulatedTransaction>;

    "stop()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    stopped(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "stopped()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    update(overrides?: Overrides): Promise<PopulatedTransaction>;

    "update()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    validRangeForRawPrices(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "validRangeForRawPrices()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validUpdate(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "validUpdate(bytes4)"(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
