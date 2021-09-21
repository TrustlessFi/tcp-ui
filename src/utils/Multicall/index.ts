import { Web3Provider } from '@ethersproject/providers'
import { Contract, utils as ethersUtils, ethers } from 'ethers'

import { enforce, first, unscale } from '../'
import getProvider from '../getProvider'

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
export type MCArgCall = {[key in string]: {converter: resultConverter, args: any[]}}

interface Call {
  func: string,
  converter: resultConverter,
  args: any[] | undefined,
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

const MULTICALL_ADDRESS = '0x153900C946e33AED5F1ee79C92E149A262E2B1E9'

class Multicall {
  contract: Contract
  calls: Call[] = []
  result: {[key in string]: ReturnType<resultConverter>} = {}
  provider: Web3Provider
  multicall: TcpMulticallViewOnly
  abiCoder: ethersUtils.AbiCoder

  constructor(contract: Contract, provider?: Web3Provider) {
    this.contract = contract

    this.provider = provider === undefined
      ? getProvider()
      : provider

    this.multicall = new Contract(
      MULTICALL_ADDRESS,
      tcpMulticallViewOnlyArtifact.abi,
      this.provider,
    ) as TcpMulticallViewOnly

    this.abiCoder = new ethersUtils.AbiCoder()
  }

  addCallWithArgs(func: string, converter: resultConverter, args: any[]) {
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

    this.calls.push({
      func,
      args,
      converter,
      inputs,
      outputs,
      encoding: this.contract.interface.encodeFunctionData(func, args)
    })
  }




  async execute<T extends MCCall, V extends MCArgCall>(calls: T | V) {
    for (const [func, converter] of Object.entries(calls)) this.addCallWithArgs(func, converter, [])

    const rawResults = await this.multicall.all(this.calls.map(
      call => ({ target: this.contract.address, callData: call.encoding })
    ))

    rawResults.returnData.map((rawResult, index) => {
      const call = this.calls[index]
      const resultsArray = Object.values(this.abiCoder.decode(call.outputs!, rawResult))
      // TODO as needed: support more than one result
      enforce(resultsArray.length === 1, 'More than one result')
      this.result[call.func] = call.converter(first(resultsArray))
    })

    return this.result as { [K in keyof T]: ReturnType<T[K]> }
  }
}

export default (contract: Contract, provider?: Web3Provider) => new Multicall(contract, provider)