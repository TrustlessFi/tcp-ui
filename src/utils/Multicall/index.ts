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

export type MCCall = {[key in string]: resultConverter}

export type MCCallResult = {[key in string]: ReturnType<resultConverter>}

class Multicall <T extends MCCall>{
  contract: Contract
  calls: T
  args: { [K in keyof T]?: any[] }
  result: { [K in keyof T]: ReturnType<T[K]> } | undefined

  constructor(
    contract: Contract,
    calls: T,
    args: { [K in keyof T]?: any[] },
  ) {
    this.contract = contract
    this.calls = calls
    this.args = args
  }

  parseResult(results: { [K in keyof T]: ReturnType<T[K]> }) {
    const resultsStorage: MCCallResult = {}
    for (const [func, result] of Object.entries(results)) {
      if (this.calls.hasOwnProperty(func)) resultsStorage[func] = result
    }
    this.result = resultsStorage as { [K in keyof T]: ReturnType<T[K]> }
  }

  getResult() {
    return this.result!
  }
}

interface Call {
  contract: Contract
  func: string
  converter: resultConverter
  args: any[] | undefined
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

class MulticallExecutor {
  calls: Call[] = []
  provider: Web3Provider

  constructor(provider?: Web3Provider) {
    this.provider = provider === undefined
      ? getProvider()
      : provider
  }

  addCallWithArgs(contract: Contract, func: string, converter: resultConverter, args: any[]) {
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

    this.calls.push({
      contract,
      func,
      args,
      converter,
      inputs,
      outputs,
      encoding: contract.interface.encodeFunctionData(func, args)
    })
  }

  async getMulticall() {
    return getContract<TcpMulticallViewOnly>(
      getAddress(await getChainID(), rootContracts.TcpMulticall),
      tcpMulticallViewOnlyArtifact.abi,
      this.provider
    )
  }

  async executeMulticalls(multicalls: Multicall<MCCall>[]) {
    multicalls.map(multicall => {
      for (const [func, converter] of Object.entries(multicall.calls)) {
        const args = multicall.args[func]
        this.addCallWithArgs(multicall.contract, func, converter, args === undefined ? [] : args)
      }
    })

    const rawResults = await (await this.getMulticall()).all(this.calls.map(
      call => ({ target: call.contract.address, callData: call.encoding })
    ))

    const abiCoder = new ethersUtils.AbiCoder()
    const result: MCCallResult = {}

    rawResults.returnData.map((rawResult, index) => {
      const call = this.calls[index]
      const resultsArray = Object.values(abiCoder.decode(call.outputs!, rawResult))
      // TODO as needed: support more than one result
      enforce(resultsArray.length === 1, 'More than one result')
      result[call.func] = call.converter(first(resultsArray))
    })

    multicalls.map(multicall => multicall.parseResult(result))
  }
}

export const executeMulticall = async <T extends MCCall>(
  contract: Contract,
  calls: T,
  args: { [K in keyof T]?: any[] },
) => {
  const multicallExecutor = new MulticallExecutor()
  const multicall = new Multicall(contract, calls, args)
  await multicallExecutor.executeMulticalls([multicall])
  return multicall.getResult()
}

/* // TODO not sure how to do this iwth the types
export const executeMulticalls = async <T extends MCCall>(
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
