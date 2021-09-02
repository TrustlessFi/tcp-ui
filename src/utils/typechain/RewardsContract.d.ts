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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface RewardsContractInterface extends ethers.utils.Interface {
  functions: {
    "countPools()": FunctionFragment;
    "poolConfigForPoolID(uint16)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "countPools",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "poolConfigForPoolID",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "countPools", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "poolConfigForPoolID",
    data: BytesLike
  ): Result;

  events: {};
}

export class RewardsContract extends BaseContract {
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

  interface: RewardsContractInterface;

  functions: {
    countPools(overrides?: CallOverrides): Promise<[number]>;

    poolConfigForPoolID(
      poolID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [[string, BigNumber] & { pool: string; rewardsPortion: BigNumber }]
    >;
  };

  countPools(overrides?: CallOverrides): Promise<number>;

  poolConfigForPoolID(
    poolID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { pool: string; rewardsPortion: BigNumber }>;

  callStatic: {
    countPools(overrides?: CallOverrides): Promise<number>;

    poolConfigForPoolID(
      poolID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber] & { pool: string; rewardsPortion: BigNumber }
    >;
  };

  filters: {};

  estimateGas: {
    countPools(overrides?: CallOverrides): Promise<BigNumber>;

    poolConfigForPoolID(
      poolID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    countPools(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolConfigForPoolID(
      poolID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}