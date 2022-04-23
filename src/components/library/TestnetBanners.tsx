// import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  InlineNotification,
  Link,
} from 'carbon-components-react'
import OneColumnDisplay from './OneColumnDisplay'
import Text from './Text'
import SpacedList from './SpacedList'
import Center from './Center'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { setDiscordBannerClosed, setTutorialBannerClosed } from '../../slices/testnetBanner'
import { Tab } from '../../App'

const TestnetBanner = ({
  isCloseable,
  onClose,
  text,
  link,
}:{
  isCloseable?: boolean
  onClose?: () => void
  text: string
  link?: string
}) => {
  return (
    <Center>
      <InlineNotification
        notificationType='inline'
        kind='info'
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

const TestnetBanners = ({}:{}) => {
  const dispatch = useAppDispatch()

  const {
    testnetBanner,
    tabs,
  } = waitFor([
    'testnetBanner',
    'tabs',
  ], selector, dispatch)

  const isCloseable = tabs.currentTab !== Tab.Transactions

  return (
    <OneColumnDisplay
      columnOne={
        <SpacedList spacing={-20}>
          {
            testnetBanner.discordBannerClosed && isCloseable
            ? null
            : <TestnetBanner
                isCloseable={isCloseable}
                onClose={() => dispatch(setDiscordBannerClosed(true))}
                text='Discuss the testnet and request assets'
                link='http://discord.gg/pNxCph5CKk'
              />
          }
          {
            testnetBanner.tutorialBannerClosed && isCloseable
            ? null
            : <TestnetBanner
                isCloseable={isCloseable}
                onClose={() => dispatch(setTutorialBannerClosed(true))}
                text='Learn more about Trustless Currency Protocol'
                link='https://www.trustless.fi/blog/using-the-trustless-currency-protocol'
              />
          }
        </SpacedList>
      }
      loading={false}
    />
  )
}

export default TestnetBanners
