// import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  InlineNotification,
  Link,
} from 'carbon-components-react'
import OneColumnDisplay from './OneColumnDisplay'
import Text from './Text'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { setBannerClosed } from '../../slices/testnetBanner'
import { Tab } from '../../App'

const TestnetBanner = ({}:{}) => {
  const dispatch = useAppDispatch()

  const {
    testnetBanner,
    tabs,
  } = waitFor([
    'testnetBanner',
    'tabs',
  ], selector, dispatch)

  const banner =
    <OneColumnDisplay
      columnOne={
        <InlineNotification
          notificationType='inline'
          kind='info'
          hideCloseButton={tabs.currentTab === Tab.Transactions}
          onCloseButtonClick={() => dispatch(setBannerClosed(true))}
          title={
            <Text>
              Discuss the testnet and request assets{' '}
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

  return (
    tabs.currentTab === Tab.Transactions || testnetBanner.bannerClosed === false
    ? banner
    : null
  )
}

export default TestnetBanner
