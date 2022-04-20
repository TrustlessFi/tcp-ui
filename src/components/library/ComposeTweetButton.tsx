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

export const ComposeTweetButton = ({
  tweetText,
  url,
  buttonTitle,
  kind,
}: {
  tweetText: string
  url?: string
  buttonTitle?: string
  kind?: ButtonKind
}) => {
  const params: {text: string } | {text: string, url: string} =
    url === undefined
    ? {text: tweetText}
    : {text: tweetText, url}

  const queryParams = (new URLSearchParams(params)).toString()

  const composeTweetURL = `https://twitter.com/intent/tweet?${queryParams}`

  return (
    <Button
      size="small"
      kind={kind}
      renderIcon={Launch32}
      onClick={() => window.open(composeTweetURL)}>
      {buttonTitle === undefined ? 'Publish Tweet' : buttonTitle}
    </Button>
  )
}

export default ComposeTweetButton
