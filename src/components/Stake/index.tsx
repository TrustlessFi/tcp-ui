import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect, ReactElement } from 'react'
import waitFor from '../../slices/waitFor'
import { Switch, Route } from 'react-router-dom'
import ViewStake from './ViewStake'
import IncreaseStake from './IncreaseStake'
import DecreaseStake from './DecreaseStake'
import { StakePage, setStakePage } from '../../slices/staking'
import { assertUnreachable } from '../../utils'

const stakePageToView = (stakePage: StakePage): ReactElement => {
  switch(stakePage) {
    case StakePage.View:
      return <ViewStake />
    case StakePage.Add:
      return <IncreaseStake />
    case StakePage.Withdraw:
      return <DecreaseStake />
  }
}

const Stake = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const currentLocation = useLocation()

  const {
    staking
  } = waitFor([
    'staking',
  ], selector, dispatch)

  const stakePage = staking.stakePage

  useEffect(() => {
    const currentPath = currentLocation.pathname
    if (currentPath.startsWith('/stake/add')) dispatch(setStakePage(StakePage.Add))
    else if (currentPath.startsWith('/stake/withdraw')) dispatch(setStakePage(StakePage.Withdraw))
    else if (currentPath.startsWith('/stake')) dispatch(setStakePage(StakePage.View))
  }, [])


  useEffect(() => {
    const updatePath = (dest: string) => {
      if (currentLocation.pathname !== dest) history.push(dest)
    }

    switch(stakePage) {
      case StakePage.View:
        updatePath('/stake')
        break
      case StakePage.Add:
        updatePath('/stake/add')
        break
      case StakePage.Withdraw:
        updatePath('/stake/withdraw')
        break
      default:
        assertUnreachable(stakePage)
    }
  }, [stakePage])

  return (
    <Switch>
      <Route path={['/stake']}>
        {stakePageToView(stakePage)}
      </Route>
    </Switch>
  )
}

export default Stake
