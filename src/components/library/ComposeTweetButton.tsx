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
import { Button, ButtonKind} from 'carbon-components-react'

export enum TweetType {
  Mild,
  Medium,
  Spicy,
}

export const tweets: {[tweetType in TweetType]: string} = 
{
  [TweetType.Mild]:
    '@trustlessfi is building the future of Defi on zkSync. Try out the fully functional zkSync demo! trustless.fi/demo',
  [TweetType.Medium]:
    '@trustlessfi is reinventing airdrops. During genesis, the Trustless Currency Protocol distributes tokens to all participants equally regardless of wealth. Try it out: trustless.fi/demo',
  [TweetType.Spicy]:
    'Defi is centralized: DAI is wrapped USDC, COMP is controlled by 4 VCs, and TERRA\'s collateral is off-chain. @trustlessfi is building the future of defi on zkSync. Try it out: trustless.fi/demo',
}

export const ComposeTweetButton = ({
  tweetType,
  buttonTitle,
  kind,
}: {
  tweetType?: TweetType,
  buttonTitle?: string
  kind?: ButtonKind
}) => {

  if (tweetType === undefined) tweetType = TweetType.Medium

  const queryParams = (new URLSearchParams({ text: tweets[tweetType]})).toString()

  const composeTweetURL = `https://twitter.com/intent/tweet?${queryParams}`

  return (
    <Button
      size="small"
      kind={kind}
      renderIcon={Launch32}
      onClick={() => window.open(composeTweetURL)}>
      {buttonTitle === undefined ? 'Tweet' : buttonTitle}
    </Button>
  )
}

export default ComposeTweetButton
