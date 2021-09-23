// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED

import { Web3Provider } from '@ethersproject/providers'
import { Contract, utils as ethersUtils, ethers } from 'ethers'
import { getAddress, rootContracts } from '../Addresses'

import { enforce, first, unscale } from '../'
import getProvider, { getChainID } from '../getProvider'
import { contract as getContract } from '../getContract'

import { TcpMulticallViewOnly } from '../typechain'

import tcpMulticallViewOnlyArtifact from '../artifacts/contracts/core/auxiliary/TcpMulticallViewOnly.sol/TcpMulticallViewOnly.json'

export const Number = (result: any) => result as number
export const Boolean = (result: any) => result as boolean
export const Address = (result: any) => result as string
export const String = (result: any) => result as string
export const StringArray = (result: any) => result as string[]
export const BigNumber = (result: any) => result as ethers.BigNumber
export const BigNumberToNumber = (result: any) => (result as ethers.BigNumber).toNumber()
export const BigNumberUnscale = (result: any) => unscale(result as ethers.BigNumber)
export const BigNumberUnscaleDecimals = (decimals: number) => (result: any) => unscale(result as ethers.BigNumber, decimals)

type resultConverter =
  typeof Number |
  typeof Boolean |
  typeof Address |
  typeof String |
  typeof StringArray |
  typeof BigNumber |
  typeof BigNumberToNumber |
  typeof BigNumberUnscale

interface Call<CallType extends resultConverter> {
  id: string
  contract: Contract
  func: string
  args: any[]
  converter: CallType
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

export const getMulticall = <Functions extends {[key in string]: resultConverter}> (
  contract: Contract,
  funcs: Functions,
  args?: {[key in keyof Functions]?: any[]},
) => {
  return Object.fromEntries(Object.entries(funcs).map(([func, converter]) => {
    const args0 = args === undefined ? [] : args.hasOwnProperty(func) ? args[func] : [];
    const args1 = args0 === undefined ? [] : args0
    const {inputs, outputs, encoding } = getCallMetadata(contract, func, args1)

    return [func, {
      id: func,
      contract,
      func,
      args: args1,
      converter,
      inputs,
      outputs,
      encoding
    }]
  })) as {[K in keyof Functions]: Call<Functions[K]>}
}

export const getDuplicateFuncMulticall = <
  ConverterType extends resultConverter,
  SpecificCalls extends {[key in string]: any[]}
>(
  contract: Contract,
  func: string,
  converter: ConverterType,
  calls: SpecificCalls,
) => {
  return Object.fromEntries(Object.entries(calls).map(([id, args]) => {
    const {inputs, outputs, encoding } = getCallMetadata(contract, func, args)

    return [id, {
      id,
      contract: contract,
      func: func,
      args,
      converter: converter,
      inputs,
      outputs,
      encoding,
    }]
  })) as {[K in keyof SpecificCalls]: Call<ConverterType>}
}

export const executeMulticall = async <Functions extends {[key in string]: resultConverter}> (
  contract: Contract,
  funcs: Functions,
  args?: {[key in keyof Functions]?: any[]},
  provider?: Web3Provider,
) => {
  const multicall = getMulticall(contract, funcs, args)

  return (await executeMulticalls({aMulticall: multicall}, provider)).aMulticall
}

export const executeMulticalls = async <
  Multicalls extends {[key in string]: {[key in string]: Call<resultConverter>}}
>(
  multicalls: Multicalls,
  provider?: Web3Provider,
) => {
  const multicallContract = getContract<TcpMulticallViewOnly>(
    getAddress(await getChainID(), rootContracts.TcpMulticall),
    tcpMulticallViewOnlyArtifact.abi,
    provider === undefined ? getProvider() : provider,
  )

  const calls = Object.values(multicalls).map(multicall => Object.values(multicall)).flat()

  const rawResults = await multicallContract.all(calls.map(
    call => ({ target: call.contract.address, callData: call.encoding })
  ))

  const abiCoder = new ethersUtils.AbiCoder()
  const results = Object.fromEntries(
    rawResults.returnData.map((rawResult, index) => {
      const call = calls[index]
      const resultsArray = Object.values(abiCoder.decode(call.outputs!, rawResult))
      // TODO as needed: support more than one result
      enforce(resultsArray.length === 1, 'More than one result')
      return [call.id, call.converter(first(resultsArray))]
    })
  )

  return Object.fromEntries(Object.entries(multicalls).map(([multicallName, functions]) =>
    [
      multicallName,
      Object.fromEntries(Object.keys(functions).map(id =>
        [
          id,
          results[id]!
        ]
      ))
    ]
  )) as {
    [Multicall in keyof Multicalls]: {
      [FunctionID in keyof Multicalls[Multicall]]: ReturnType<Multicalls[Multicall][FunctionID]['converter']>
    }
  }
}

const getCallMetadata = (contract: Contract, func: string, args: any[]) => {
  const matchingFunctions = Object.values(contract.interface.functions).filter(interfaceFunction => interfaceFunction.name === func)
  enforce(matchingFunctions.length >= 1, 'No matching functions found for ' + func)
  enforce(matchingFunctions.length <= 1, 'Multiple matching functions found for ' + func)

  const fragment = first(matchingFunctions)
  const stateMutability = fragment.stateMutability
  const inputs = fragment.inputs
  const outputs = fragment.outputs

  enforce(!fragment.payable, 'function ' + func + ' is payable')
  enforce(stateMutability === 'view' || stateMutability === 'pure', 'function ' + func + ' mutates state')
  enforce(
    inputs.length === args.length,
    'Incorrect args sent to function ' + func + ': ' + inputs.length + 'required, ' + args.length + 'given')

  const encoding = contract.interface.encodeFunctionData(func, args)

  return {inputs, outputs, encoding}
}
