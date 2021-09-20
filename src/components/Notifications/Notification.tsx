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

const NotificationText = ({bold, children}: {bold?: boolean, children: ReactNode }) => {
  const fontSize = '14px'
  const fontFamily = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
  const fontWeight = 'bolder'

  return bold
    ? <p style={{fontSize, fontFamily, fontWeight}}>{children}</p>
    : <p style={{fontSize, fontFamily}}>{children}</p>
}

const titleText = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.Failed:
      return 'Transaction Failed'
    case TransactionStatus.Succeeded:
      return 'Transaction Succeeded'
    case TransactionStatus.UnexpectedError:
      return 'Unexpected Error'
    case TransactionStatus.Pending:
      throw 'Notification: Pending notification not supported.'
    default:
      assertUnreachable(status)
  }
  return <></>
}

export default ({data, onClose}: {data: notificationData, onClose: () => void}) => {
  return (
    <div style={{
      width: '270px',
      backgroundColor: '#161616',
      marginBottom: '24px',
      padding: '8px',
      boxShadow: '0 2px 6px 0 rgb(0 0 0 / 20%)',
    }}>
      <Row middle='xs'>
        <Col style={{paddingLeft: 16, paddingRight: 16}} xs={2}>
          <WarningIcon status={data.status} />
        </Col>
        <Col xs={8}>
          <NotificationText bold>{titleText(data.status)}</NotificationText>
          <NotificationText>{data.message}</NotificationText>
          <NotificationText>{data.hash}</NotificationText>
        </Col>
        <Col xs={2}>
          <Close24 aria-label="close" onClick={onClose}/>
        </Col>
      </Row>
    </div>
  )
}
