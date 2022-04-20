import { ReactNode} from 'react'
import {
  LogoGithub32,
  LogoTwitter32,
  LogoDiscord32,
  Launch32,
} from '@carbon/icons-react'
import SpacedList from './SpacedList'
import {
  Link,
} from 'carbon-components-react'
import { convertSVGtoURI } from '../../utils/'
import TrustlessLogos, { TrustlessLogoColor } from './TrustlessLogos'
import { Button, ButtonSize } from 'carbon-components-react'

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
  const queryParams = (new URLSearchParams({
    text: '@trustlessfi is building the future of Defi on zkSync. Try it out! ',
    url: 'trustless.fi/demo',
  })).toString()

  const composeTweetURL = `https://twitter.com/intent/tweet?${queryParams}`

  return (
    <SpacedList
      row
      spacing={10}
      style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 1000 }}>
      <span style={{marginRight: 10}}>
        <Button
          size="small"
          renderIcon={Launch32}
          onClick={() => window.open(composeTweetURL)}>
          Publish Tweet
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
