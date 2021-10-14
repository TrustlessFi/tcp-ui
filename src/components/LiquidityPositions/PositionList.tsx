import { Button } from 'carbon-components-react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'

import { waitForLiquidityPositions , waitForPools } from '../../slices/waitFor'

import AppTile from '../library/AppTile'
import UniswapPositionList from '../uniswap/src/components/PositionList';
import UniswapWrapper from './UniswapWrapper';
import RelativeLoading from '../library/RelativeLoading';
import { positionToUniswapPosition } from '../../utils/uniswapUtils';

const PositionList = () => {
  const history = useHistory();
  const dispatch = useAppDispatch()

  const pools = waitForPools(selector, dispatch)
  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)

  if (liquidityPositions === null || pools === null) {
    return (
      <AppTile title='Liquidity Positions' style={{position: 'relative'}}>
        <UniswapWrapper>
          <RelativeLoading show />
        </UniswapWrapper>
      </AppTile>
    )
  }

  const uniswapFormattedPositions = Object.values(liquidityPositions.positions).map(position =>
    positionToUniswapPosition(position, pools[position.pool]))

  return (
    <AppTile title='Liquidity Positions'>
      <Button
          className='add-liquidity-button'
          kind='primary'
          onClick={() => history.push('/liquidity/add')}
          size='sm'
          tabIndex={0}
          type='submit'>
        New Position
      </Button>
      <div className='position-list-container'>
        {uniswapFormattedPositions && (
          <UniswapWrapper>
            <UniswapPositionList positions={uniswapFormattedPositions} />
          </UniswapWrapper>
        )}
      </div>
    </AppTile>
  )
}

export default PositionList
