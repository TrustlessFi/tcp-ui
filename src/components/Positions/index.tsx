import { Switch, Route } from 'react-router-dom'
import ManagePosition from './ManagePosition'
import UpdatePosition from './UpdatePosition'
import CreatePosition from './CreatePosition'
import ExistingPositions from './ExistingPositions'
import { UI_VERSION } from '../../constants'
import { red, orange, green } from '@carbon/colors';

const Positions = () => {
  if (UI_VERSION === 2) {
    return (
      <ManagePosition />
    )
  }

  return (
    <Switch>
      <Route exact path={['/', '/positions']}>
        <ExistingPositions />
      </Route>
      <Route path='/positions/new'>
        <CreatePosition />
      </Route>
      <Route path='/positions/:positionID'>
        <UpdatePosition />
      </Route>
    </Switch>
  )
}

export const getCollateralRatioColor = (
  collateralization: number,
  collateralRatioRequirement: number,
) => {
    if (collateralization < collateralRatioRequirement * 1.1) return red[50]
    else if (collateralization < collateralRatioRequirement * 1.5) return orange
    else return green[50]
}

export default Positions
