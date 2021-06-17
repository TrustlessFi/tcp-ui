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

interface IEnforcedDecentralizationInterface extends ethers.utils.Interface {
  functions: {
    "currentPhase()": FunctionFragment;
    "requireValidAction(address,string)": FunctionFragment;
    "setPhaseOneStartTime(uint64)": FunctionFragment;
    "transferEmergencyShutdownTokens(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "currentPhase",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requireValidAction",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPhaseOneStartTime",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferEmergencyShutdownTokens",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "currentPhase",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requireValidAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPhaseOneStartTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferEmergencyShutdownTokens",
    data: BytesLike
  ): Result;

  events: {
    "ActionBlacklisted(string)": EventFragment;
    "PhaseOneStartTimeSet(uint64)": EventFragment;
    "PhaseStartDelayed(uint8,uint64,uint8)": EventFragment;
    "UpdateLockDelayed(uint64,uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActionBlacklisted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PhaseOneStartTimeSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PhaseStartDelayed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdateLockDelayed"): EventFragment;
}

export class IEnforcedDecentralization extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IEnforcedDecentralizationInterface;

  functions: {
    currentPhase(overrides?: CallOverrides): Promise<{
      0: number;
    }>;

    "currentPhase()"(overrides?: CallOverrides): Promise<{
      0: number;
    }>;

    requireValidAction(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<{
      0: void;
    }>;

    "requireValidAction(address,string)"(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<{
      0: void;
    }>;

    setPhaseOneStartTime(
      phaseOneStartTime: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setPhaseOneStartTime(uint64)"(
      phaseOneStartTime: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    transferEmergencyShutdownTokens(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transferEmergencyShutdownTokens(address,uint256)"(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  currentPhase(overrides?: CallOverrides): Promise<number>;

  "currentPhase()"(overrides?: CallOverrides): Promise<number>;

  requireValidAction(
    target: string,
    signature: string,
    overrides?: CallOverrides
  ): Promise<void>;

  "requireValidAction(address,string)"(
    target: string,
    signature: string,
    overrides?: CallOverrides
  ): Promise<void>;

  setPhaseOneStartTime(
    phaseOneStartTime: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setPhaseOneStartTime(uint64)"(
    phaseOneStartTime: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  transferEmergencyShutdownTokens(
    dest: string,
    count: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transferEmergencyShutdownTokens(address,uint256)"(
    dest: string,
    count: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    currentPhase(overrides?: CallOverrides): Promise<number>;

    "currentPhase()"(overrides?: CallOverrides): Promise<number>;

    requireValidAction(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "requireValidAction(address,string)"(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setPhaseOneStartTime(
      phaseOneStartTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "setPhaseOneStartTime(uint64)"(
      phaseOneStartTime: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferEmergencyShutdownTokens(
      dest: string,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferEmergencyShutdownTokens(address,uint256)"(
      dest: string,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    ActionBlacklisted(signature: string | null): EventFilter;

    PhaseOneStartTimeSet(startTime: null): EventFilter;

    PhaseStartDelayed(
      phase: BigNumberish | null,
      startTime: null,
      delaysRemaining: null
    ): EventFilter;

    UpdateLockDelayed(locktime: null, delaysRemaining: null): EventFilter;
  };

  estimateGas: {
    currentPhase(overrides?: CallOverrides): Promise<BigNumber>;

    "currentPhase()"(overrides?: CallOverrides): Promise<BigNumber>;

    requireValidAction(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "requireValidAction(address,string)"(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPhaseOneStartTime(
      phaseOneStartTime: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setPhaseOneStartTime(uint64)"(
      phaseOneStartTime: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    transferEmergencyShutdownTokens(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transferEmergencyShutdownTokens(address,uint256)"(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    currentPhase(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "currentPhase()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    requireValidAction(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "requireValidAction(address,string)"(
      target: string,
      signature: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPhaseOneStartTime(
      phaseOneStartTime: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setPhaseOneStartTime(uint64)"(
      phaseOneStartTime: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    transferEmergencyShutdownTokens(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transferEmergencyShutdownTokens(address,uint256)"(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
