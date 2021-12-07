import CreateLiquidityPosition from './CreateLiquidityPosition'
import IncreaseLiquidityPosition from './IncreaseLiquidityPosition'
import DecreaseLiquidityPosition from './DecreaseLiquidityPosition'
import ExistingLiquidityPositions from './ExistingLiquidityPositions'
import { Switch, Route } from 'react-router-dom'

export enum IncreaseDecreaseOption {
  Increase = 'Increase',
  Decrease = 'Decrease',
}


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
    <Route path='/liquidity/decrease/:poolAddress/:positionID'>
      <DecreaseLiquidityPosition />
    </Route>
  </Switch>
)

export default LiquidityPositions
