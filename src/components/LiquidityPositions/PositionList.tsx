import React from 'react';
import { Button } from 'carbon-components-react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForLiquidityPositions } from '../../slices/waitFor'
import { formatPositionForUniswap } from '../../utils';

import AppTile from '../library/AppTile'
import UniswapPositionList from '../uniswap/src/components/PositionList';
import UniswapWrapper from './UniswapWrapper';

const PositionList = () => {
  const history = useHistory();
  const dispatch = useAppDispatch()

  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)

  const uniswapFormattedPositions = liquidityPositions && Object.values(liquidityPositions).map(formatPositionForUniswap);

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
        {uniswapFormattedPositions && (
          <UniswapWrapper>
            {/* @ts-ignore */} 
            <UniswapPositionList positions={uniswapFormattedPositions} />
          </UniswapWrapper>
        )}
      </div>
    </AppTile>
  )
}

export default PositionList