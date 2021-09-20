import { useDispatch } from 'react-redux'
import { useAppSelector as selector, useAppDispatch } from '../../app/hooks'
import { addNotification, } from '../../slices/notifications'
import { Button } from 'carbon-components-react'
import { TransactionStatus } from '../../slices/transactions'
import { useRef } from "react";
import { randomInRange } from '../../utils'
import { clearPositions } from '../../slices/positions'

import { TransactionType } from '../../slices/transactions/index';
import { assertUnreachable } from '../../utils/index';
import { waitForPositions } from '../../slices/waitFor';


export default ({type}: {type: TransactionType}) => {
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
