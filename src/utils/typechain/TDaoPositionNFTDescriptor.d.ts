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

interface TDaoPositionNFTDescriptorInterface extends ethers.utils.Interface {
  functions: {
    "getTokenURI(uint64)": FunctionFragment;
    "tDao()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getTokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "tDao", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "getTokenURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tDao", data: BytesLike): Result;

  events: {};
}

export class TDaoPositionNFTDescriptor extends BaseContract {
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

  interface: TDaoPositionNFTDescriptorInterface;

  functions: {
    getTokenURI(
      positionID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    tDao(overrides?: CallOverrides): Promise<[string]>;
  };

  getTokenURI(
    positionID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  tDao(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getTokenURI(
      positionID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    tDao(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getTokenURI(
      positionID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tDao(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getTokenURI(
      positionID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tDao(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}