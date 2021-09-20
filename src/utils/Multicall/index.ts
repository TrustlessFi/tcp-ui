import { Fragment, FunctionFragment, JsonFragment } from '@ethersproject/abi';
import { Contract, ContractFunction, ContractInterface, utils as ethersUtils, Transaction } from 'ethers'
import { enforce, first } from '../'
import getProvider from '../getProvider'

import { TcpMulticallViewOnly } from '../typechain'

import tcpMulticallViewOnlyArtifact from '../artifacts/contracts/mocks/TcpMulticallViewOnly.sol/TcpMulticallViewOnly.json'

interface Call {
  contract: Contract,
  func: string,
  args: any[],
}

interface CallWithEncoding extends Call {
  inputs: ethersUtils.ParamType[]
  outputs?: ethersUtils.ParamType[]
  encoding: string
}

const MULTICALL_ADDRESS = '0x153900C946e33AED5F1ee79C92E149A262E2B1E9'

export default async (calls: Call[]) => {
  const callsWithEncoding: CallWithEncoding[] = []

  calls.map(call => {
    const contract = call.contract
    const func = call.func
    const args = call.args

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

    callsWithEncoding.push({
      ...call,
      inputs,
      outputs,
      encoding: contract.interface.encodeFunctionData(func, args)
    })
  })

  const provider = getProvider()
  enforce(provider !== null, 'Multicall: Provider is null')
  const signer = provider!.getSigner()

  const multicall = new Contract(
    MULTICALL_ADDRESS,
    tcpMulticallViewOnlyArtifact.abi,
    provider!
  ) as TcpMulticallViewOnly

  const rawResults = await multicall.connect(signer).all(callsWithEncoding.map(call => ({ target: call.contract.address, callData: call.encoding})))

  const abiCoder = new ethersUtils.AbiCoder()

  const results: ethersUtils.Result[] = []

  for(let i = 0; i < rawResults.returnData.length; i++) {
    const result = abiCoder.decode(callsWithEncoding[i].outputs!, rawResults.returnData[i]);
    results.push(result)
  }

  return results
}
