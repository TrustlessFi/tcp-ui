import { ReactNode} from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  LogoGithub32,
  LogoTwitter32,
  LogoDiscord32,
  Launch32,
} from '@carbon/icons-react'
import SpacedList from './SpacedList'
import ComposeTweetButton from './ComposeTweetButton'
import {
  Link,
} from 'carbon-components-react'
import { convertSVGtoURI } from '../../utils/'
import TrustlessLogos, { TrustlessLogoColor } from './TrustlessLogos'
import { Button, ButtonSize } from 'carbon-components-react'
import { Tab, tabToPath } from '../../App'
import waitFor from '../../slices/waitFor'

export const SocialLink = ({
  icon,
  href,
}: {
  icon: ReactNode
  href: string
}) => {
  return (
    <span
      onClick={() => window.open(href)}
      style={{cursor: 'pointer'}}>
      {icon}
    </span>
  )
}

const SocialLinks = () => {
  /*
  const dispatch = useAppDispatch()
  const history = useHistory()

  const navigateToWallet = () => {
    history.push(tabToPath(Tab.Transactions))
    dispatch(setTab(Tab.Transactions))
  }
  */

  return (
    <SpacedList
      row
      spacing={10}
      style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 1000 }}>
      <span style={{marginRight: 10}}>
        <Button
          onClick={() => window.open('https://twitter.com/trustlessfi/status/1516941542329622532')}
          renderIcon={Launch32}
          size='small'>
          Retweet Trustless
        </Button>
      </span>
      <SocialLink
        icon={
          <img
            alt="Trustless Finance"
            src={convertSVGtoURI(TrustlessLogos[TrustlessLogoColor.White]['TDao'])}
            width={32}
            height={32}
          />
        }
        href='https://www.trustless.fi/'
      />
      <SocialLink
        icon={<LogoDiscord32 />}
        href='http://discord.gg/pNxCph5CKk'
      />
      <SocialLink
        icon={<LogoTwitter32 />}
        href='https://twitter.com/trustlessfi'
      />
      <SocialLink
        icon={<LogoGithub32 />}
        href='https://github.com/trustlessfi'
      />
    </SpacedList>
  )
}

export default SocialLinks
