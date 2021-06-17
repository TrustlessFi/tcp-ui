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

interface TimeTestableInterface extends ethers.utils.Interface {
  functions: {
    "currentPeriod()": FunctionFragment;
    "currentTime()": FunctionFragment;
    "firstPeriod()": FunctionFragment;
    "futureTime(uint64)": FunctionFragment;
    "getPeriodLength()": FunctionFragment;
    "periodLength()": FunctionFragment;
    "periodToTime(uint64)": FunctionFragment;
    "timeToPeriod(uint64)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "currentPeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "currentTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "firstPeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "futureTime",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPeriodLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "periodLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "periodToTime",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "timeToPeriod",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "currentPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "firstPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "futureTime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPeriodLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "periodLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "periodToTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "timeToPeriod",
    data: BytesLike
  ): Result;

  events: {};
}

export class TimeTestable extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: TimeTestableInterface;

  functions: {
    currentPeriod(overrides?: CallOverrides): Promise<{
      period: BigNumber;
      0: BigNumber;
    }>;

    "currentPeriod()"(overrides?: CallOverrides): Promise<{
      period: BigNumber;
      0: BigNumber;
    }>;

    currentTime(overrides?: CallOverrides): Promise<{
      time: BigNumber;
      0: BigNumber;
    }>;

    "currentTime()"(overrides?: CallOverrides): Promise<{
      time: BigNumber;
      0: BigNumber;
    }>;

    firstPeriod(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "firstPeriod()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    futureTime(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      time: BigNumber;
      0: BigNumber;
    }>;

    "futureTime(uint64)"(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      time: BigNumber;
      0: BigNumber;
    }>;

    getPeriodLength(overrides?: CallOverrides): Promise<{
      length: BigNumber;
      0: BigNumber;
    }>;

    "getPeriodLength()"(overrides?: CallOverrides): Promise<{
      length: BigNumber;
      0: BigNumber;
    }>;

    periodLength(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "periodLength()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    periodToTime(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      time: BigNumber;
      0: BigNumber;
    }>;

    "periodToTime(uint64)"(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      time: BigNumber;
      0: BigNumber;
    }>;

    timeToPeriod(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      period: BigNumber;
      0: BigNumber;
    }>;

    "timeToPeriod(uint64)"(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      period: BigNumber;
      0: BigNumber;
    }>;
  };

  currentPeriod(overrides?: CallOverrides): Promise<BigNumber>;

  "currentPeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

  currentTime(overrides?: CallOverrides): Promise<BigNumber>;

  "currentTime()"(overrides?: CallOverrides): Promise<BigNumber>;

  firstPeriod(overrides?: CallOverrides): Promise<BigNumber>;

  "firstPeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

  futureTime(
    addition: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "futureTime(uint64)"(
    addition: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPeriodLength(overrides?: CallOverrides): Promise<BigNumber>;

  "getPeriodLength()"(overrides?: CallOverrides): Promise<BigNumber>;

  periodLength(overrides?: CallOverrides): Promise<BigNumber>;

  "periodLength()"(overrides?: CallOverrides): Promise<BigNumber>;

  periodToTime(
    period: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "periodToTime(uint64)"(
    period: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  timeToPeriod(
    time: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "timeToPeriod(uint64)"(
    time: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    currentPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    "currentPeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

    currentTime(overrides?: CallOverrides): Promise<BigNumber>;

    "currentTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    firstPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    "firstPeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

    futureTime(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "futureTime(uint64)"(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPeriodLength(overrides?: CallOverrides): Promise<BigNumber>;

    "getPeriodLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    periodLength(overrides?: CallOverrides): Promise<BigNumber>;

    "periodLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    periodToTime(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "periodToTime(uint64)"(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    timeToPeriod(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "timeToPeriod(uint64)"(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    currentPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    "currentPeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

    currentTime(overrides?: CallOverrides): Promise<BigNumber>;

    "currentTime()"(overrides?: CallOverrides): Promise<BigNumber>;

    firstPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    "firstPeriod()"(overrides?: CallOverrides): Promise<BigNumber>;

    futureTime(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "futureTime(uint64)"(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPeriodLength(overrides?: CallOverrides): Promise<BigNumber>;

    "getPeriodLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    periodLength(overrides?: CallOverrides): Promise<BigNumber>;

    "periodLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    periodToTime(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "periodToTime(uint64)"(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    timeToPeriod(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "timeToPeriod(uint64)"(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    currentPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "currentPeriod()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "currentTime()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    firstPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "firstPeriod()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    futureTime(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "futureTime(uint64)"(
      addition: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPeriodLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getPeriodLength()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    periodLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "periodLength()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    periodToTime(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "periodToTime(uint64)"(
      period: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    timeToPeriod(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "timeToPeriod(uint64)"(
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
