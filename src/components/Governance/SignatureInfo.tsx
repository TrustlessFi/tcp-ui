import { CodeSnippet } from "carbon-components-react"
import { BigNumber, ethers } from "ethers"
import { FunctionComponent } from "react"
import { Proposal } from "../../slices/proposals"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForContracts } from '../../slices/waitFor'
import { ContractsInfo, ProtocolContract } from '../../slices/contracts'

const getSignatureInfoRawString = (target: string, signature: string, calldata: string): string => {
  const targetString = `target: ${target}`
  const signatureString = `signature: ${signature}`
  const calldataString = `calldata: ${calldata}`
  return `${targetString}\n${signatureString}\n${calldataString}`
}

const getSignatureInfoString = (contracts: ContractsInfo | null, targetAddress: string, signature: string, calldata: string): string => {
  const functionName = signature.split('(')[0]
  const functionParams = signature.split('(')[1].split(')')[0].split(', ')
  let parameterValues = []
  if (functionParams.length) {
    const values = ethers.utils.defaultAbiCoder.decode(functionParams, calldata)
    parameterValues = Object.values(values).map(value => {
      if (BigNumber.isBigNumber(value)) {
        return value.toString()
      }
      if (value.type === Number) {
        return value.toString()
      }
      return value
    })
  }
  const populatedSignature = `${functionName}(${parameterValues.join(', ')})`

  const matchingContracts = contracts === null
    ? []
    : Object.keys(contracts || {}).filter(key => contracts[key as ProtocolContract] === targetAddress);
  const targetContractName = matchingContracts.length !== 1 ? 'UnknownContract' : matchingContracts[0];

  return `${targetContractName}.${populatedSignature}`
}

const SignatureInfoWrapper: FunctionComponent<{ index: number }> = ({ index, children }) => (
  <div style={{ display: 'flex', marginTop: 8 }} key={index}>
    {index + 1}:
    <div style={{ marginLeft: 8 }}>
      {children}
    </div>
  </div>
)

export const SignatureInfo: FunctionComponent<{
  proposal: Proposal
  showRaw?: boolean,
}> = ({ showRaw = false, proposal }) => {
  const dispatch = useAppDispatch()

  const contracts = waitForContracts(selector, dispatch)

  const { proposal: p } = proposal
  return (
    <>
      {p.targets.map((_, index) => {
        return showRaw ? (
          <SignatureInfoWrapper index={index} key={`${p.targets[index]}-${index}`}>
            <CodeSnippet type="multi">
            {getSignatureInfoRawString(p.targets[index], p.signatures[index], p.calldatas[index])}
            </CodeSnippet>
          </SignatureInfoWrapper>
        ) : (
          <SignatureInfoWrapper index={index} key={`${p.targets[index]}-${index}`}>
            <CodeSnippet type="single">
              {getSignatureInfoString(contracts, p.targets[index], p.signatures[index], p.calldatas[index])}
            </CodeSnippet>
          </SignatureInfoWrapper>
          )
      })}
    </>
  )
}
