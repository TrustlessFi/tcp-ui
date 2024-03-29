import OneColumnDisplay from './OneColumnDisplay'
import SpacedList from './SpacedList'
import InformationBanner from './InformationBanner'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { setDiscordBannerClosed, setTutorialBannerClosed } from '../../slices/testnetBanner'
import { Tab } from '../../App'


const TestnetBanners = () => {
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
    <OneColumnDisplay loading={false} >
      <SpacedList spacing={-20}>
        {
          testnetBanner.discordBannerClosed && isCloseable
          ? null
          : <InformationBanner
              isCloseable={isCloseable}
              onClose={() => dispatch(setDiscordBannerClosed(true))}
              text='Discuss the testnet and request assets'
              link='http://discord.gg/pNxCph5CKk'
            />
        }
        {
          testnetBanner.tutorialBannerClosed && isCloseable
          ? null
          : <InformationBanner
              isCloseable={isCloseable}
              onClose={() => dispatch(setTutorialBannerClosed(true))}
              text='Learn more about Trustless Currency Protocol'
              link='https://www.trustless.fi/blog/using-the-trustless-currency-protocol'
            />
        }
      </SpacedList>
    </OneColumnDisplay>
  )
}

export default TestnetBanners
