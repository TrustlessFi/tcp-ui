import ActionStepCard from './ActionStepCard'
import SpacedList from './SpacedList'
import { TransactionArgs } from '../../slices/transactions'

const ActionSteps = ({
  steps,
  disabled,
}: {
  steps: {
    txArgs: TransactionArgs,
    title: string,
    buttonTitle: string,
    complete?: boolean
  }[],
  disabled: boolean
}) => {
  let currentStep = 0

  return (
    <SpacedList spacing={1} style={{marginTop: 1}}>
      {
        steps.map((step, index) => {
          const stepNumber = index + 1
          const isCurrentStep = currentStep === 0 && !step.complete
          if (isCurrentStep) currentStep = stepNumber

          return (
            <ActionStepCard
              txArgs={step.txArgs}
              disabled={!isCurrentStep || disabled}
              step={stepNumber}
              title={step.title}
              buttonTitle={step.buttonTitle}
              complete={step.complete}
              isCompletable={stepNumber !== steps.length}
            />
          )
        })
      }
    </SpacedList>
  )
}

export default ActionSteps
