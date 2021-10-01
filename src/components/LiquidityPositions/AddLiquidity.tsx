import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { getContractWaitFunction, waitForLiquidityPositions , waitForPools } from '../../slices/waitFor'
import { addLiquidityToPosition } from '../../slices/liquidityPositions'
import { ProtocolContract } from  '../../slices/contracts'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { positionToUniswapPosition } from '../../utils/uniswapUtils'
import RelativeLoading from '../library/RelativeLoading'

import UniswapAddLiquidity from '../uniswap/src/pages/AddLiquidity'
import UniswapWrapper from './UniswapWrapper'

interface MatchParams {
    positionId?: string,
    currencyIdA?: string,
    currencyIdB?: string,
    feeAmount?: string,
}

const AddLiquidity = (props: RouteComponentProps<MatchParams>) => {
    const dispatch = useAppDispatch()

    const rewardsAddress = getContractWaitFunction(ProtocolContract.Rewards)(selector, dispatch)
    const liquidityPositions = waitForLiquidityPositions(selector, dispatch)
    const pools = waitForPools(selector, dispatch)

    const chainId = selector(state => state.chainID.chainID)

    if (
      rewardsAddress === null ||
      liquidityPositions === null ||
      pools === null ||
      chainId === null
    ) {
      return (
        <div className='add-liquidity-container' style={{position: 'relative'}}>
            <UniswapWrapper>
                <RelativeLoading show />
            </UniswapWrapper>
        </div>
      )
    }

    const positionId = Number(props.match.params.positionId)

    const position = liquidityPositions.positions[positionId]
    if (!pools.hasOwnProperty(position.pool)) throw new Error('Could not find pool object for position')

    const uniswapFormattedPosition = positionToUniswapPosition(position, pools[position.pool])

    return (
        <div className='add-liquidity-container'>
            <UniswapWrapper>
                <UniswapAddLiquidity
                    adding={!!position?.addingLiquidity}
                    addLiquidity={addLiquidityToPosition}
                    loading={!!liquidityPositions?.loading}
                    position={uniswapFormattedPosition}
                    spenderAddress={rewardsAddress}
                    {...props}
                />
            </UniswapWrapper>
        </div>
    )
}

export default AddLiquidity
