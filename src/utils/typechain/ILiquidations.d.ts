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

interface ILiquidationsInterface extends ethers.utils.Interface {
  functions: {
    "stop()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "stop", values?: undefined): string;

  decodeFunctionResult(functionFragment: "stop", data: BytesLike): Result;

  events: {
    "CoveredUnbackedDebt(uint256,uint256)": EventFragment;
    "DiscoveryIncentiveUpdated(uint64)": EventFragment;
    "Liquidated(uint256,uint256)": EventFragment;
    "LiquidationIncentiveUpdated(uint64)": EventFragment;
    "MaxRewardsRatioUpdated(uint64)": EventFragment;
    "MinLiquidationIncentiveUpdated(uint64)": EventFragment;
    "UndercollatPositionDiscovered(uint64,uint256,uint256,uint256)": EventFragment;
    "twapDurationUpdated(uint32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CoveredUnbackedDebt"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DiscoveryIncentiveUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Liquidated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "LiquidationIncentiveUpdated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxRewardsRatioUpdated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "MinLiquidationIncentiveUpdated"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "UndercollatPositionDiscovered"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "twapDurationUpdated"): EventFragment;
}

export class ILiquidations extends BaseContract {
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

  interface: ILiquidationsInterface;

  functions: {
    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  stop(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    stop(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    CoveredUnbackedDebt(
      price?: null,
      amountCovered?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { price: BigNumber; amountCovered: BigNumber }
    >;

    DiscoveryIncentiveUpdated(
      incentive?: null
    ): TypedEventFilter<[BigNumber], { incentive: BigNumber }>;

    Liquidated(
      baseTokensToRepay?: null,
      collateralToReceive?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { baseTokensToRepay: BigNumber; collateralToReceive: BigNumber }
    >;

    LiquidationIncentiveUpdated(
      incentive?: null
    ): TypedEventFilter<[BigNumber], { incentive: BigNumber }>;

    MaxRewardsRatioUpdated(
      ratio?: null
    ): TypedEventFilter<[BigNumber], { ratio: BigNumber }>;

    MinLiquidationIncentiveUpdated(
      incentive?: null
    ): TypedEventFilter<[BigNumber], { incentive: BigNumber }>;

    UndercollatPositionDiscovered(
      positionID?: BigNumberish | null,
      debtCount?: null,
      collateralCount?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, BigNumber],
      {
        positionID: BigNumber;
        debtCount: BigNumber;
        collateralCount: BigNumber;
        price: BigNumber;
      }
    >;

    twapDurationUpdated(
      duration?: null
    ): TypedEventFilter<[number], { duration: number }>;
  };

  estimateGas: {
    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    stop(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
