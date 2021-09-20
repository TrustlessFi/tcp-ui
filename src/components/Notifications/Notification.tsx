import { Row, Col } from 'react-flexbox-grid'
import { ReactNode } from 'react'
import { TransactionStatus } from '../../slices/transactions'
import { ErrorFilled24, CheckmarkFilled24, UnknownFilled24, Close24 } from '@carbon/icons-react';
import { assertUnreachable } from '../../utils'
import { notificationData } from '../../slices/notifications'

const WarningIcon = ({status}: {status: TransactionStatus}) => {
  switch (status) {
    case TransactionStatus.Failed:
      return <ErrorFilled24 aria-label="Error" style={{fill: '#da1e28'}}  />
    case TransactionStatus.Succeeded:
      return <CheckmarkFilled24 aria-label="Success" style={{fill: '#2f7138'}}  />
    case TransactionStatus.UnexpectedError:
      return <UnknownFilled24 aria-label="Success" style={{fill: '#fad76e'}}  />
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

export default ({data, onClose}: {data: notificationData, onClose: () => void}) => {
  const iconWidth = 56
  const totalWidth = 400



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
        <Row middle='xs'>
          <Col style={{paddingLeft: 16, paddingRight: 16, width: iconWidth}}>
            <WarningIcon status={data.status} />
          </Col>
          <Col style={{width: totalWidth - iconWidth}}>
            <NotificationText large>{data.message}</NotificationText>
            <NotificationText>{data.hash}</NotificationText>
          </Col>
        </Row>
      </Col>
      <Close24 aria-label="close" onClick={onClose} style={{position: 'absolute', top: 8, right: 8}} />
    </div>
  )
}
