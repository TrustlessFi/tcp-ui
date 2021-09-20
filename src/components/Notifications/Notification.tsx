import { useDispatch } from 'react-redux'
import { notificationClosed, addNotification, } from '../../slices/notifications'
import { Row, Col } from 'react-flexbox-grid'
import { ReactNode } from 'react'
import { TransactionStatus } from '../../slices/transactions'
import { ErrorFilled24, CheckmarkFilled24, UnknownFilled24, Close24 } from '@carbon/icons-react';
import { getOpacityTransition } from '../utils'
import { assertUnreachable, timeMS } from '../../utils'
import { notificationInfo } from '../../slices/notifications'
import { useEffect, useState, useRef } from "react";
import { TransactionType } from '../../slices/transactions/index';
import FinishAction from './FinishAction'
import { useAppDispatch } from '../../app/hooks';


const warnColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.Failed:
      return '#da1e28'
    case TransactionStatus.Succeeded:
      return '#2f7138'
    case TransactionStatus.UnexpectedError:
      return '#fad76e'
    case TransactionStatus.Pending:
      throw 'Notification: Pending notification not supported.'
    default:
      assertUnreachable(status)
  }
  return ''
}

const WarningIcon = ({status}: {status: TransactionStatus}) => {
  const style = {fill: warnColor(status)}
  switch (status) {
    case TransactionStatus.Failed:
      return <ErrorFilled24 aria-label="Error" style={style}  />
    case TransactionStatus.Succeeded:
      return <CheckmarkFilled24 aria-label="Success" style={style}  />
    case TransactionStatus.UnexpectedError:
      return <UnknownFilled24 aria-label="Success" style={style}  />
    case TransactionStatus.Pending:
      throw 'Notification: Pending notification not supported.'
    default:
      assertUnreachable(status)
  }
  return <></>
}

const NotificationText = ({large, children}: {large?: boolean, children: ReactNode }) => {
  const fontFamily = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'

  return <p style={{fontSize: large ? 18 : 14, fontFamily}}>{children}</p>
}

const NOTIFICATION_DURATION_SECONDS = 12
const FADE_OUT_MS = 300

export default ({ data, }: { data: notificationInfo, }) => {
  const dispatch = useAppDispatch()

  const iconWidth = 56
  const totalWidth = 400
  const paddingRight = 40

  const calculateLoadingBarWidth = () => {
    const duration = timeMS() - data.startTimeMS
    const portion = duration / (NOTIFICATION_DURATION_SECONDS * 1000)
    return (1 - portion) * totalWidth
  }

  const [ loadingBarWidth, setLoadingBarWidth ] = useState(calculateLoadingBarWidth())
  const [ visible, setVisible ] = useState(true)

  const endTime = data.startTimeMS + (NOTIFICATION_DURATION_SECONDS * 1000)

  const closeCalled = useRef(false)

  const close = () => {
    if (closeCalled.current) return
    closeCalled.current = true

    clearInterval()
    setVisible(false)
    setTimeout(() => dispatch(notificationClosed(data.hash)), FADE_OUT_MS)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimeMS = timeMS()
      if (currentTimeMS > endTime) {
        close()
      } else {
        setLoadingBarWidth(calculateLoadingBarWidth())
      }
    }, (NOTIFICATION_DURATION_SECONDS * 1000) / 250)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      width: totalWidth,
      opacity: visible ? 1 : 0,
      backgroundColor: '#161616',
      marginBottom: 12,
      padding: '8px',
      paddingTop: 16,
      paddingBottom: 16,
      boxShadow: '0 2px 6px 0 rgb(0 0 0 / 20%)',
      overflowWrap: 'break-word',
      position: 'relative',
      ...getOpacityTransition(0.3)
    }}>
      <Col>
        <Row middle='xs' style={{paddingRight}}>
          <Col style={{paddingLeft: 16, width: iconWidth}}>
            <WarningIcon status={data.status} />
          </Col>
          <Col style={{width: (totalWidth - iconWidth) - paddingRight}}>
            <NotificationText large>{data.message}{data.message}{data.message}</NotificationText>
            <NotificationText>{data.hash}{data.hash}</NotificationText>
          </Col>
        </Row>
      </Col>
      <div style={{
        width: loadingBarWidth,
        display: visible ? 'block' : 'none',
        height: 3,
        backgroundColor: warnColor(data.status),
        position: 'absolute',
        bottom: 0,
        left: 0,
      }} />
      <Close24 aria-label="close" onClick={close} style={{
        position: 'absolute',
        top: 8,
        right: 8,
        cursor: 'pointer',
      }} />
      <FinishAction type={data.type} />
    </div>
  )
}
