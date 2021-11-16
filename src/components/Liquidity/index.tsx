import CreateLiquidityPosition from './CreateLiquidityPosition'
import UpdateLiquidityPosition from './UpdateLiquidityPosition'
import ExistingLiquidityPositions from './ExistingLiquidityPositions'
import { useAppSelector as selector } from '../../app/hooks'
import { Switch, Route } from 'react-router-dom'

const LiquidityPositions = () => {
  return (
    <Switch>
      <Route exact path='/liquidity'>
        <ExistingLiquidityPositions />
      </Route>
      <Route path='/liquidity/new/:poolAddress'>
        <CreateLiquidityPosition />
      </Route>
      <Route path='/liquidity/:positionID'>
        <UpdateLiquidityPosition />
      </Route>
    </Switch>
  );
}

export default LiquidityPositions
