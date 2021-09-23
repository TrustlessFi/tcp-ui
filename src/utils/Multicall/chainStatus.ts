// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED


import { TcpMulticall } from '../typechain'
import { BigNumberish } from 'ethers'


export const getCurrentBlockDifficulty = async (multicall: TcpMulticall) =>
  await multicall.getCurrentBlockDifficulty()

export const getCurrentBlockGasLimit = async (multicall: TcpMulticall) =>
  await multicall.getCurrentBlockGasLimit()

export const getCurrentBlockTimestamp = async (multicall: TcpMulticall) =>
  await multicall.getCurrentBlockTimestamp()

export const getEthBalance = async (multicall: TcpMulticall, address: string) =>
  await multicall.getEthBalance(address)

export const getBlockNumber = async (multicall: TcpMulticall) =>
  await multicall.getBlockNumber()

export const getBlockHash = async (multicall: TcpMulticall, blockNumber: BigNumberish) =>
  await multicall.getBlockHash(blockNumber)

export const getLastBlockHash = async (multicall: TcpMulticall) =>
  await multicall.getLastBlockHash()

export const getCurrentBlockCoinbase = async (multicall: TcpMulticall) =>
  await multicall.getCurrentBlockCoinbase()
