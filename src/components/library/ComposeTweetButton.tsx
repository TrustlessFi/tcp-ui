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
  Mild = 'Mild',
  Medium = 'Medium',
  Spicy = 'Spicy',
}

export const tweets: {[tweetType in TweetType]: string} =
{
  [TweetType.Mild]:
    '@trustlessfi is building the future of Defi on @zkSync. Try out the fully functional demo: trustless.fi/discord',
  [TweetType.Medium]:
    '@trustlessfi is reinventing airdrops. Tcp genesis distributes tokens equally regardless of wealth. Join the community: trustless.fi/discord',
  [TweetType.Spicy]:
    'Defi is centralized: DAI is wrapped USDC, COMP is controlled by 4 VCs, and UST\'s collateral is off-chain. @trustlessfi is building the future of defi on @zkSync. Join the community: trustless.fi/discord',
}

const tokens: {[token in string]: ReactNode} = {
  '@trustlessfi': <a href='https://trustless.fi/twitter' target='blank'>@trustlessfi</a>,
  '@zkSync': <a href='https://trustless.fi/zksync' target='blank'>@zkSync</a>,
  'trustless.fi/discord': <a href='https://trustless.fi/discord' target='blank'>trustless.fi/discord</a>,
}

export const getTweetElement = (tweetType: TweetType): ReactNode => {

  type mixedReactText = (ReactNode | string)[]

  const replaceTSX = (outerParts: mixedReactText, token: string, replace: ReactNode) => {
    const result = []

    for(let i = 0; i < outerParts.length; i++) {
      const outerPart = outerParts[i]
        console.log({outerParts, token, outerPart, i})
      if (typeof outerPart === 'string') {
        const innerParts = outerPart.split(token)
        innerParts.map((innerPart, index) => {
          result.push(innerPart)
          if (index !== innerParts.length - 1) {
            result.push(replace)
          }
        })
      } else {
        result.push(outerPart)
      }
    }
    return result.flat()
  }

  let tokenizedString: mixedReactText = [tweets[tweetType]]
  Object.keys(tokens).map(token => tokenizedString = replaceTSX(tokenizedString, token, tokens[token]))
  return <span>{tokenizedString}</span>
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
