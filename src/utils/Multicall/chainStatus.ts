// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED


import { TrustlessMulticall } from '../typechain'
import { BigNumberish } from 'ethers'


export const getCurrentBlockDifficulty = async (multicall: TrustlessMulticall) =>
  await multicall.getCurrentBlockDifficulty()

export const getCurrentBlockGasLimit = async (multicall: TrustlessMulticall) =>
  await multicall.getCurrentBlockGasLimit()

export const getCurrentBlockTimestamp = async (multicall: TrustlessMulticall) =>
  await multicall.getCurrentBlockTimestamp()

export const getEthBalance = async (multicall: TrustlessMulticall, address: string) =>
  await multicall.getEthBalance(address)

export const getBlockNumber = async (multicall: TrustlessMulticall) =>
  await multicall.getBlockNumber()

export const getBlockHash = async (multicall: TrustlessMulticall, blockNumber: BigNumberish) =>
  await multicall.getBlockHash(blockNumber)

export const getLastBlockHash = async (multicall: TrustlessMulticall) =>
  await multicall.getLastBlockHash()

export const getCurrentBlockCoinbase = async (multicall: TrustlessMulticall) =>
  await multicall.getCurrentBlockCoinbase()
