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

export type MCCall<T extends resultConverter> = {[key in string]: T}

export type MCCallAny = MCCall<resultConverter>

export type MCCallResult = {[key in string]: ReturnType<resultConverter>}

interface Call {
  contract: Contract
  id?: string | undefined
  func: string
  converter: resultConverter
  args: any[] | undefined
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

type ResultType<T extends resultConverter, MCCallType extends MCCall<T>> = { [FunctionName in keyof MCCallType]: ReturnType<MCCallType[FunctionName]> }

abstract class MulticallObject<T extends resultConverter, MCCallType extends MCCall<T>> {
  contract: Contract
  parsedCalls: Call[] = []
  result:  ResultType<T, MCCallType> | undefined

  constructor( contract: Contract ) { this.contract = contract }

  addCallWithArgs(func: string, args: any[], converter: resultConverter, id?: string | undefined) {
    const matchingFunctions = Object.values(this.contract.interface.functions).filter(interfaceFunction => interfaceFunction.name === func)
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

    this.parsedCalls.push({
      contract: this.contract,
      func,
      id,
      args,
      converter,
      inputs,
      outputs,
      encoding: this.contract.interface.encodeFunctionData(func, args)
    })
  }

  parseResult(results: MCCallResult) {
    const resultsStorage: MCCallResult = {}
    this.parsedCalls.map(call => {
      const id = call.id === undefined ? call.func : call.id
      if (results.hasOwnProperty(id)) resultsStorage[id] = results[id]
    })
    this.result = resultsStorage as ResultType<T, MCCallType>
    return this.result
  }

  getResult() {
    return this.result!
  }
}

export class Multicall<T extends resultConverter, CallType extends MCCall<T>> extends MulticallObject<T, CallType>{
  constructor(
    contract: Contract,
    calls: CallType,
    args: { [K in keyof CallType]?: any[] } = {},
  ) {
    super(contract)

    for (const [func, converter] of Object.entries(calls)) {
      const argList = args[func]
      this.addCallWithArgs(func, argList === undefined ? [] : argList, converter)
    }
  }
}

export class DuplicateFuncMulticall<T extends resultConverter, CallType extends MCCall<T>> extends MulticallObject<T, CallType>{
  constructor(
    contract: Contract,
    func: string,
    converter: T,
    calls: {id: string, args: any[]}[],
  ) {
    super(contract)

    calls.map(call => this.addCallWithArgs(func, call.args, converter, call.id))
  }
}

export const executeMulticalls = async <
  ConverterType extends resultConverter,
  MulticallsType extends {[key in string]: MulticallObject<ConverterType, MCCall<ConverterType>>},
>(
  multicalls: MulticallsType,
  provider?: Web3Provider,
) => {

  const multicallContract = getContract<TcpMulticallViewOnly>(
    getAddress(await getChainID(), rootContracts.TcpMulticall),
    tcpMulticallViewOnlyArtifact.abi,
    provider === undefined ? getProvider() : provider,
  )

  let calls: Call[] = []
  Object.values(multicalls).map(multicall => calls = calls.concat(multicall.parsedCalls))

  const rawResults = await multicallContract.all(calls.map(
    call => ({ target: call.contract.address, callData: call.encoding })
  ))

  const abiCoder = new ethersUtils.AbiCoder()
  const result: MCCallResult = {}

  rawResults.returnData.map((rawResult, index) => {
    const call = calls[index]
    const resultsArray = Object.values(abiCoder.decode(call.outputs!, rawResult))
    // TODO as needed: support more than one result
    enforce(resultsArray.length === 1, 'More than one result')
    const id = call.id === undefined ? call.func : call.id
    result[id] = call.converter(first(resultsArray))
  })

  return Object.fromEntries(Object.entries(multicalls).map(([multicallName, multicall]) => [
    multicallName,
    multicall.parseResult(result)
  ])) as {[MulticallName in keyof MulticallsType]: ResultType<ConverterType, MCCall<ConverterType>> }
}

/*
export const executeMulticall = async <T extends MCCallAny>(
  contract: Contract,
  calls: T,
  args: { [K in keyof T]?: any[] },
) => {
  const multicallExecutor = new MulticallExecutor()
  const multicall = new Multicall(contract, calls, args)
  await multicallExecutor.executeMulticalls([multicall])
  return multicall.getResult()
}
*/
