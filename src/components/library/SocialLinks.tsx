import { ReactNode} from 'react'
import {
  LogoGithub32,
  LogoTwitter32,
  LogoDiscord32,
} from '@carbon/icons-react'
import SpacedList from './SpacedList'
import {
  Link,
} from 'carbon-components-react'
import { convertSVGtoURI } from '../../utils/'
import TrustlessLogos, { TrustlessLogoColor } from './TrustlessLogos'

export const SocialLink = ({
  icon,
  href,
}: {
  icon: ReactNode
  href: string
}) => {
  return (
    <span onClick={() => window.open(href)} style={{cursor: 'pointer'}}>
      {icon}
    </span>
  )
}


const SocialLinks = () => {
  return (
    <SpacedList
      row
      spacing={10}
      style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 1000 }}>
      <SocialLink
        icon={<LogoGithub32 />}
        href='https://github.com/trustlessfi'
      />
      <SocialLink
        icon={<LogoTwitter32 />}
        href='https://twitter.com/trustlessfi'
      />
      <SocialLink
        icon={<LogoDiscord32 />}
        href='http://discord.gg/pNxCph5CKk'
      />
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
    </SpacedList>
  )
}

export default SocialLinks
