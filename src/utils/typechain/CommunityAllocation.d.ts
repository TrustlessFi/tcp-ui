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

interface CommunityAllocationInterface extends ethers.utils.Interface {
  functions: {
    "abdicateArbitraryMinting()": FunctionFragment;
    "canMintArbitrarily()": FunctionFragment;
    "createLockPosition(uint256,uint8,address)": FunctionFragment;
    "dao()": FunctionFragment;
    "guardian()": FunctionFragment;
    "mintArbitrarily(address,uint256)": FunctionFragment;
    "pendingGuardian()": FunctionFragment;
    "recieveGuardianship()": FunctionFragment;
    "setDao(address)": FunctionFragment;
    "token()": FunctionFragment;
    "tokenMinter()": FunctionFragment;
    "transferGuardianship(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "abdicateArbitraryMinting",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "canMintArbitrarily",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createLockPosition",
    values: [BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "dao", values?: undefined): string;
  encodeFunctionData(functionFragment: "guardian", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "mintArbitrarily",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pendingGuardian",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "recieveGuardianship",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setDao", values: [string]): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenMinter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferGuardianship",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "abdicateArbitraryMinting",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canMintArbitrarily",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createLockPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "dao", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "guardian", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "mintArbitrarily",
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
  decodeFunctionResult(functionFragment: "setDao", data: BytesLike): Result;
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
    "ArbitraryMintingAbdicated(address)": EventFragment;
    "IncentiveDistributed(address,uint256)": EventFragment;
    "NewGuardian(address)": EventFragment;
    "TokensLocked(address,uint8,uint256)": EventFragment;
    "TokensMintedArbitrarily(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ArbitraryMintingAbdicated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IncentiveDistributed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewGuardian"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensLocked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensMintedArbitrarily"): EventFragment;
}

export class CommunityAllocation extends BaseContract {
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

  interface: CommunityAllocationInterface;

  functions: {
    abdicateArbitraryMinting(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    canMintArbitrarily(overrides?: CallOverrides): Promise<[boolean]>;

    createLockPosition(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    dao(overrides?: CallOverrides): Promise<[string]>;

    guardian(overrides?: CallOverrides): Promise<[string]>;

    mintArbitrarily(
      to: string,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    pendingGuardian(overrides?: CallOverrides): Promise<[string]>;

    recieveGuardianship(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setDao(
      _dao: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    tokenMinter(overrides?: CallOverrides): Promise<[string]>;

    transferGuardianship(
      newGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  abdicateArbitraryMinting(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  canMintArbitrarily(overrides?: CallOverrides): Promise<boolean>;

  createLockPosition(
    count: BigNumberish,
    lockDurationMonths: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  dao(overrides?: CallOverrides): Promise<string>;

  guardian(overrides?: CallOverrides): Promise<string>;

  mintArbitrarily(
    to: string,
    count: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  pendingGuardian(overrides?: CallOverrides): Promise<string>;

  recieveGuardianship(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setDao(
    _dao: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  tokenMinter(overrides?: CallOverrides): Promise<string>;

  transferGuardianship(
    newGuardian: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    abdicateArbitraryMinting(overrides?: CallOverrides): Promise<void>;

    canMintArbitrarily(overrides?: CallOverrides): Promise<boolean>;

    createLockPosition(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    dao(overrides?: CallOverrides): Promise<string>;

    guardian(overrides?: CallOverrides): Promise<string>;

    mintArbitrarily(
      to: string,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    pendingGuardian(overrides?: CallOverrides): Promise<string>;

    recieveGuardianship(overrides?: CallOverrides): Promise<void>;

    setDao(_dao: string, overrides?: CallOverrides): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    tokenMinter(overrides?: CallOverrides): Promise<string>;

    transferGuardianship(
      newGuardian: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    ArbitraryMintingAbdicated(
      guardian?: string | null
    ): TypedEventFilter<[string], { guardian: string }>;

    IncentiveDistributed(
      dest?: string | null,
      count?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { dest: string; count: BigNumber }
    >;

    NewGuardian(
      newGuardian?: string | null
    ): TypedEventFilter<[string], { newGuardian: string }>;

    TokensLocked(
      receiver?: string | null,
      lockDurationMonths?: BigNumberish | null,
      count?: null
    ): TypedEventFilter<
      [string, number, BigNumber],
      { receiver: string; lockDurationMonths: number; count: BigNumber }
    >;

    TokensMintedArbitrarily(
      to?: string | null,
      count?: null
    ): TypedEventFilter<[string, BigNumber], { to: string; count: BigNumber }>;
  };

  estimateGas: {
    abdicateArbitraryMinting(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    canMintArbitrarily(overrides?: CallOverrides): Promise<BigNumber>;

    createLockPosition(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    dao(overrides?: CallOverrides): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<BigNumber>;

    mintArbitrarily(
      to: string,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    pendingGuardian(overrides?: CallOverrides): Promise<BigNumber>;

    recieveGuardianship(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setDao(
      _dao: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    tokenMinter(overrides?: CallOverrides): Promise<BigNumber>;

    transferGuardianship(
      newGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    abdicateArbitraryMinting(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    canMintArbitrarily(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createLockPosition(
      count: BigNumberish,
      lockDurationMonths: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    dao(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    guardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mintArbitrarily(
      to: string,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    pendingGuardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recieveGuardianship(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setDao(
      _dao: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenMinter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferGuardianship(
      newGuardian: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
