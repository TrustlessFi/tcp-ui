// import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  InlineNotification,
  Link,
} from 'carbon-components-react'
import OneColumnDisplay from './OneColumnDisplay'
import Text from './Text'
import Bold from './Bold'
// import waitFor from '../../slices/waitFor'

const TestnetBanner = ({}:{}) => {
  // const dispatch = useAppDispatch()

  return (
    <div style={{marginTop: 0}}>
      <OneColumnDisplay
        columnOne={
          <InlineNotification
            notificationType='inline'
            kind='info'
            hideCloseButton
            title={
              <Text>
                Discuss and request testnet assets{' '}
                <Link href='http://discord.gg/pNxCph5CKk' target='_blank'>
                  here
                </Link>
                .
              </Text>
            }
            lowContrast
          />
        }
        loading={false}
      />
    </div>
  )
}

export default TestnetBanner
