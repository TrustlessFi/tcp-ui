import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import waitFor from '../../slices/waitFor'
import { numDisplay } from '../../utils/'
import { getAPR } from './library'
import { years } from '../../utils/'
import OneColumnDisplay from '../library/OneColumnDisplay'
import SpacedList from '../library/SpacedList'
import Text from '../library/Text'
import TitleText from '../library/TitleText'
import Bold from '../library/Bold'
import { Tile, Button } from 'carbon-components-react'
import { setStakePage, StakePage } from '../../slices/staking'

const ViewStake = () => {
  const dispatch = useAppDispatch()

  const {
    balances,
    marketInfo,
    ratesInfo,
    sdi,
    contracts,
  } = waitFor([
    'balances',
    'marketInfo',
    'ratesInfo',
    'sdi',
    'contracts',
  ], selector, dispatch)

  const userAddress = selector(state => state.userAddress)

  const [multiplier, setMultiplier] = useState(1.0)

  const dataNull =
    balances === null ||
    marketInfo === null ||
    ratesInfo === null ||
    sdi === null ||
    contracts === null

  const apr = dataNull ? 0 : getAPR({
    marketInfo,
    ratesInfo,
    sdi,
    lentHue:
      balances === null || contracts === null
        ? 0
        : balances.tokens[contracts.Hue].balances.Accounting
  })

  const protoLentHueCount = dataNull ? 0 : balances.tokens[contracts.LendHue].userBalance * marketInfo.valueOfLendTokensInHue
  const lentHueCount = protoLentHueCount < 1e-3 ? 0 : protoLentHueCount

  const UPDATE_FREQUENCY_MS = 100

  useEffect(() => {
    const aprPerInterval = 1 + ((apr / years(1)) / (1000 / UPDATE_FREQUENCY_MS))
    const interval = setInterval(() => {
      setMultiplier(multiplier => multiplier * aprPerInterval)
    }, UPDATE_FREQUENCY_MS);

    return () => clearInterval(interval);
  }, [apr])

  const aprDisplay = numDisplay(apr * 100, 2)

  return (
    <OneColumnDisplay loading={userAddress !== null && dataNull} >
      <Tile style={{marginTop: 40, padding: 40}}>
        <SpacedList spacing={40}>
          <SpacedList spacing={20}>
            <TitleText>
              Staked Balance
            </TitleText>
            <SpacedList spacing={5} row>
              <TitleText>
                {numDisplay(lentHueCount * multiplier, 8)}
              </TitleText>
              <Text>
                Hue
              </Text>
            </SpacedList>
            <Text style={{opacity: 0.7}}>
              Current APR:
              {' '}
              <Bold>{aprDisplay}%</Bold>
            </Text>
          </SpacedList>
          <SpacedList row spacing={20}>
            <Button
              key='stake'
              onClick={() => dispatch(setStakePage(StakePage.Add))}
              size='md'
              kind='primary'>
              Deposit
            </Button>
            <Button
              key='withdraw'
              onClick={() => dispatch(setStakePage(StakePage.Withdraw))}
              size='md'
              kind='secondary'>
              Withdraw
            </Button>
          </SpacedList>
        </SpacedList>
      </Tile>
    </OneColumnDisplay>
  )
}

export default ViewStake
