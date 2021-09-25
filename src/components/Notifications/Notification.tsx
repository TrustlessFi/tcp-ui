import { notificationClosed } from '../../slices/notifications'
import { Row, Col } from 'react-flexbox-grid'
import { ReactNode } from 'react'
import { TransactionStatus } from '../../slices/transactions'
import { ErrorFilled24, CheckmarkFilled24, Close24 } from '@carbon/icons-react';
import { getOpacityTransition } from '../utils'
import ExplorerLink from '../utils/ExplorerLink'
import { assertUnreachable, timeMS, isTxHash } from '../../utils'
import { notificationInfo } from '../../slices/notifications'
import { getTxHash } from '../../slices/transactions'
import { getTxNamePastTense, getTxNamePresentTense } from '../../slices/transactions'
import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from '../../app/hooks';


const statusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.Pending:
      throw new Error('Notification: Pending notification not supported.')
    case TransactionStatus.Success:
      return '#2f7138'
    case TransactionStatus.Failure:
      return '#da1e28'
    default:
      assertUnreachable(status)
  }
  return ''
}

const NotificationIcon = ({status}: {status: TransactionStatus}) => {
  const style = {fill: statusColor(status)}
  switch (status) {
    case TransactionStatus.Pending:
      throw new Error('Notification: Pending notification not supported.')
    case TransactionStatus.Success:
      return <CheckmarkFilled24 aria-label="Success" style={style}  />
    case TransactionStatus.Failure:
      return <ErrorFilled24 aria-label="Error" style={style}  />
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

const Notification = ({ data, }: { data: notificationInfo, }) => {
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

  const hash = getTxHash(data)

  const close = () => {
    if (closeCalled.current) return
    closeCalled.current = true

    clearInterval()
    setVisible(false)
    setTimeout(() => dispatch(notificationClosed(getTxHash(data))), FADE_OUT_MS)
  }

  const explorerLink = isTxHash(hash)
    ? <ExplorerLink txHash={hash}>View on Explorer</ExplorerLink>
    : null

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
  })

  const title = data.status === TransactionStatus.Failure
    ? getTxNamePastTense(data.type)
    : getTxNamePresentTense(data.type)

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
            <NotificationIcon status={data.status} />
          </Col>
          <Col style={{width: (totalWidth - iconWidth) - paddingRight}}>
            <NotificationText large>{title}</NotificationText>
            {explorerLink}
          </Col>
        </Row>
      </Col>
      <div style={{
        width: loadingBarWidth,
        display: visible ? 'block' : 'none',
        height: 3,
        backgroundColor: statusColor(data.status),
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
    </div>
  )
}

export default Notification
