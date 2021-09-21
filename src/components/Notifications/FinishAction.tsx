import { useAppSelector as selector, useAppDispatch } from '../../app/hooks'
import { useRef } from "react";
import { clearPositions } from '../../slices/positions'

import { TransactionType } from '../../slices/transactions/index';
import { assertUnreachable } from '../../utils/index';
import { waitForPositions } from '../../slices/waitFor';


const FinishAction = ({type}: {type: TransactionType}) => {
  const dispatch = useAppDispatch()
  const finishActionExecuted = useRef(false)

  switch (type) {
    case TransactionType.CreatePosition:
      if (!finishActionExecuted.current) {
        finishActionExecuted.current = true
        dispatch(clearPositions())
      }

      waitForPositions(selector, dispatch)
      break
    default:
      assertUnreachable(type)
  }

  return <></>
}

export default FinishAction
