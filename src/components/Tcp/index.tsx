import { Switch, Route } from 'react-router-dom'
import ViewTcp from './ViewTcp'
import AllocateTcp from './AllocateTcp'

const Liquidity = () => {

  return (
    <Switch>
      <Route exact path={['/tcp']}>
        <ViewTcp />
      </Route>
      <Route path='/tcp/allocate'>
        <AllocateTcp />
      </Route>
    </Switch>
  )
}

export default Liquidity
