import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

/*import { addLiquidityToPosition, getLiquidityPosition } from '../../actions/LiquidityPositionActions';
import { LiquidityPositionState } from "../../stores/LiquidityPositionStore";
import { WalletState } from '../../stores/WalletStore';
import { formatPositionForUniswap } from '../../utils/common';
import { getProtocolContract } from '../../blockchain/utils/protocolContracts';

import UniswapAddLiquidity from '../uniswap/src/pages/AddLiquidity';
import UniswapWrapper from './UniswapWrapper';

interface AddLiquidityProps {
    liquidityPositions: LiquidityPositionState,
    wallet: WalletState
}

interface MatchParams {
    positionId?: string,
    currencyIdA?: string,
    currencyIdB?: string,
    feeAmount?: string,
}

const AddLiquidity = ({
    liquidityPositions,
    wallet,
    ...routeProps
}: AddLiquidityProps & RouteComponentProps<MatchParams>) => {
    const [ rewardsAddress, setRewardsAddress ] = useState('');

    const positionId = Number(routeProps.match.params.positionId);

    useEffect(() => {
        if(wallet.chainId) {
            getProtocolContract('rewards')
                .then(rewards => setRewardsAddress(rewards.address))
                .catch(console.error);
        }
    }, [wallet.chainId]);

    const position = liquidityPositions.liquidityPositions[positionId];
    const uniswapFormattedPosition = position && formatPositionForUniswap(position);

    useEffect(() => {
        if(wallet.chainId && !position && positionId) {
            getLiquidityPosition(positionId);
        }
    }, [position, positionId, wallet]);

    return (
        <div className='add-liquidity-container'>
            <UniswapWrapper wallet={wallet}>
                <UniswapAddLiquidity
                    adding={position?.addingLiquidity}
                    addLiquidity={addLiquidityToPosition}
                    loading={liquidityPositions.loading}
                    position={uniswapFormattedPosition}
                    spenderAddress={rewardsAddress}
                    {...routeProps}
                />
            </UniswapWrapper>
        </div>
    );
};

export default AddLiquidity;*/
export default () => <span />