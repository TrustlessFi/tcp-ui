import { Row, Col } from 'react-flexbox-grid'
import { ReactNode } from 'react'
import { TransactionStatus } from '../../slices/transactions'
import { ErrorFilled24, CheckmarkFilled24, UnknownFilled24, Close24 } from '@carbon/icons-react';
import { assertUnreachable, timeMS } from '../../utils'
import { notificationInfo } from '../../slices/notifications'
import { useEffect, useState } from "react";


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

export default (
  {
    data,
    durationSeconds,
    onClose
  }: {
    data: notificationInfo,
    durationSeconds: number,
    onClose: () => void
  }) => {
  const iconWidth = 56
  const totalWidth = 400
  const paddingRight = 40

  const [ loadingBarWidth, setLoadingBarWidth ] = useState(totalWidth)

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimeMS = timeMS()
      if (currentTimeMS > data.startTimeMS + (durationSeconds * 1000)) {
        onClose()
      } else {
        const duration = currentTimeMS - data.startTimeMS
        const portion = duration / (durationSeconds * 1000)
        const width = (1 - portion) * totalWidth

        setLoadingBarWidth(width)
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);


  return (
    <div style={{
      width: totalWidth,
      backgroundColor: '#161616',
      marginBottom: 12,
      padding: '8px',
      paddingTop: 16,
      paddingBottom: 16,
      boxShadow: '0 2px 6px 0 rgb(0 0 0 / 20%)',
      overflowWrap: 'break-word',
      position: 'relative',
    }}>
      <Col>
        <Row middle='xs' style={{paddingRight}}>
          <Col style={{paddingLeft: 16, width: iconWidth}}>
            <WarningIcon status={data.status} />
          </Col>
          <Col style={{width: (totalWidth - iconWidth) - paddingRight}}>
            <NotificationText large>{data.message}</NotificationText>
            <NotificationText>{data.hash}</NotificationText>
          </Col>
        </Row>
      </Col>
      <div style={{
        width: loadingBarWidth,
        height: 3,
        backgroundColor: warnColor(data.status),
        position: 'absolute',
        bottom: 0,
        left: 0,
      }} />
      <Close24 aria-label="close" onClick={onClose} style={{
        position: 'absolute',
        top: 8,
        right: 8,
        cursor: 'pointer',
      }} />
    </div>
  )
}
