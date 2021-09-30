import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getContractWaitFunction } from '../../slices/waitFor'
import TxConfirmController from './TxConfirmController'
import { createPosition } from '../../slices/positions'
import { RootState } from '../../app/store';
import { ProtocolContract } from '../../slices/contracts/index';

const CreatePositionController = ({
  collateralCount,
  debtCount,
  ethPrice,
  liquidationPrice,
  onCancel,
  isActive,
}: {
  collateralCount: number
  debtCount: number
  ethPrice: number
  liquidationPrice: number
  onCancel: () => void
  isActive: boolean
}) => {
  const dispatch = useAppDispatch()
  const Market = getContractWaitFunction(ProtocolContract.Market)(selector, dispatch)
  if (Market === null) throw new Error('CreatePositionController: Market null')

  const preview = (
    <>
      <div>
        <h3>Collateral:</h3><p>{collateralCount}</p>
      </div>
      <div>
        <h3>Debt:</h3><p>{debtCount}</p>
      </div>
      <div>
        <h3>Eth Price:</h3><p>{ethPrice}</p>
      </div>
      <div>
        <h3>Liquidation Price:</h3><p>{liquidationPrice}</p>
      </div>
    </>
  )

  return (
    <TxConfirmController
      thunk={createPosition({collateralCount, debtCount, Market})}
      preview={preview}
      verb="Create"
      mediumName={'Creating a position with ' + collateralCount + ' collateral and ' + debtCount + ' debt.'}
      shortName={'Position Creation'}
      onCancel={onCancel}
      isActive={isActive}
      stateSelector={(state: RootState) => state.positions}
    />
  )
}

export default CreatePositionController