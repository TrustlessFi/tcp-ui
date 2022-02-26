import { Switch, Route } from 'react-router-dom'
import ViewStake from './ViewStake'
import IncreaseStake from './IncreaseStake'
import DecreaseStake from './DecreaseStake'

const Stake = () => {
  return (
    <Switch>
      <Route exact path={['/stake']}>
        <ViewStake />
      </Route>
      <Route path='/stake/add'>
        <IncreaseStake />
      </Route>
      <Route path='/stake/withdraw'>
        <DecreaseStake />
      </Route>
    </Switch>
  )
}

export default Stake
