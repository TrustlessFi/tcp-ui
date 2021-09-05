import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

/*import { createLiquidityPosition } from '../../actions/LiquidityPositionActions';
import { LiquidityPositionState } from "../../stores/LiquidityPositionStore";
import { getProtocolStatus } from "../../actions/ProtocolActions";
import { ProtocolState } from "../../stores/ProtocolStore";
import { WalletState } from '../../stores/WalletStore';
import { getProtocolContract } from '../../blockchain/utils/protocolContracts';

import AddLiquidity from '../uniswap/src/pages/AddLiquidity';
import UniswapWrapper from './UniswapWrapper';
import { poolToUniswapPool } from '../../blockchain/utils/uniswapUtils';

interface CreatePositionProps {
    liquidityPositions: LiquidityPositionState,
    protocol: ProtocolState,
    wallet: WalletState
}

const addReference = pool => ({ ...pool, type: 'reference' });
const addCollateral = pool => ({ ...pool, type: 'collateral' });
const addProtocol = pool => ({ ...pool, type: 'protocol' });

const CreatePosition = ({
    liquidityPositions,
    protocol,
    wallet,
    ...routeProps
}: CreatePositionProps & RouteComponentProps) => {
    const [ rewardsAddress, setRewardsAddress ] = useState('');

    useEffect(() => {
        if(wallet.chainId) {
            getProtocolContract('rewards')
                .then(rewards => setRewardsAddress(rewards.address))
                .catch(console.error);
        }
    }, [wallet.chainId]);

    useEffect(() => {
        if(!wallet.chainId || protocol.pools) {
            return;
        }

        getProtocolStatus(['pools']);
    }, [wallet.chainId, protocol.pools]);

    const pools = protocol.pools && protocol.pools.reference.map(addReference)
        .concat(addCollateral(protocol.pools.collateral))
        .concat(addProtocol(protocol.pools.protocol))
        .map(poolToUniswapPool);

    return (
        <div className='create-position-container'>
            <UniswapWrapper wallet={wallet}>
                <AddLiquidity
                    adding={liquidityPositions.creating}
                    addLiquidity={createLiquidityPosition}
                    pools={pools}
                    spenderAddress={rewardsAddress}
                    {...routeProps}
                />
            </UniswapWrapper>
        </div>
    );
};

export default CreatePosition;*/
export default () => <span />