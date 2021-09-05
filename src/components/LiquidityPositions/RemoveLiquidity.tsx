import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

/*import { formatPositionForUniswap } from '../../utils/common';
import { getLiquidityPosition, removeLiquidityFromPosition } from '../../actions/LiquidityPositionActions';
import { LiquidityPositionState } from "../../stores/LiquidityPositionStore";
import { WalletState } from '../../stores/WalletStore';

import UniswapRemoveLiquidity from '../uniswap/src/pages/RemoveLiquidity/V3';
import UniswapWrapper from './UniswapWrapper';

interface RemoveLiquidityProps {
    liquidityPositions: LiquidityPositionState,
    wallet: WalletState
}

interface MatchParams {
    positionId: string
}

const RemoveLiquidity = ({
    liquidityPositions,
    wallet,
    ...routeProps
}: RemoveLiquidityProps & RouteComponentProps<MatchParams>) => {
    const positionId = Number(routeProps.match.params.positionId);

    const position = liquidityPositions.liquidityPositions[positionId];
    const uniswapFormattedPosition = position && formatPositionForUniswap(position);

    useEffect(() => {
        if(wallet.chainId && !position && positionId) {
            getLiquidityPosition(positionId);
        }
    }, [position, positionId, wallet.chainId]);

    return (
        <div className='remove-liquidity-container'>
            <UniswapWrapper wallet={wallet}>
                <UniswapRemoveLiquidity
                    position={uniswapFormattedPosition}
                    removeLiquidity={removeLiquidityFromPosition}
                    removing={position?.removingLiquidity}
                    {...routeProps}
                />
            </UniswapWrapper>
        </div>
    );
};

export default RemoveLiquidity;*/
export default () => <span />