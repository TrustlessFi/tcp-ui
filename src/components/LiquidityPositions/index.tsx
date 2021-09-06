import { Switch, Route } from "react-router-dom";

// import AddLiquidity from './AddLiquidity';
import CreatePosition from './CreatePosition';
import PositionList from './PositionList';
// import PositionDetails from './PositionDetails';
// import RemoveLiquidity from './RemoveLiquidity';

const LiquidityPositions = () => (
    <Switch>
        <Route
          path='/liquidity/add/:currencyIdA?/:currencyIdB?/:feeAmount?'
          render={routeProps => (
            <CreatePosition {...routeProps} />
          )}
        />
        {/*<Route
          exact
          strict
          path='/liquidity/increase/:currencyIdA?/:currencyIdB?/:feeAmount?/:positionId?'
          render={routeProps => (
            <AddLiquidity {...routeProps} />
          )}
        />
        <Route
          path = '/liquidity/remove/:positionId'
          render={routeProps => (
            <RemoveLiquidity {...routeProps} />
          )}
        />
        <Route
          path='/liquidity/position/:positionId'
          render={routeProps => (
            <PositionDetails {...routeProps} />
          )}
        />*/}
        <Route path='/liquidity'>
          <PositionList />
        </Route>
    </Switch>
);

export default LiquidityPositions;