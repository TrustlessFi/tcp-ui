import ViewLiquidity from './ViewLiquidity'
import AddLiquidity from './AddLiquidity'

import { Switch, Route } from 'react-router-dom'

const LiquidityPositions = () => (
  <Switch>
    <Route exact path='/liquidity'>
      <ViewLiquidity />
    </Route>
    <Route path='/liquidity/add/'>
      <AddLiquidity />
    </Route>
  </Switch>
)

export default LiquidityPositions
