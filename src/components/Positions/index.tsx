import { Switch, Route } from 'react-router-dom'
import UpdatePosition from './UpdatePosition'
import CreatePosition from './CreatePosition'
import ExistingPositions from './ExistingPositions'
import ExistingPositions2 from './ExistingPositions2'
import { UI_VERSION } from '../../constants'

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

export default Positions
