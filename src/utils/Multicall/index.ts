// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED

import { Web3Provider } from '@ethersproject/providers'
import { Contract, utils as ethersUtils, ethers } from 'ethers'
import { getAddress, rootContracts } from '../Addresses'

import { enforce, first, unscale } from '../'
import getProvider, { getChainID } from '../getProvider'
import { contract as getContract } from '../getContract'

import { TcpMulticallViewOnly } from '../typechain'

import tcpMulticallViewOnlyArtifact from '../artifacts/contracts/mocks/TcpMulticallViewOnly.sol/TcpMulticallViewOnly.json'

export const Number = (result: any) => result as number
export const Boolean = (result: any) => result as boolean
export const Address = (result: any) => result as string
export const String = (result: any) => result as string
export const StringArray = (result: any) => result as string[]
export const BigNumber = (result: any) => result as ethers.BigNumber[]
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

interface RawCall {
  id: string,
  contract: Contract,
  func: string,
  args: any[],
  converter: resultConverter,
}

interface Call extends RawCall {
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

export const getMulticall = <FunctionArgs extends {[key in string]: resultConverter}>(
  contract: Contract,
  funcs: FunctionArgs,
  args?: {[key in keyof FunctionArgs]?: any[]}
): {[key in keyof FunctionArgs]: RawCall} =>
  Object.fromEntries(Object.entries(funcs).map(([func, converter]) => {
    return [func, {
      id: func,
      contract,
      func,
      args: args === undefined ? [] : (args[func] === undefined ? [] : args[func]!),
      converter,
    }]
  })) as {[key in keyof FunctionArgs]: RawCall}

export const getDuplicateFuncMulticall = <SpecificCalls extends {[key in string]: any[]}>(
  contract: Contract,
  func: string,
  converter: resultConverter,
  calls: SpecificCalls,
): {[key in keyof SpecificCalls]: RawCall} =>
  Object.fromEntries(Object.entries(calls).map(([id, args]) =>
    [id, {
      id,
      contract: contract,
      func: func,
      args,
      converter: converter,
    }]
  )) as {[key in keyof SpecificCalls]: RawCall}

const rawCallToCall = (rawCall: RawCall): Call => {
  const id = rawCall.id
  const contract = rawCall.contract
  const func = rawCall.func
  const args = rawCall.args
  const converter = rawCall.converter

  const matchingFunctions = Object.values(rawCall.contract.interface.functions).filter(interfaceFunction => interfaceFunction.name === func)
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

  return {
    id,
    contract,
    func,
    args,
    converter,
    inputs,
    outputs,
    encoding: contract.interface.encodeFunctionData(func, args)
  }
}

export const executeMulticalls = async <
  Multicalls extends {[key in string]: {[key in string]: RawCall}},
>(
  multicalls: Multicalls,
  provider?: Web3Provider,
) => {
  const multicallContract = getContract<TcpMulticallViewOnly>(
    getAddress(await getChainID(), rootContracts.TcpMulticall),
    tcpMulticallViewOnlyArtifact.abi,
    provider === undefined ? getProvider() : provider,
  )

  let calls: Call[] = []
  Object.values(multicalls).map(multicall => calls.concat(Object.values(multicall).map(rawCall => rawCallToCall(rawCall))))

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

  return Object.fromEntries(Object.entries(multicalls).map(([multicallName, multicallData]) =>
    [
      multicallName,
      Object.fromEntries(Object.keys(multicallData).map(id =>
        [
          id,
          results[id]
        ]
      ))
    ]
  )) as {
    [Multicall in keyof Multicalls]: {
      [FunctionID in keyof Multicalls[Multicall]]: ReturnType<Multicalls[Multicall][FunctionID]['converter']>
    }
  }
}
