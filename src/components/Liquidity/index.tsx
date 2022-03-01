import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import waitFor from '../../slices/waitFor'
import { Switch, Route } from 'react-router-dom'
import { LiquidityPage, setLiquidityPage, setCurrentPool } from '../../slices/liquidityPage'
import { assertUnreachable } from '../../utils'
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
