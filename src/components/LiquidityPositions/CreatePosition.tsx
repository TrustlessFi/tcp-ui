import { RouteComponentProps } from 'react-router-dom'
import { BigNumber } from 'ethers'
import { Position } from '@uniswap/v3-sdk'
import { Percent } from '@uniswap/sdk-core'

import { getContractWaitFunction, waitForLiquidityPositions, waitForPools, waitForTrustlessMulticallContract } from '../../slices/waitFor'
import { ProtocolContract } from  '../../slices/contracts'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { TransactionType, waitForTransaction } from '../../slices/transactions'

import AddLiquidity from '../uniswap/src/pages/AddLiquidity'
import UniswapWrapper from './UniswapWrapper'
import RelativeLoading from '../library/RelativeLoading'
import { inflateUniswapPool } from '../../utils/uniswapUtils'

const CreatePosition = (props: RouteComponentProps) => {
    const dispatch = useAppDispatch()

    const multicallContract = waitForTrustlessMulticallContract(selector, dispatch)
    const rewardsContract = getContractWaitFunction(ProtocolContract.Rewards)(selector, dispatch)

    const chainId = selector(state => state.chainID.chainID)
    const rewardsAddress = getContractWaitFunction(ProtocolContract.Rewards)(selector, dispatch)

    const pools = waitForPools(selector, dispatch)
    const liquidityPositions = waitForLiquidityPositions(selector, dispatch)

    if (chainId === null ||
        rewardsAddress === null ||
        pools === null ||
        liquidityPositions === null ||
        multicallContract === null ||
        rewardsContract === null
    ) {
      return (
        <div className='add-liquidity-container' style={{position: 'relative'}}>
            <UniswapWrapper>
                <RelativeLoading show />
            </UniswapWrapper>
        </div>
      )
    }

    const createPosition = (position: Position) => {
        const { pool } = position

        const {
            amount0: amount0Min,
            amount1: amount1Min
        } = position.mintAmountsWithSlippage(new Percent(10, 100));

        dispatch(waitForTransaction({
            Multicall: multicallContract,
            Rewards: rewardsContract,
            type: TransactionType.CreateLiquidityPosition,
            token0: pool.token0.address,
            token1: pool.token1.address,
            fee: pool.fee,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            amount0Desired: BigNumber.from(Number(position.amount0.toExact())),
            amount1Desired: BigNumber.from(Number(position.amount1.toExact())),
            amount0Min: BigNumber.from(amount0Min.toString()),
            amount1Min: BigNumber.from(amount1Min.toString()),
        }))
    }

    return (
        <div className='create-position-container'>
            <UniswapWrapper>
                <AddLiquidity
                    adding={liquidityPositions?.creating || false}
                    addLiquidity={createPosition}
                    pools={Object.values(pools).map(pool => inflateUniswapPool(pool))}
                    spenderAddress={rewardsAddress}
                    {...props}
                />
            </UniswapWrapper>
        </div>
    )
}

export default CreatePosition
