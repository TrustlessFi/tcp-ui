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

interface TestUniswapV3SwapPayInterface extends ethers.utils.Interface {
  functions: {
    "swap(address,address,bool,uint160,int256,uint256,uint256)": FunctionFragment;
    "uniswapV3SwapCallback(int256,int256,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "swap",
    values: [
      string,
      string,
      boolean,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapV3SwapCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "uniswapV3SwapCallback",
    data: BytesLike
  ): Result;

  events: {};
}

export class TestUniswapV3SwapPay extends BaseContract {
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

  interface: TestUniswapV3SwapPayInterface;

  functions: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uniswapV3SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  swap(
    pool: string,
    recipient: string,
    zeroForOne: boolean,
    sqrtPriceX96: BigNumberish,
    amountSpecified: BigNumberish,
    pay0: BigNumberish,
    pay1: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uniswapV3SwapCallback(
    arg0: BigNumberish,
    arg1: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    uniswapV3SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uniswapV3SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    swap(
      pool: string,
      recipient: string,
      zeroForOne: boolean,
      sqrtPriceX96: BigNumberish,
      amountSpecified: BigNumberish,
      pay0: BigNumberish,
      pay1: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uniswapV3SwapCallback(
      arg0: BigNumberish,
      arg1: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
