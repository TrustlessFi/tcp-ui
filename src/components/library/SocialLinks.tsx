import { ReactNode} from 'react'
import {
  LogoGithub32,
  LogoTwitter32,
  LogoDiscord32,
  Launch32,
} from '@carbon/icons-react'
import SpacedList from './SpacedList'
import Center from './Center'
import { convertSVGtoURI } from '../../utils/'
import TrustlessLogos, { TrustlessLogoColor } from './TrustlessLogos'
import { Button } from 'carbon-components-react'
import { isMobile } from 'react-device-detect'

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
  const shareButton =
    <Button
      onClick={() => window.open('https://twitter.com/trustlessfi/status/1516941542329622532')}
      renderIcon={Launch32}
      size='sm'>
      Retweet Trustless
    </Button>


  const siteLink =
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

  const discordLink =
    <SocialLink
      icon={<LogoDiscord32 />}
      href='http://discord.gg/pNxCph5CKk'
    />

  const twitterLink =
    <SocialLink
      icon={<LogoTwitter32 />}
      href='https://twitter.com/trustlessfi'
    />

  const githubLink =
    <SocialLink
      icon={<LogoGithub32 />}
      href='https://github.com/trustlessfi'
    />

  return (
    isMobile
    ? <SpacedList spacing={20} style={{marginBottom: 20, marginTop: 20}}>
        <Center>
          {shareButton}
        </Center>
        <Center>
          <SpacedList row spacing={10}>
            {siteLink}
            {discordLink}
            {twitterLink}
            {githubLink}
          </SpacedList>
        </Center>
      </SpacedList>
    : <SpacedList
        row
        spacing={10}
        style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 1000 }}>
        <span style={{marginRight: 10}}>
          {shareButton}
        </span>
        {siteLink}
        {discordLink}
        {twitterLink}
        {githubLink}
      </SpacedList>
  )
}

export default SocialLinks
