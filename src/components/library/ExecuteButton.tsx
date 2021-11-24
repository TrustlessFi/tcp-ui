import { Button, ButtonKind, ButtonSize } from "carbon-components-react"
import React, { CSSProperties, FunctionComponent } from "react"

interface ExecuteButtonLabelProps {
  notExecuted: string
  executing: string
  executed: string
}

export interface ExecuteButtonProps {
  buttonLabel: ExecuteButtonLabelProps
  executing: boolean
  executed: boolean
  onClick: (...args: any[]) => any
  kind?: ButtonKind
  disabled?: boolean
  size?: ButtonSize
  style?: CSSProperties
}

export const ExecuteButton: FunctionComponent<ExecuteButtonProps> = ({
  buttonLabel: {
    notExecuted: buttonNotExecuted,
    executing: buttonExecuting,
    executed: buttonExecuted
  },
  executing,
  executed,
  onClick,
  kind = 'primary',
  disabled = false,
  size = 'default',
  style = { marginTop: 8, width: '50%' }
}) => (
  <Button disabled={executing || executed || disabled} onClick={onClick} kind={kind} size={size} style={style}>
    {executed ? buttonExecuted : (executing ? buttonExecuting : buttonNotExecuted)}
  </Button>
)
