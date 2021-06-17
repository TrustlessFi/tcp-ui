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
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface UniswapV3PoolDeployerInterface extends ethers.utils.Interface {
  functions: {
    "parameters()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "parameters",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "parameters", data: BytesLike): Result;

  events: {};
}

export class UniswapV3PoolDeployer extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: UniswapV3PoolDeployerInterface;

  functions: {
    parameters(overrides?: CallOverrides): Promise<{
      factory: string;
      token0: string;
      token1: string;
      fee: number;
      tickSpacing: number;
      0: string;
      1: string;
      2: string;
      3: number;
      4: number;
    }>;

    "parameters()"(overrides?: CallOverrides): Promise<{
      factory: string;
      token0: string;
      token1: string;
      fee: number;
      tickSpacing: number;
      0: string;
      1: string;
      2: string;
      3: number;
      4: number;
    }>;
  };

  parameters(overrides?: CallOverrides): Promise<{
    factory: string;
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    0: string;
    1: string;
    2: string;
    3: number;
    4: number;
  }>;

  "parameters()"(overrides?: CallOverrides): Promise<{
    factory: string;
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    0: string;
    1: string;
    2: string;
    3: number;
    4: number;
  }>;

  callStatic: {
    parameters(overrides?: CallOverrides): Promise<{
      factory: string;
      token0: string;
      token1: string;
      fee: number;
      tickSpacing: number;
      0: string;
      1: string;
      2: string;
      3: number;
      4: number;
    }>;

    "parameters()"(overrides?: CallOverrides): Promise<{
      factory: string;
      token0: string;
      token1: string;
      fee: number;
      tickSpacing: number;
      0: string;
      1: string;
      2: string;
      3: number;
      4: number;
    }>;
  };

  filters: {};

  estimateGas: {
    parameters(overrides?: CallOverrides): Promise<BigNumber>;

    "parameters()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    parameters(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "parameters()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
