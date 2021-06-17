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

interface IMarketInterface extends ethers.utils.Interface {
  functions: {
    "accrueInterest()": FunctionFragment;
    "collateralizationRequirement()": FunctionFragment;
    "completeSetup()": FunctionFragment;
    "lastPeriodGlobalInterestAccrued()": FunctionFragment;
    "stop()": FunctionFragment;
    "systemGetUpdatedPosition(uint64)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accrueInterest",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "collateralizationRequirement",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "completeSetup",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastPeriodGlobalInterestAccrued",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "stop", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "systemGetUpdatedPosition",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "accrueInterest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collateralizationRequirement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "completeSetup",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastPeriodGlobalInterestAccrued",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stop", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "systemGetUpdatedPosition",
    data: BytesLike
  ): Result;

  events: {
    "InterestAccrued(uint64,uint64,uint256,uint256,uint256,uint256)": EventFragment;
    "NewPositionCreated(address,uint64)": EventFragment;
    "ParameterUpdated(string,uint256)": EventFragment;
    "ParameterUpdated64(string,uint64)": EventFragment;
    "ParameterUpdatedAddress(string,address)": EventFragment;
    "PositionAdjusted(uint64,int256,int256)": EventFragment;
    "PositionUpdated(uint256,uint64,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "InterestAccrued"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewPositionCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdated64"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ParameterUpdatedAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PositionAdjusted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PositionUpdated"): EventFragment;
}

export class IMarket extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IMarketInterface;

  functions: {
    accrueInterest(overrides?: Overrides): Promise<ContractTransaction>;

    "accrueInterest()"(overrides?: Overrides): Promise<ContractTransaction>;

    collateralizationRequirement(overrides?: CallOverrides): Promise<{
      ratio: BigNumber;
      0: BigNumber;
    }>;

    "collateralizationRequirement()"(overrides?: CallOverrides): Promise<{
      ratio: BigNumber;
      0: BigNumber;
    }>;

    completeSetup(overrides?: Overrides): Promise<ContractTransaction>;

    "completeSetup()"(overrides?: Overrides): Promise<ContractTransaction>;

    lastPeriodGlobalInterestAccrued(overrides?: CallOverrides): Promise<{
      period: BigNumber;
      0: BigNumber;
    }>;

    "lastPeriodGlobalInterestAccrued()"(overrides?: CallOverrides): Promise<{
      period: BigNumber;
      0: BigNumber;
    }>;

    stop(overrides?: Overrides): Promise<ContractTransaction>;

    "stop()"(overrides?: Overrides): Promise<ContractTransaction>;

    systemGetUpdatedPosition(
      positionID: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "systemGetUpdatedPosition(uint64)"(
      positionID: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  accrueInterest(overrides?: Overrides): Promise<ContractTransaction>;

  "accrueInterest()"(overrides?: Overrides): Promise<ContractTransaction>;

  collateralizationRequirement(overrides?: CallOverrides): Promise<BigNumber>;

  "collateralizationRequirement()"(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  completeSetup(overrides?: Overrides): Promise<ContractTransaction>;

  "completeSetup()"(overrides?: Overrides): Promise<ContractTransaction>;

  lastPeriodGlobalInterestAccrued(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "lastPeriodGlobalInterestAccrued()"(
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  stop(overrides?: Overrides): Promise<ContractTransaction>;

  "stop()"(overrides?: Overrides): Promise<ContractTransaction>;

  systemGetUpdatedPosition(
    positionID: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "systemGetUpdatedPosition(uint64)"(
    positionID: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    accrueInterest(overrides?: CallOverrides): Promise<void>;

    "accrueInterest()"(overrides?: CallOverrides): Promise<void>;

    collateralizationRequirement(overrides?: CallOverrides): Promise<BigNumber>;

    "collateralizationRequirement()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    completeSetup(overrides?: CallOverrides): Promise<void>;

    "completeSetup()"(overrides?: CallOverrides): Promise<void>;

    lastPeriodGlobalInterestAccrued(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "lastPeriodGlobalInterestAccrued()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stop(overrides?: CallOverrides): Promise<void>;

    "stop()"(overrides?: CallOverrides): Promise<void>;

    systemGetUpdatedPosition(
      positionID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      startCumulativeDebt: BigNumber;
      collateral: BigNumber;
      debt: BigNumber;
      startDebtExchangeRate: BigNumber;
      startTCPRewards: BigNumber;
      lastTimeUpdated: BigNumber;
      lastBorrowTime: BigNumber;
      tick: number;
      tickSet: boolean;
      tickIndex: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
      6: BigNumber;
      7: number;
      8: boolean;
      9: BigNumber;
    }>;

    "systemGetUpdatedPosition(uint64)"(
      positionID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      startCumulativeDebt: BigNumber;
      collateral: BigNumber;
      debt: BigNumber;
      startDebtExchangeRate: BigNumber;
      startTCPRewards: BigNumber;
      lastTimeUpdated: BigNumber;
      lastBorrowTime: BigNumber;
      tick: number;
      tickSet: boolean;
      tickIndex: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
      6: BigNumber;
      7: number;
      8: boolean;
      9: BigNumber;
    }>;
  };

  filters: {
    InterestAccrued(
      period: BigNumberish | null,
      periods: null,
      newDebt: null,
      rewardCount: null,
      cumulativeDebt: null,
      debtExchangeRate: null
    ): EventFilter;

    NewPositionCreated(
      creator: string | null,
      positionID: BigNumberish | null
    ): EventFilter;

    ParameterUpdated(paramName: string | null, value: null): EventFilter;

    ParameterUpdated64(paramName: string | null, value: null): EventFilter;

    ParameterUpdatedAddress(paramName: string | null, value: null): EventFilter;

    PositionAdjusted(
      positionID: BigNumberish | null,
      debtChange: null,
      collateralChange: null
    ): EventFilter;

    PositionUpdated(
      positionID: BigNumberish | null,
      period: BigNumberish | null,
      debtAfter: null,
      tcpRewards: null
    ): EventFilter;
  };

  estimateGas: {
    accrueInterest(overrides?: Overrides): Promise<BigNumber>;

    "accrueInterest()"(overrides?: Overrides): Promise<BigNumber>;

    collateralizationRequirement(overrides?: CallOverrides): Promise<BigNumber>;

    "collateralizationRequirement()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    completeSetup(overrides?: Overrides): Promise<BigNumber>;

    "completeSetup()"(overrides?: Overrides): Promise<BigNumber>;

    lastPeriodGlobalInterestAccrued(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "lastPeriodGlobalInterestAccrued()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stop(overrides?: Overrides): Promise<BigNumber>;

    "stop()"(overrides?: Overrides): Promise<BigNumber>;

    systemGetUpdatedPosition(
      positionID: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "systemGetUpdatedPosition(uint64)"(
      positionID: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    accrueInterest(overrides?: Overrides): Promise<PopulatedTransaction>;

    "accrueInterest()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    collateralizationRequirement(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "collateralizationRequirement()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    completeSetup(overrides?: Overrides): Promise<PopulatedTransaction>;

    "completeSetup()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    lastPeriodGlobalInterestAccrued(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "lastPeriodGlobalInterestAccrued()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stop(overrides?: Overrides): Promise<PopulatedTransaction>;

    "stop()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    systemGetUpdatedPosition(
      positionID: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "systemGetUpdatedPosition(uint64)"(
      positionID: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
