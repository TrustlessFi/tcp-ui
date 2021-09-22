import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { waitForLiquidityPositions } from '../../slices/waitFor'
import { addLiquidityToPosition } from '../../slices/liquidityPositions'
import { getProtocolContract, ProtocolContract } from '../../utils/protocolContracts';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { positionToUniswapPosition } from '../../utils/uniswapUtils';

import UniswapAddLiquidity from '../uniswap/src/pages/AddLiquidity';
import UniswapWrapper from './UniswapWrapper';

interface MatchParams {
    positionId?: string,
    currencyIdA?: string,
    currencyIdB?: string,
    feeAmount?: string,
}

const AddLiquidity = (props: RouteComponentProps<MatchParams>) => {
    const [ rewardsAddress, setRewardsAddress ] = useState('');
    const dispatch = useAppDispatch()
    const liquidityPositions = waitForLiquidityPositions(selector, dispatch)

    const positionId = Number(props.match.params.positionId);
    const chainId = selector(state => state.chainID.chainID);

    useEffect(() => {
        if(chainId) {
            getProtocolContract(chainId, ProtocolContract.Rewards)
                .then(rewards => rewards && setRewardsAddress(rewards.address))
                .catch(console.error);
        }
    }, [chainId]);

    const position = liquidityPositions?.positions[positionId];
    const uniswapFormattedPosition = (position && chainId) ? positionToUniswapPosition(chainId, position) : undefined;

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
    );
};

export default AddLiquidity;