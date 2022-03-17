import ActionStepCard from './ActionStepCard'
import SpacedList from './SpacedList'
import LargeText from './LargeText'
import Text from './Text'
import { TransactionArgs } from '../../slices/transactions'

const ActionSteps = ({
  steps,
  disabled,
  action,
}: {
  steps: {
    txArgs: TransactionArgs,
    title: string,
    buttonTitle: string,
    complete?: boolean
  }[],
  disabled: boolean
  action: string
}) => {
  let currentStep = 0

  return (
    <SpacedList spacing={20}>
      <SpacedList spacing={10}>
        <LargeText>One time setup</LargeText>
        <Text size={14} lineHeight="16px">
          You are {action} for the first time so you must first
          approve the following transactions.
        </Text>
      </SpacedList>
      <SpacedList spacing={20}>
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
              />
            )
          })
        }
      </SpacedList>
    </SpacedList>
  )
}

export default ActionSteps
