import { Switch, Route } from 'react-router-dom'
import UpdatePosition from './UpdatePosition'
import CreatePosition from './CreatePosition'
import ExistingPositions from './ExistingPositions'
import ExistingPositions2 from './ExistingPositions2'
import { UI_VERSION } from '../../constants'
import { red, orange, green, yellow } from '@carbon/colors';

const Positions = () => (
  <Switch>
    <Route exact path={['/', '/positions']}>
      {
        UI_VERSION === 2
        ? <ExistingPositions2 />
        : <ExistingPositions />
      }
    </Route>
    <Route path='/positions/new'>
      <CreatePosition />
    </Route>
    <Route path='/positions/:positionID'>
      <UpdatePosition />
    </Route>
  </Switch>
)

export const getCollateralRatioColor = (
  collateralization: number,
  collateralRatioRequirement: number,
) => {
    if (collateralization < collateralRatioRequirement * 1.1) return red[50]
    else if (collateralization < collateralRatioRequirement * 1.5) return orange
    else return green[50]
}

export default Positions
