import { Web3Provider } from '@ethersproject/providers'
import { Contract, utils as ethersUtils, ethers } from 'ethers'

import { enforce, first } from '../'
import getProvider from '../getProvider'

import { TcpMulticallViewOnly } from '../typechain'

import tcpMulticallViewOnlyArtifact from '../artifacts/contracts/mocks/TcpMulticallViewOnly.sol/TcpMulticallViewOnly.json'

interface RawCall {
  func: string,
  args: any[] | undefined,
}

interface Call extends RawCall {
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

const MULTICALL_ADDRESS = '0x153900C946e33AED5F1ee79C92E149A262E2B1E9'

class Multicall {
  contract: Contract
  calls: Call[] = []
  result: unknown
  provider: Web3Provider

  constructor(contract: Contract, provider?: Web3Provider) {
    this.contract = contract
    this.provider = provider === undefined
      ? getProvider()
      : provider
  }

  add(calls: string[]) {
    calls.map(call => this.addCallWithArgs(call, []))
  }

  addCallWithArgs(func: string, args: any[] = []) {
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
      inputs,
      outputs,
      encoding: this.contract.interface.encodeFunctionData(func, args)
    })
  }

  async execute() {
    const multicall = new Contract(
      MULTICALL_ADDRESS,
      tcpMulticallViewOnlyArtifact.abi,
      this.provider,
    ) as TcpMulticallViewOnly

    const rawResults = await multicall.all(this.calls.map(
      call => ({ target: this.contract.address, callData: call.encoding })
    ))

    const abiCoder = new ethersUtils.AbiCoder()

    const multicallResult = rawResults.returnData.map((rawResult, index) => {
      const resultsArray = Object.values(abiCoder.decode(this.calls[index].outputs!, rawResult))
      return resultsArray.length === 1
        ? first(resultsArray)
        : resultsArray
    })
    this.result = multicallResult
    return multicallResult
  }
}

export default (contract: Contract, provider?: Web3Provider) => new Multicall(contract, provider)
