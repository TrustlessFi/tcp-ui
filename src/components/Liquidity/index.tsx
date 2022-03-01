import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { useHistory, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import waitFor from '../../slices/waitFor'
import { Switch, Route } from 'react-router-dom'
import { LiquidityPage, setLiquidityPage } from '../../slices/liquidityPage'
import { assertUnreachable } from '../../utils'
import ViewLiquidity from './ViewLiquidity'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'

const liquidityPageToView = (liquidityPage: LiquidityPage) => {
  switch(liquidityPage) {
    case LiquidityPage.View:
      return <ViewLiquidity />
    case LiquidityPage.Add:
      return <AddLiquidity />
    case LiquidityPage.Remove:
      return <RemoveLiquidity />
    default:
      assertUnreachable(liquidityPage)
  }
}

const Stake = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const currentLocation = useLocation()

  const {
    liquidityPage,
  } = waitFor([
    'liquidityPage',
  ], selector, dispatch)

  console.log({liquidityPage})

  const currentLiquidityPage = liquidityPage.liquidityPage

  useEffect(() => {
    const currentPath = currentLocation.pathname

    if (currentPath.startsWith('/liquidity/add')) dispatch(setLiquidityPage(LiquidityPage.Add))
    else if (currentPath.startsWith('/liquidity/remove')) dispatch(setLiquidityPage(LiquidityPage.Remove))
    else if (currentPath.startsWith('/liquidity')) dispatch(setLiquidityPage(LiquidityPage.View))
  }, [])


  useEffect(() => {
    const updatePath = (dest: string) => {
      if (currentLocation.pathname !== dest) history.replace(dest)
    }

    switch(currentLiquidityPage) {
      case LiquidityPage.View:
        updatePath('/liquidity')
        break
      case LiquidityPage.Add:
        updatePath('/liquidity/add')
        break
      case LiquidityPage.Remove:
        updatePath('/liquidity/remove')
        break
      default:
        assertUnreachable(currentLiquidityPage)
    }
  }, [currentLiquidityPage])

  return (
    <Switch>
      <Route path={['/liquidity']}>
        {liquidityPageToView(currentLiquidityPage)}
      </Route>
    </Switch>
  )
}

export default Stake
