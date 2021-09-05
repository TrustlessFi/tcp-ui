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

interface GenesisAllocationInterface extends ethers.utils.Interface {
  functions: {
    "NAME()": FunctionFragment;
    "abdicateTokenRemoval()": FunctionFragment;
    "authenticator()": FunctionFragment;
    "canRemoveTokens()": FunctionFragment;
    "chainID()": FunctionFragment;
    "claimAllocation(tuple,uint8,uint128)": FunctionFragment;
    "claimedSig(address,uint8,bytes32,bytes32)": FunctionFragment;
    "dao()": FunctionFragment;
    "deadline()": FunctionFragment;
    "extendDeadline(uint64)": FunctionFragment;
    "getMessage(address,uint8,uint128)": FunctionFragment;
    "getTokens(uint128)": FunctionFragment;
    "guardian()": FunctionFragment;
    "lockPositions(address)": FunctionFragment;
    "lockTokensIntoDao(uint128,uint8)": FunctionFragment;
    "minAverageYearsLocked()": FunctionFragment;
    "pendingGuardian()": FunctionFragment;
    "recieveGuardianship()": FunctionFragment;
    "removeTokens(address,uint256)": FunctionFragment;
    "setDao(address)": FunctionFragment;
    "startTime()": FunctionFragment;
    "token()": FunctionFragment;
    "tokenMinter()": FunctionFragment;
    "transferGuardianship(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "NAME", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "abdicateTokenRemoval",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "authenticator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "canRemoveTokens",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "chainID", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claimAllocation",
    values: [
      { v: BigNumberish; r: BytesLike; s: BytesLike },
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "claimedSig",
    values: [string, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "dao", values?: undefined): string;
  encodeFunctionData(functionFragment: "deadline", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "extendDeadline",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getMessage",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "guardian", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "lockPositions",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "lockTokensIntoDao",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "minAverageYearsLocked",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pendingGuardian",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "recieveGuardianship",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setDao", values: [string]): string;
  encodeFunctionData(functionFragment: "startTime", values?: undefined): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenMinter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferGuardianship",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "NAME", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "abdicateTokenRemoval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "authenticator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canRemoveTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "chainID", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimAllocation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimedSig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "dao", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deadline", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "extendDeadline",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getMessage", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getTokens", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "guardian", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lockPositions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lockTokensIntoDao",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minAverageYearsLocked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pendingGuardian",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recieveGuardianship",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setDao", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startTime", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenMinter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferGuardianship",
    data: BytesLike
  ): Result;

  events: {
    "DeadlineSet(uint64)": EventFragment;
    "IncentiveDistributed(address,uint256)": EventFragment;
    "LockPositionIncreased(address,uint128)": EventFragment;
    "NewGuardian(address)": EventFragment;
    "SignatureProcessed(address,uint128)": EventFragment;
    "TokensLocked(address,uint8,uint256)": EventFragment;
    "TokensRemoved(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DeadlineSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IncentiveDistributed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LockPositionIncreased"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewGuardian"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SignatureProcessed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensLocked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensRemoved"): EventFragment;
}

export class GenesisAllocation extends BaseContract {
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

  interface: GenesisAllocationInterface;

  functions: {
    NAME(overrides?: CallOverrides): Promise<[string]>;

    abdicateTokenRemoval(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    authenticator(overrides?: CallOverrides): Promise<[string]>;

    canRemoveTokens(overrides?: CallOverrides): Promise<[boolean]>;

    chainID(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _chainID: BigNumber }>;

    claimAllocation(
      auth: { v: BigNumberish; r: BytesLike; s: BytesLike },
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimedSig(
      arg0: string,
      arg1: BigNumberish,
      arg2: BytesLike,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    dao(overrides?: CallOverrides): Promise<[string]>;

    deadline(overrides?: CallOverrides): Promise<[BigNumber]>;

    extendDeadline(
      newDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getMessage(
      userAddress: string,
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getTokens(
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    guardian(overrides?: CallOverrides): Promise<[string]>;

    lockPositions(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        totalAllocation: BigNumber;
        tokensAllocated: BigNumber;
        cumulativeTokensAllocatedxLockYears: BigNumber;
      }
    >;

    lockTokensIntoDao(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    minAverageYearsLocked(overrides?: CallOverrides): Promise<[BigNumber]>;

    pendingGuardian(overrides?: CallOverrides): Promise<[string]>;

    recieveGuardianship(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeTokens(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDao(
      _dao: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    startTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    tokenMinter(overrides?: CallOverrides): Promise<[string]>;

    transferGuardianship(
      newGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  NAME(overrides?: CallOverrides): Promise<string>;

  abdicateTokenRemoval(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  authenticator(overrides?: CallOverrides): Promise<string>;

  canRemoveTokens(overrides?: CallOverrides): Promise<boolean>;

  chainID(overrides?: CallOverrides): Promise<BigNumber>;

  claimAllocation(
    auth: { v: BigNumberish; r: BytesLike; s: BytesLike },
    roundID: BigNumberish,
    count: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimedSig(
    arg0: string,
    arg1: BigNumberish,
    arg2: BytesLike,
    arg3: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  dao(overrides?: CallOverrides): Promise<string>;

  deadline(overrides?: CallOverrides): Promise<BigNumber>;

  extendDeadline(
    newDeadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getMessage(
    userAddress: string,
    roundID: BigNumberish,
    count: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getTokens(
    count: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  guardian(overrides?: CallOverrides): Promise<string>;

  lockPositions(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      totalAllocation: BigNumber;
      tokensAllocated: BigNumber;
      cumulativeTokensAllocatedxLockYears: BigNumber;
    }
  >;

  lockTokensIntoDao(
    count: BigNumberish,
    lockDurationMonths: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  minAverageYearsLocked(overrides?: CallOverrides): Promise<BigNumber>;

  pendingGuardian(overrides?: CallOverrides): Promise<string>;

  recieveGuardianship(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeTokens(
    dest: string,
    count: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDao(
    _dao: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  startTime(overrides?: CallOverrides): Promise<BigNumber>;

  token(overrides?: CallOverrides): Promise<string>;

  tokenMinter(overrides?: CallOverrides): Promise<string>;

  transferGuardianship(
    newGuardian: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    NAME(overrides?: CallOverrides): Promise<string>;

    abdicateTokenRemoval(overrides?: CallOverrides): Promise<void>;

    authenticator(overrides?: CallOverrides): Promise<string>;

    canRemoveTokens(overrides?: CallOverrides): Promise<boolean>;

    chainID(overrides?: CallOverrides): Promise<BigNumber>;

    claimAllocation(
      auth: { v: BigNumberish; r: BytesLike; s: BytesLike },
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    claimedSig(
      arg0: string,
      arg1: BigNumberish,
      arg2: BytesLike,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    dao(overrides?: CallOverrides): Promise<string>;

    deadline(overrides?: CallOverrides): Promise<BigNumber>;

    extendDeadline(
      newDeadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getMessage(
      userAddress: string,
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getTokens(count: BigNumberish, overrides?: CallOverrides): Promise<void>;

    guardian(overrides?: CallOverrides): Promise<string>;

    lockPositions(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        totalAllocation: BigNumber;
        tokensAllocated: BigNumber;
        cumulativeTokensAllocatedxLockYears: BigNumber;
      }
    >;

    lockTokensIntoDao(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    minAverageYearsLocked(overrides?: CallOverrides): Promise<BigNumber>;

    pendingGuardian(overrides?: CallOverrides): Promise<string>;

    recieveGuardianship(overrides?: CallOverrides): Promise<void>;

    removeTokens(
      dest: string,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setDao(_dao: string, overrides?: CallOverrides): Promise<void>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<string>;

    tokenMinter(overrides?: CallOverrides): Promise<string>;

    transferGuardianship(
      newGuardian: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    DeadlineSet(
      deadline?: null
    ): TypedEventFilter<[BigNumber], { deadline: BigNumber }>;

    IncentiveDistributed(
      dest?: string | null,
      count?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { dest: string; count: BigNumber }
    >;

    LockPositionIncreased(
      receiver?: string | null,
      count?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { receiver: string; count: BigNumber }
    >;

    NewGuardian(
      newGuardian?: string | null
    ): TypedEventFilter<[string], { newGuardian: string }>;

    SignatureProcessed(
      receiver?: string | null,
      count?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { receiver: string; count: BigNumber }
    >;

    TokensLocked(
      receiver?: string | null,
      lockDurationMonths?: BigNumberish | null,
      count?: null
    ): TypedEventFilter<
      [string, number, BigNumber],
      { receiver: string; lockDurationMonths: number; count: BigNumber }
    >;

    TokensRemoved(
      receiver?: string | null,
      count?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { receiver: string; count: BigNumber }
    >;
  };

  estimateGas: {
    NAME(overrides?: CallOverrides): Promise<BigNumber>;

    abdicateTokenRemoval(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    authenticator(overrides?: CallOverrides): Promise<BigNumber>;

    canRemoveTokens(overrides?: CallOverrides): Promise<BigNumber>;

    chainID(overrides?: CallOverrides): Promise<BigNumber>;

    claimAllocation(
      auth: { v: BigNumberish; r: BytesLike; s: BytesLike },
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimedSig(
      arg0: string,
      arg1: BigNumberish,
      arg2: BytesLike,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    dao(overrides?: CallOverrides): Promise<BigNumber>;

    deadline(overrides?: CallOverrides): Promise<BigNumber>;

    extendDeadline(
      newDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getMessage(
      userAddress: string,
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokens(
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<BigNumber>;

    lockPositions(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    lockTokensIntoDao(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    minAverageYearsLocked(overrides?: CallOverrides): Promise<BigNumber>;

    pendingGuardian(overrides?: CallOverrides): Promise<BigNumber>;

    recieveGuardianship(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeTokens(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDao(
      _dao: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    tokenMinter(overrides?: CallOverrides): Promise<BigNumber>;

    transferGuardianship(
      newGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    NAME(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    abdicateTokenRemoval(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    authenticator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    canRemoveTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    chainID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimAllocation(
      auth: { v: BigNumberish; r: BytesLike; s: BytesLike },
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimedSig(
      arg0: string,
      arg1: BigNumberish,
      arg2: BytesLike,
      arg3: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    dao(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deadline(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    extendDeadline(
      newDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getMessage(
      userAddress: string,
      roundID: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokens(
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    guardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lockPositions(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockTokensIntoDao(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    minAverageYearsLocked(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pendingGuardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recieveGuardianship(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeTokens(
      dest: string,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDao(
      _dao: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    startTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenMinter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferGuardianship(
      newGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
