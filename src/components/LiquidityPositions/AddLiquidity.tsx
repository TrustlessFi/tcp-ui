import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { getContractWaitFunction, waitForLiquidityPositions } from '../../slices/waitFor'
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

    if (rewardsAddress === null || liquidityPositions === null) {
      return (
        <div className='add-liquidity-container' style={{position: 'relative'}}>
            <UniswapWrapper>
                <RelativeLoading show />
            </UniswapWrapper>
        </div>
      )
    }

    const positionId = Number(props.match.params.positionId)
    const chainId = selector(state => state.chainID.chainID)

    const position = liquidityPositions.positions[positionId]
    const uniswapFormattedPosition = (position && chainId) ? positionToUniswapPosition(chainId, position) : undefined

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
