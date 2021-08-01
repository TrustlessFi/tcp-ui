import React from 'react';
import { Button } from 'carbon-components-react';
import { withRouter, useHistory } from 'react-router';
import { useAppDispatch, useAppSelector as selector } from '../../../app/hooks'

import AppTile from '../library/AppTile'
import PositionList from '../uniswap/src/components/PositionList';
import UniswapWrapper from './UniswapWrapper';

const LiquidityPositions = ({}) => {
  const history = useHistory();

  return (
    <AppTile title='Liquidity Positions'>
      <Button
          className='add-liquidity-button'
          kind='primary'
          onClick={e => history.push('/liquidity/add')}
          size='sm'
          tabIndex={0}
          type='submit'
      >
        New Position
      </Button>
      <div className='position-list-container'>
        <UniswapWrapper>
            <PositionList positions={uniswapFormattedPositions} />
        </UniswapWrapper>
      </div>
    </AppTile>
  )
}

export default LiquidityPositions
