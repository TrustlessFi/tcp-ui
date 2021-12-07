import CreateLiquidityPosition from './CreateLiquidityPosition'
import UpdateLiquidityPosition from './UpdateLiquidityPosition'
import IncreaseLiquidityPosition from './IncreaseLiquidityPosition'
import ExistingLiquidityPositions from './ExistingLiquidityPositions'
import { Switch, Route } from 'react-router-dom'

const LiquidityPositions = () => (
  <Switch>
    <Route exact path='/liquidity'>
      <ExistingLiquidityPositions />
    </Route>
    <Route path='/liquidity/new/:poolAddress'>
      <CreateLiquidityPosition />
    </Route>
    <Route path='/liquidity/increase/:poolAddress/:positionID'>
      <IncreaseLiquidityPosition />
    </Route>
  </Switch>
)

export default LiquidityPositions
