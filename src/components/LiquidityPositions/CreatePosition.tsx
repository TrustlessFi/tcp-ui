import { RouteComponentProps } from 'react-router-dom'

import { getContractWaitFunction, waitForLiquidityPositions, waitForPools } from '../../slices/waitFor'
import { ProtocolContract } from  '../../slices/contracts'
import { LiquidityPool } from '../../slices/pools'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { poolToUniswapPool } from '../../utils/uniswapUtils'

import AddLiquidity from '../uniswap/src/pages/AddLiquidity'
import UniswapWrapper from './UniswapWrapper'
import RelativeLoading from '../library/RelativeLoading';

const addCollateral = (pool: LiquidityPool) => ({ ...pool, type: 'collateral' })
const addProtocol = (pool: LiquidityPool) => ({ ...pool, type: 'protocol' })

const CreatePosition = (props: RouteComponentProps) => {
    const dispatch = useAppDispatch()

    const chainId = selector(state => state.chainID.chainID)
    const rewardsAddress = getContractWaitFunction(ProtocolContract.Rewards)(selector, dispatch)

    const pools = waitForPools(selector, dispatch)
    const liquidityPositions = waitForLiquidityPositions(selector, dispatch)


    if (chainId === null ||
        rewardsAddress === null ||
        pools === null ||
        liquidityPositions === null
    ) {
      return (
        <div className='add-liquidity-container' style={{position: 'relative'}}>
            <UniswapWrapper>
                <RelativeLoading show />
            </UniswapWrapper>
        </div>
      )
    }

    const uniswapPools = pools.map(pool => pool.token0Symbol === 'WETH' ? addCollateral(pool) : addProtocol(pool))
        .map(pool => poolToUniswapPool(chainId, pool))

    return (
        <div className='create-position-container'>
            <UniswapWrapper>
                <AddLiquidity
                    adding={liquidityPositions?.creating || false}
                    addLiquidity={() => {}}
                    pools={uniswapPools}
                    spenderAddress={rewardsAddress}
                    {...props}
                />
            </UniswapWrapper>
        </div>
    )
}

export default CreatePosition
