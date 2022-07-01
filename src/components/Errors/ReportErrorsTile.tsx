import { useState } from 'react'
import { Tile, Button } from 'carbon-components-react'
import LargeText from '../library/LargeText'
import TrustlessTooltip from '../library/TrustlessTooltip'
import { numDisplay, sum } from '../../utils'
import AsyncJsonRequest, { RequestType } from '../../utils/asyncJsonRequest'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { removeErrors } from '../../slices/errors'
import waitFor from '../../slices/waitFor'

const ReportErrorsTitle = () => {
  const dispatch = useAppDispatch()

  const {
    errors,
  } = waitFor([
    'errors',
  ], selector, dispatch)

  const [ copyClicked, setCopyClicked ] = useState(false)

  const countErrors = errors.errors.length

  const tooltipText = (
    `If you are experiencing issues with the dapp, you can click this button to
    log your errors, including your address, to a server that will allow the community
    members building the dapp to view and debug your issue.
    This is completely optional. If you do not click this button, none of your
    information will be logged.
    Copy the Session Id and share in the Trustless Discord to get help!`
  )

  const request = new AsyncJsonRequest<typeof errors, string[]>({
    requestURL: 'https://trustless-error-endpoint.herokuapp.com/submitErrors',
    requestType: RequestType.POST,
    resultProcessor: (result: Record<string, any>) => result.errorsWritten,
  })

  const reportErrors = async () => {
    const completeErrorIDs = await request.execute(errors)
    dispatch(removeErrors(completeErrorIDs))
  }

  const sessionId = errors.sessionId

  const onCopyClick = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId)
    setCopyClicked(true)
    setTimeout(() => setCopyClicked(false), 2500)
  }

  return (
    <Tile style={{
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 40,
      paddingRight: 40,
      height: 72,
    }}>
      <div style={{display: 'float'}}>
        <div style={{float: 'right'}}>
          {
            errors.errors.length === 0 && sessionId !== null
              ? <Button
                  size='sm'
                  kind='secondary'
                  onClick={() => onCopyClick(sessionId)}>
                  {copyClicked ? 'Copied!' : 'Copy Session Id'}
                </Button>
              : <Button
                  size='sm'
                  kind='secondary'
                  disabled={errors.errors.length === 0}
                  onClick={reportErrors}>
                  Report Errors
                </Button>
          }
        </div>
        <div style={{display: 'float', alignItems: 'center'}}>
          <span style={{float: 'left', paddingTop: 2}}>
            <LargeText size={18} style={{marginLeft: 10}}>
              {numDisplay(countErrors)} Pending {countErrors === 1 ? 'Error' : 'Errors'}
            </LargeText>
            <span style={{position: 'relative', top: '2px', left: '4px'}}>
              <TrustlessTooltip text={tooltipText} />
            </span>
          </span>
        </div>
      </div>
    </Tile>
  )
}

export default ReportErrorsTitle
