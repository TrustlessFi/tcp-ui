// import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  InlineNotification,
  NotificationKind,
  Link,
} from 'carbon-components-react'
import Text from './Text'
import Center from './Center'

const InformationBanner = ({
  isCloseable,
  onClose,
  text,
  link,
  kind,
}:{
  isCloseable?: boolean
  onClose?: () => void
  text: string
  link?: string
  kind?: NotificationKind
}) => {
  return (
    <Center>
      <InlineNotification
        notificationType='inline'
        kind={kind !== undefined ? kind : 'info'}
        hideCloseButton={isCloseable === false}
        onCloseButtonClick={onClose}
        title={
          <Text>
            {text}
            {
              link === undefined
              ? null
              : <>
                  {' '}
                  <Link href={link} target='_blank'>
                    here
                  </Link>
                  .
                </>
            }
          </Text>
        }
        lowContrast
      />
    </Center>
  )
}


export default InformationBanner
