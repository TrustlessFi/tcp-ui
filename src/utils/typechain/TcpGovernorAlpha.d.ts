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

interface TCPGovernorAlphaInterface extends ethers.utils.Interface {
  functions: {
    "BALLOT_TYPEHASH()": FunctionFragment;
    "DOMAIN_TYPEHASH()": FunctionFragment;
<<<<<<< HEAD
=======
    "INFLATION_PERCENTAGE()": FunctionFragment;
>>>>>>> master
    "__abdicate()": FunctionFragment;
    "cancel(uint256)": FunctionFragment;
    "castVote(uint256,bool)": FunctionFragment;
    "castVoteBySig(uint256,bool,uint8,bytes32,bytes32)": FunctionFragment;
    "claimVotingRewards(uint256)": FunctionFragment;
    "execute(uint256)": FunctionFragment;
    "getActions(uint256)": FunctionFragment;
    "getAllProposals(address)": FunctionFragment;
    "getReceipt(uint256,address)": FunctionFragment;
    "governor()": FunctionFragment;
    "guardian()": FunctionFragment;
    "implementsVotingRewardsWithToken()": FunctionFragment;
    "latestProposalIds(address)": FunctionFragment;
    "name()": FunctionFragment;
    "proposalCount()": FunctionFragment;
    "proposalMaxOperations()": FunctionFragment;
    "proposalThreshold()": FunctionFragment;
    "proposals(uint256)": FunctionFragment;
    "propose(address[],string[],bytes[],string)": FunctionFragment;
    "queue(uint256)": FunctionFragment;
    "quorumVotes()": FunctionFragment;
    "state(uint256)": FunctionFragment;
    "timelock()": FunctionFragment;
    "votingDelay()": FunctionFragment;
    "votingPeriod()": FunctionFragment;
    "votingPeriodBlocks()": FunctionFragment;
    "votingToken()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "BALLOT_TYPEHASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DOMAIN_TYPEHASH",
    values?: undefined
  ): string;
  encodeFunctionData(
<<<<<<< HEAD
=======
    functionFragment: "INFLATION_PERCENTAGE",
    values?: undefined
  ): string;
  encodeFunctionData(
>>>>>>> master
    functionFragment: "__abdicate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cancel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "castVote",
    values: [BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "castVoteBySig",
    values: [BigNumberish, boolean, BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "claimVotingRewards",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "execute",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getActions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllProposals",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getReceipt",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "governor", values?: undefined): string;
  encodeFunctionData(functionFragment: "guardian", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "implementsVotingRewardsWithToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "latestProposalIds",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proposalCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proposalMaxOperations",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proposalThreshold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proposals",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "propose",
    values: [string[], string[], BytesLike[], string]
  ): string;
  encodeFunctionData(functionFragment: "queue", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "quorumVotes",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "state", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "timelock", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "votingDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "votingPeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "votingPeriodBlocks",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "votingToken",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "BALLOT_TYPEHASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "DOMAIN_TYPEHASH",
    data: BytesLike
  ): Result;
<<<<<<< HEAD
=======
  decodeFunctionResult(
    functionFragment: "INFLATION_PERCENTAGE",
    data: BytesLike
  ): Result;
>>>>>>> master
  decodeFunctionResult(functionFragment: "__abdicate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "castVote", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "castVoteBySig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimVotingRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getActions", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAllProposals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getReceipt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "governor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "guardian", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "implementsVotingRewardsWithToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestProposalIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proposalCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposalMaxOperations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proposalThreshold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "proposals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "propose", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "queue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quorumVotes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "state", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "timelock", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "votingDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "votingPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "votingPeriodBlocks",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "votingToken",
    data: BytesLike
  ): Result;

  events: {
    "ProposalCanceled(uint256)": EventFragment;
    "ProposalCreated(uint256,address)": EventFragment;
    "ProposalExecuted(uint256)": EventFragment;
    "ProposalQueued(uint256,uint256)": EventFragment;
    "VoteCast(address,uint256,bool,uint256)": EventFragment;
    "VotingRewardsDistributed(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ProposalCanceled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalExecuted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProposalQueued"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VoteCast"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VotingRewardsDistributed"): EventFragment;
}

export class TCPGovernorAlpha extends BaseContract {
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

  interface: TCPGovernorAlphaInterface;

  functions: {
    BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;

<<<<<<< HEAD
=======
    INFLATION_PERCENTAGE(overrides?: CallOverrides): Promise<[BigNumber]>;

>>>>>>> master
    __abdicate(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancel(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    castVote(
      proposalId: BigNumberish,
      support: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    castVoteBySig(
      proposalId: BigNumberish,
      support: boolean,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimVotingRewards(
      proposalID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    execute(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getActions(
      proposalId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string[], string[], string[]] & {
        targets: string[];
        signatures: string[];
        calldatas: string[];
      }
    >;

    getAllProposals(
      voter: string,
      overrides?: CallOverrides
    ): Promise<
      [
        ([
          string[],
          string[],
          string[],
          string,
          string,
          number,
          number,
          BigNumber,
          number,
          number,
          boolean,
          boolean,
          BigNumber,
          BigNumber
        ] & {
          targets: string[];
          signatures: string[];
          calldatas: string[];
          ipfsHash: string;
          proposer: string;
          eta: number;
          id: number;
          forVotes: BigNumber;
          startBlock: number;
          endBlock: number;
          canceled: boolean;
          executed: boolean;
          againstVotes: BigNumber;
          initialSupply: BigNumber;
        })[],
        number[],
        ([boolean, boolean, boolean, BigNumber] & {
          hasVoted: boolean;
          support: boolean;
          rewardReceived: boolean;
          votes: BigNumber;
        })[]
      ] & {
        _proposals: ([
          string[],
          string[],
          string[],
          string,
          string,
          number,
          number,
          BigNumber,
          number,
          number,
          boolean,
          boolean,
          BigNumber,
          BigNumber
        ] & {
          targets: string[];
          signatures: string[];
          calldatas: string[];
          ipfsHash: string;
          proposer: string;
          eta: number;
          id: number;
          forVotes: BigNumber;
          startBlock: number;
          endBlock: number;
          canceled: boolean;
          executed: boolean;
          againstVotes: BigNumber;
          initialSupply: BigNumber;
        })[];
        _proposalStates: number[];
        _receipts: ([boolean, boolean, boolean, BigNumber] & {
          hasVoted: boolean;
          support: boolean;
          rewardReceived: boolean;
          votes: BigNumber;
        })[];
      }
    >;

    getReceipt(
      proposalId: BigNumberish,
      voter: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [boolean, boolean, boolean, BigNumber] & {
          hasVoted: boolean;
          support: boolean;
          rewardReceived: boolean;
          votes: BigNumber;
        }
      ]
    >;

    governor(overrides?: CallOverrides): Promise<[string]>;

    guardian(overrides?: CallOverrides): Promise<[string]>;

    implementsVotingRewardsWithToken(
      overrides?: CallOverrides
    ): Promise<[string]>;

    latestProposalIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    proposalCount(overrides?: CallOverrides): Promise<[number]>;

    proposalMaxOperations(overrides?: CallOverrides): Promise<[BigNumber]>;

    proposalThreshold(overrides?: CallOverrides): Promise<[BigNumber]>;

    proposals(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        number,
        number,
        BigNumber,
        number,
        number,
        boolean,
        boolean,
        BigNumber,
        BigNumber
      ] & {
        ipfsHash: string;
        proposer: string;
        eta: number;
        id: number;
        forVotes: BigNumber;
        startBlock: number;
        endBlock: number;
        canceled: boolean;
        executed: boolean;
        againstVotes: BigNumber;
        initialSupply: BigNumber;
      }
    >;

    propose(
      targets: string[],
      signatures: string[],
      calldatas: BytesLike[],
      ipfsHash: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    queue(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    quorumVotes(overrides?: CallOverrides): Promise<[BigNumber]>;

    state(
      proposalId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number]>;

    timelock(overrides?: CallOverrides): Promise<[string]>;

    votingDelay(overrides?: CallOverrides): Promise<[BigNumber]>;

    votingPeriod(overrides?: CallOverrides): Promise<[BigNumber]>;

    votingPeriodBlocks(overrides?: CallOverrides): Promise<[number]>;

    votingToken(overrides?: CallOverrides): Promise<[string]>;
  };

  BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<string>;

  DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<string>;

<<<<<<< HEAD
=======
  INFLATION_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;

>>>>>>> master
  __abdicate(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancel(
    proposalId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  castVote(
    proposalId: BigNumberish,
    support: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  castVoteBySig(
    proposalId: BigNumberish,
    support: boolean,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimVotingRewards(
    proposalID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  execute(
    proposalId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getActions(
    proposalId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string[], string[], string[]] & {
      targets: string[];
      signatures: string[];
      calldatas: string[];
    }
  >;

  getAllProposals(
    voter: string,
    overrides?: CallOverrides
  ): Promise<
    [
      ([
        string[],
        string[],
        string[],
        string,
        string,
        number,
        number,
        BigNumber,
        number,
        number,
        boolean,
        boolean,
        BigNumber,
        BigNumber
      ] & {
        targets: string[];
        signatures: string[];
        calldatas: string[];
        ipfsHash: string;
        proposer: string;
        eta: number;
        id: number;
        forVotes: BigNumber;
        startBlock: number;
        endBlock: number;
        canceled: boolean;
        executed: boolean;
        againstVotes: BigNumber;
        initialSupply: BigNumber;
      })[],
      number[],
      ([boolean, boolean, boolean, BigNumber] & {
        hasVoted: boolean;
        support: boolean;
        rewardReceived: boolean;
        votes: BigNumber;
      })[]
    ] & {
      _proposals: ([
        string[],
        string[],
        string[],
        string,
        string,
        number,
        number,
        BigNumber,
        number,
        number,
        boolean,
        boolean,
        BigNumber,
        BigNumber
      ] & {
        targets: string[];
        signatures: string[];
        calldatas: string[];
        ipfsHash: string;
        proposer: string;
        eta: number;
        id: number;
        forVotes: BigNumber;
        startBlock: number;
        endBlock: number;
        canceled: boolean;
        executed: boolean;
        againstVotes: BigNumber;
        initialSupply: BigNumber;
      })[];
      _proposalStates: number[];
      _receipts: ([boolean, boolean, boolean, BigNumber] & {
        hasVoted: boolean;
        support: boolean;
        rewardReceived: boolean;
        votes: BigNumber;
      })[];
    }
  >;

  getReceipt(
    proposalId: BigNumberish,
    voter: string,
    overrides?: CallOverrides
  ): Promise<
    [boolean, boolean, boolean, BigNumber] & {
      hasVoted: boolean;
      support: boolean;
      rewardReceived: boolean;
      votes: BigNumber;
    }
  >;

  governor(overrides?: CallOverrides): Promise<string>;

  guardian(overrides?: CallOverrides): Promise<string>;

  implementsVotingRewardsWithToken(overrides?: CallOverrides): Promise<string>;

  latestProposalIds(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  proposalCount(overrides?: CallOverrides): Promise<number>;

  proposalMaxOperations(overrides?: CallOverrides): Promise<BigNumber>;

  proposalThreshold(overrides?: CallOverrides): Promise<BigNumber>;

  proposals(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      string,
      number,
      number,
      BigNumber,
      number,
      number,
      boolean,
      boolean,
      BigNumber,
      BigNumber
    ] & {
      ipfsHash: string;
      proposer: string;
      eta: number;
      id: number;
      forVotes: BigNumber;
      startBlock: number;
      endBlock: number;
      canceled: boolean;
      executed: boolean;
      againstVotes: BigNumber;
      initialSupply: BigNumber;
    }
  >;

  propose(
    targets: string[],
    signatures: string[],
    calldatas: BytesLike[],
    ipfsHash: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  queue(
    proposalId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  quorumVotes(overrides?: CallOverrides): Promise<BigNumber>;

  state(proposalId: BigNumberish, overrides?: CallOverrides): Promise<number>;

  timelock(overrides?: CallOverrides): Promise<string>;

  votingDelay(overrides?: CallOverrides): Promise<BigNumber>;

  votingPeriod(overrides?: CallOverrides): Promise<BigNumber>;

  votingPeriodBlocks(overrides?: CallOverrides): Promise<number>;

  votingToken(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<string>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<string>;

<<<<<<< HEAD
=======
    INFLATION_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;

>>>>>>> master
    __abdicate(overrides?: CallOverrides): Promise<void>;

    cancel(proposalId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    castVote(
      proposalId: BigNumberish,
      support: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    castVoteBySig(
      proposalId: BigNumberish,
      support: boolean,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    claimVotingRewards(
      proposalID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    execute(proposalId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    getActions(
      proposalId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [string[], string[], string[]] & {
        targets: string[];
        signatures: string[];
        calldatas: string[];
      }
    >;

    getAllProposals(
      voter: string,
      overrides?: CallOverrides
    ): Promise<
      [
        ([
          string[],
          string[],
          string[],
          string,
          string,
          number,
          number,
          BigNumber,
          number,
          number,
          boolean,
          boolean,
          BigNumber,
          BigNumber
        ] & {
          targets: string[];
          signatures: string[];
          calldatas: string[];
          ipfsHash: string;
          proposer: string;
          eta: number;
          id: number;
          forVotes: BigNumber;
          startBlock: number;
          endBlock: number;
          canceled: boolean;
          executed: boolean;
          againstVotes: BigNumber;
          initialSupply: BigNumber;
        })[],
        number[],
        ([boolean, boolean, boolean, BigNumber] & {
          hasVoted: boolean;
          support: boolean;
          rewardReceived: boolean;
          votes: BigNumber;
        })[]
      ] & {
        _proposals: ([
          string[],
          string[],
          string[],
          string,
          string,
          number,
          number,
          BigNumber,
          number,
          number,
          boolean,
          boolean,
          BigNumber,
          BigNumber
        ] & {
          targets: string[];
          signatures: string[];
          calldatas: string[];
          ipfsHash: string;
          proposer: string;
          eta: number;
          id: number;
          forVotes: BigNumber;
          startBlock: number;
          endBlock: number;
          canceled: boolean;
          executed: boolean;
          againstVotes: BigNumber;
          initialSupply: BigNumber;
        })[];
        _proposalStates: number[];
        _receipts: ([boolean, boolean, boolean, BigNumber] & {
          hasVoted: boolean;
          support: boolean;
          rewardReceived: boolean;
          votes: BigNumber;
        })[];
      }
    >;

    getReceipt(
      proposalId: BigNumberish,
      voter: string,
      overrides?: CallOverrides
    ): Promise<
      [boolean, boolean, boolean, BigNumber] & {
        hasVoted: boolean;
        support: boolean;
        rewardReceived: boolean;
        votes: BigNumber;
      }
    >;

    governor(overrides?: CallOverrides): Promise<string>;

    guardian(overrides?: CallOverrides): Promise<string>;

    implementsVotingRewardsWithToken(
      overrides?: CallOverrides
    ): Promise<string>;

    latestProposalIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    proposalCount(overrides?: CallOverrides): Promise<number>;

    proposalMaxOperations(overrides?: CallOverrides): Promise<BigNumber>;

    proposalThreshold(overrides?: CallOverrides): Promise<BigNumber>;

    proposals(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        number,
        number,
        BigNumber,
        number,
        number,
        boolean,
        boolean,
        BigNumber,
        BigNumber
      ] & {
        ipfsHash: string;
        proposer: string;
        eta: number;
        id: number;
        forVotes: BigNumber;
        startBlock: number;
        endBlock: number;
        canceled: boolean;
        executed: boolean;
        againstVotes: BigNumber;
        initialSupply: BigNumber;
      }
    >;

    propose(
      targets: string[],
      signatures: string[],
      calldatas: BytesLike[],
      ipfsHash: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queue(proposalId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    quorumVotes(overrides?: CallOverrides): Promise<BigNumber>;

    state(proposalId: BigNumberish, overrides?: CallOverrides): Promise<number>;

    timelock(overrides?: CallOverrides): Promise<string>;

    votingDelay(overrides?: CallOverrides): Promise<BigNumber>;

    votingPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    votingPeriodBlocks(overrides?: CallOverrides): Promise<number>;

    votingToken(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    ProposalCanceled(
      id?: BigNumberish | null
    ): TypedEventFilter<[BigNumber], { id: BigNumber }>;

    ProposalCreated(
      id?: BigNumberish | null,
      proposer?: string | null
    ): TypedEventFilter<
      [BigNumber, string],
      { id: BigNumber; proposer: string }
    >;

    ProposalExecuted(
      id?: BigNumberish | null
    ): TypedEventFilter<[BigNumber], { id: BigNumber }>;

    ProposalQueued(
      id?: BigNumberish | null,
      eta?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber],
      { id: BigNumber; eta: BigNumber }
    >;

    VoteCast(
      voter?: string | null,
      proposalId?: BigNumberish | null,
      support?: boolean | null,
      votes?: null
    ): TypedEventFilter<
      [string, BigNumber, boolean, BigNumber],
      {
        voter: string;
        proposalId: BigNumber;
        support: boolean;
        votes: BigNumber;
      }
    >;

    VotingRewardsDistributed(
      voter?: string | null,
      count?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { voter: string; count: BigNumber }
    >;
  };

  estimateGas: {
    BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;

<<<<<<< HEAD
=======
    INFLATION_PERCENTAGE(overrides?: CallOverrides): Promise<BigNumber>;

>>>>>>> master
    __abdicate(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancel(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    castVote(
      proposalId: BigNumberish,
      support: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    castVoteBySig(
      proposalId: BigNumberish,
      support: boolean,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimVotingRewards(
      proposalID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    execute(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getActions(
      proposalId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAllProposals(
      voter: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReceipt(
      proposalId: BigNumberish,
      voter: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    governor(overrides?: CallOverrides): Promise<BigNumber>;

    guardian(overrides?: CallOverrides): Promise<BigNumber>;

    implementsVotingRewardsWithToken(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    latestProposalIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    proposalCount(overrides?: CallOverrides): Promise<BigNumber>;

    proposalMaxOperations(overrides?: CallOverrides): Promise<BigNumber>;

    proposalThreshold(overrides?: CallOverrides): Promise<BigNumber>;

    proposals(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    propose(
      targets: string[],
      signatures: string[],
      calldatas: BytesLike[],
      ipfsHash: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    queue(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    quorumVotes(overrides?: CallOverrides): Promise<BigNumber>;

    state(
      proposalId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    timelock(overrides?: CallOverrides): Promise<BigNumber>;

    votingDelay(overrides?: CallOverrides): Promise<BigNumber>;

    votingPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    votingPeriodBlocks(overrides?: CallOverrides): Promise<BigNumber>;

    votingToken(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

<<<<<<< HEAD
=======
    INFLATION_PERCENTAGE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

>>>>>>> master
    __abdicate(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancel(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    castVote(
      proposalId: BigNumberish,
      support: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    castVoteBySig(
      proposalId: BigNumberish,
      support: boolean,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimVotingRewards(
      proposalID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    execute(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getActions(
      proposalId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAllProposals(
      voter: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReceipt(
      proposalId: BigNumberish,
      voter: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    governor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    guardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    implementsVotingRewardsWithToken(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    latestProposalIds(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposalMaxOperations(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    proposalThreshold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposals(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    propose(
      targets: string[],
      signatures: string[],
      calldatas: BytesLike[],
      ipfsHash: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    queue(
      proposalId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    quorumVotes(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    state(
      proposalId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    timelock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    votingDelay(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    votingPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    votingPeriodBlocks(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    votingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
