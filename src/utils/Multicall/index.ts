import { Web3Provider } from '@ethersproject/providers'
import { FunctionFragment  } from '@ethersproject/abi'
import { Contract, utils as ethersUtils, BigNumber } from 'ethers'

import { enforce, first, unscale } from '../'
import getProvider from '../getProvider'

import { TcpMulticallViewOnly } from '../typechain'

import tcpMulticallViewOnlyArtifact from '../artifacts/contracts/mocks/TcpMulticallViewOnly.sol/TcpMulticallViewOnly.json'

interface Call {
  func: string,
  conversion: ResultConversion,
  args: any[] | undefined,
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

export enum ResultConversion {
  Number,
  BigNumber,
  BigNumberToNumber,
  BigNumberUnscale,
}

const convertResult = (result: any, conversion: ResultConversion) => {
  switch(conversion) {
    case ResultConversion.Number:
      return result as number
    case ResultConversion.BigNumber:
      return result as BigNumber
    case ResultConversion.BigNumberToNumber:
      return (result as BigNumber).toNumber()
    case ResultConversion.BigNumberUnscale:
      return unscale(result as BigNumber)
  }
}

const MULTICALL_ADDRESS = '0x153900C946e33AED5F1ee79C92E149A262E2B1E9'

class Multicall {
  contract: Contract
  calls: Call[] = []
  result: {[key in string]: ReturnType<typeof convertResult>} = {}
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

  addCallWithArgs(func: string, conversion: ResultConversion, args: any[] = []) {
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
      conversion,
      inputs,
      outputs,
      encoding: this.contract.interface.encodeFunctionData(func, args)
    })
  }

  async execute<T extends {}>(calls: {[key in string]: ResultConversion}): Promise<T> {
    for (const [func, conversion] of Object.entries(calls)) this.addCallWithArgs(func, conversion, [])

    const rawResults = await this.multicall.all(this.calls.map(
      call => ({ target: this.contract.address, callData: call.encoding })
    ))

    rawResults.returnData.map((rawResult, index) => {
      const call = this.calls[index]
      const resultsArray = Object.values(this.abiCoder.decode(call.outputs!, rawResult))
      enforce(resultsArray.length === 1, 'More than one result')
      this.result[call.func] = convertResult(first(resultsArray), call.conversion)
    })

    return this.result as unknown as T
  }
}

export default (contract: Contract, provider?: Web3Provider) => new Multicall(contract, provider)
