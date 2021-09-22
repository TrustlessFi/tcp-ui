import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { waitForLiquidityPositions, waitForPools } from '../../slices/waitFor'
import { LiquidityPool } from '../../slices/pools'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { poolToUniswapPool } from '../../utils/uniswapUtils';

import AddLiquidity from '../uniswap/src/pages/AddLiquidity';
import UniswapWrapper from './UniswapWrapper';

const addCollateral = (pool: LiquidityPool) => ({ ...pool, type: 'collateral' });
const addProtocol = (pool: LiquidityPool) => ({ ...pool, type: 'protocol' });

const CreatePosition = (props: RouteComponentProps) => {
    const dispatch = useAppDispatch()
    const chainId = selector(state => state.chainID.chainID);
    const [ rewardsAddress, setRewardsAddress ] = useState('');

    const pools = waitForPools(selector, dispatch)
    const liquidityPositions = waitForLiquidityPositions(selector, dispatch)

    useEffect(() => {
        if(chainId) {
            getProtocolContract(chainId, ProtocolContract.Rewards)
                .then(rewards => rewards && setRewardsAddress(rewards.address))
                .catch(console.error);
        }
    }, [chainId]);

    const uniswapPools = chainId && pools?.map(pool => pool.token0Symbol === 'WETH' ? addCollateral(pool) : addProtocol(pool))
        .map(pool => poolToUniswapPool(chainId, pool));

    return (
        <div className='create-position-container'>
            <UniswapWrapper>
                <AddLiquidity
                    adding={liquidityPositions?.creating || false}
                    addLiquidity={() => {}}
                    pools={uniswapPools || undefined}
                    spenderAddress={rewardsAddress}
                    {...props}
                />
            </UniswapWrapper>
        </div>
    );
};

export default CreatePosition;