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

interface PricesInterface extends ethers.utils.Interface {
  functions: {
    "calculateInstantCollateralPrice(uint32)": FunctionFragment;
    "calculateInstantTwappedPrice(address,uint32)": FunctionFragment;
    "calculateInstantTwappedTick(address,uint32)": FunctionFragment;
    "calculateTwappedPrice(address,bool)": FunctionFragment;
    "collateralPool()": FunctionFragment;
    "deployer()": FunctionFragment;
    "getRealHueCountForSinglePoolPosition(address,int24,int24,int24,uint128,uint32)": FunctionFragment;
    "governor()": FunctionFragment;
    "hueTcpPrice(uint32)": FunctionFragment;
    "init(address,address)": FunctionFragment;
    "initializePool(address)": FunctionFragment;
    "initializeWethPool(address)": FunctionFragment;
    "isPoolInitialized(address)": FunctionFragment;
    "priceInfo(address)": FunctionFragment;
    "protocolPool()": FunctionFragment;
    "stop()": FunctionFragment;
    "stopped()": FunctionFragment;
    "systemObtainReferencePrice(address)": FunctionFragment;
    "validUpdate(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculateInstantCollateralPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateInstantTwappedPrice",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateInstantTwappedTick",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateTwappedPrice",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "collateralPool",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "deployer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getRealHueCountForSinglePoolPosition",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "governor", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "hueTcpPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initializePool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "initializeWethPool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isPoolInitialized",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "priceInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "protocolPool",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "stop", values?: undefined): string;
  encodeFunctionData(functionFragment: "stopped", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "systemObtainReferencePrice",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "validUpdate",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "calculateInstantCollateralPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateInstantTwappedPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateInstantTwappedTick",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateTwappedPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collateralPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deployer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRealHueCountForSinglePoolPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "governor", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hueTcpPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initializePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initializeWethPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isPoolInitialized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "priceInfo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stop", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stopped", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "systemObtainReferencePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validUpdate",
    data: BytesLike
  ): Result;

  events: {
    "PriceUpdated(address,uint256,int24)": EventFragment;
    "Stopped()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PriceUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Stopped"): EventFragment;
}

export class Prices extends BaseContract {
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

  interface: PricesInterface;

  functions: {
    calculateInstantCollateralPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculateInstantTwappedPrice(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculateInstantTwappedTick(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number] & { tick: number }>;

    calculateTwappedPrice(
      pool: string,
      normalizeDecimals: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { price: BigNumber }>;

    collateralPool(overrides?: CallOverrides): Promise<[string]>;

    deployer(overrides?: CallOverrides): Promise<[string]>;

    getRealHueCountForSinglePoolPosition(
      pool: string,
      tick: BigNumberish,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      liquidity: BigNumberish,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    governor(overrides?: CallOverrides): Promise<[string]>;

    hueTcpPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    init(
      _collateralPool: string,
      _protocolPool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initializePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initializeWethPool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isPoolInitialized(
      pool: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    priceInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, number, number, boolean, boolean] & {
        startTime: BigNumber;
        tickCumulative: BigNumber;
        tick: number;
        otherTokenDecimals: number;
        isToken0: boolean;
        valid: boolean;
      }
    >;

    protocolPool(overrides?: CallOverrides): Promise<[string]>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stopped(overrides?: CallOverrides): Promise<[boolean]>;

    systemObtainReferencePrice(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
  };

  calculateInstantCollateralPrice(
    twapDuration: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculateInstantTwappedPrice(
    pool: string,
    twapDuration: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculateInstantTwappedTick(
    pool: string,
    twapDuration: BigNumberish,
    overrides?: CallOverrides
  ): Promise<number>;

  calculateTwappedPrice(
    pool: string,
    normalizeDecimals: boolean,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  collateralPool(overrides?: CallOverrides): Promise<string>;

  deployer(overrides?: CallOverrides): Promise<string>;

  getRealHueCountForSinglePoolPosition(
    pool: string,
    tick: BigNumberish,
    tickLower: BigNumberish,
    tickUpper: BigNumberish,
    liquidity: BigNumberish,
    twapDuration: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  governor(overrides?: CallOverrides): Promise<string>;

  hueTcpPrice(
    twapDuration: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  init(
    _collateralPool: string,
    _protocolPool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initializePool(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initializeWethPool(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isPoolInitialized(pool: string, overrides?: CallOverrides): Promise<boolean>;

  priceInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, number, number, boolean, boolean] & {
      startTime: BigNumber;
      tickCumulative: BigNumber;
      tick: number;
      otherTokenDecimals: number;
      isToken0: boolean;
      valid: boolean;
    }
  >;

  protocolPool(overrides?: CallOverrides): Promise<string>;

  stop(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stopped(overrides?: CallOverrides): Promise<boolean>;

  systemObtainReferencePrice(
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    calculateInstantCollateralPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateInstantTwappedPrice(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateInstantTwappedTick(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<number>;

    calculateTwappedPrice(
      pool: string,
      normalizeDecimals: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collateralPool(overrides?: CallOverrides): Promise<string>;

    deployer(overrides?: CallOverrides): Promise<string>;

    getRealHueCountForSinglePoolPosition(
      pool: string,
      tick: BigNumberish,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      liquidity: BigNumberish,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<string>;

    hueTcpPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    init(
      _collateralPool: string,
      _protocolPool: string,
      overrides?: CallOverrides
    ): Promise<void>;

    initializePool(pool: string, overrides?: CallOverrides): Promise<void>;

    initializeWethPool(pool: string, overrides?: CallOverrides): Promise<void>;

    isPoolInitialized(
      pool: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    priceInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, number, number, boolean, boolean] & {
        startTime: BigNumber;
        tickCumulative: BigNumber;
        tick: number;
        otherTokenDecimals: number;
        isToken0: boolean;
        valid: boolean;
      }
    >;

    protocolPool(overrides?: CallOverrides): Promise<string>;

    stop(overrides?: CallOverrides): Promise<void>;

    stopped(overrides?: CallOverrides): Promise<boolean>;

    systemObtainReferencePrice(
      pool: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    PriceUpdated(
      pool?: string | null,
      price?: null,
      tick?: null
    ): TypedEventFilter<
      [string, BigNumber, number],
      { pool: string; price: BigNumber; tick: number }
    >;

    Stopped(): TypedEventFilter<[], {}>;
  };

  estimateGas: {
    calculateInstantCollateralPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateInstantTwappedPrice(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateInstantTwappedTick(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateTwappedPrice(
      pool: string,
      normalizeDecimals: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    collateralPool(overrides?: CallOverrides): Promise<BigNumber>;

    deployer(overrides?: CallOverrides): Promise<BigNumber>;

    getRealHueCountForSinglePoolPosition(
      pool: string,
      tick: BigNumberish,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      liquidity: BigNumberish,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<BigNumber>;

    hueTcpPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    init(
      _collateralPool: string,
      _protocolPool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initializePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initializeWethPool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isPoolInitialized(
      pool: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    priceInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    protocolPool(overrides?: CallOverrides): Promise<BigNumber>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stopped(overrides?: CallOverrides): Promise<BigNumber>;

    systemObtainReferencePrice(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validUpdate(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    calculateInstantCollateralPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateInstantTwappedPrice(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateInstantTwappedTick(
      pool: string,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateTwappedPrice(
      pool: string,
      normalizeDecimals: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    collateralPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRealHueCountForSinglePoolPosition(
      pool: string,
      tick: BigNumberish,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      liquidity: BigNumberish,
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    governor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    hueTcpPrice(
      twapDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    init(
      _collateralPool: string,
      _protocolPool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initializePool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initializeWethPool(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isPoolInitialized(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    priceInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    protocolPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stopped(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    systemObtainReferencePrice(
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validUpdate(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
