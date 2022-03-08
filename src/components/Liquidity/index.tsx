import { Switch, Route } from 'react-router-dom'
import ViewLiquidity from './ViewLiquidity'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'

const Liquidity = () => {

  return (
    <Switch>
      <Route exact path={['/liquidity']}>
        <ViewLiquidity />
      </Route>
      <Route path='/liquidity/add/:poolIDString'>
        <AddLiquidity />
      </Route>
      <Route path='/liquidity/remove/:poolIDString'>
        <RemoveLiquidity />
      </Route>
    </Switch>
  )
}

export default Liquidity
