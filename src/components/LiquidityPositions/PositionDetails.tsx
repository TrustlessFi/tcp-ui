import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

/*import { getLiquidityPositions } from '../../actions/LiquidityPositionActions';
import { LiquidityPositionState } from "../../stores/LiquidityPositionStore";
import { WalletState } from '../../stores/WalletStore';
import { formatPositionForUniswap } from '../../utils/common';

import { PositionPage } from '../uniswap/src/pages/Pool/PositionPage';
import UniswapWrapper from './UniswapWrapper';

interface PositionDetailsProps {
    liquidityPositions: LiquidityPositionState,
    wallet: WalletState
}

const PositionDetails = ({
    liquidityPositions,
    match,
    wallet,
}: PositionDetailsProps & RouteComponentProps<{ positionId: string }>) => {
    const position = liquidityPositions.liquidityPositions[match.params.positionId];
    const uniswapFormattedPosition = position && formatPositionForUniswap(position);

    useEffect(() => {
        if(wallet.chainId && !position) {
            getLiquidityPositions();
        }
    }, [position, wallet.chainId]);

    return (
        <div className='position-details-container'>
            <UniswapWrapper wallet={wallet}>
                <PositionPage
                    loading={liquidityPositions.loading}
                    position={uniswapFormattedPosition}
                />
            </UniswapWrapper>
        </div>
    );
};

export default PositionDetails;*/
export default () => <span />