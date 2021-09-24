import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { getContractWaitFunction } from '../../slices/waitFor'
import TxConfirmController from '../Write/TxConfirmController'
import { createPosition } from '../../slices/positions'
import { RootState } from '../../app/store';
import { ProtocolContract } from '../../slices/contracts/index';
import { numDisplay } from '../../utils/'
import Text from '../utils/Text'
import LargeText from '../utils/LargeText'

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

  const mediumName =
    'Creating a position with '
    + numDisplay(collateralCount, 2)
    + ' Eth of collateral and '
    + numDisplay(debtCount, 2)
    + ' Hue of debt.'

  const items = [
    {
      title: 'Collateral',
      value: numDisplay(collateralCount, 2) + ' Eth',
    },{
      title: 'Debt',
      value: numDisplay(debtCount, 2) + ' Hue',
    },{
      title: 'Eth Price',
      value: numDisplay(ethPrice, 2) + ' Hue/Eth',
    },{
      title: 'Liquidation Price',
      value: numDisplay(liquidationPrice, 2) + ' Hue/Eth',
    }
  ]

  const preview = items.map((item, index) =>
    <div key={index}>
      <LargeText>
        {item.title + ': '}
      </LargeText>
      <Text>
        {item.value}
      </Text>
    </div>
  )

  return (
    <TxConfirmController
      thunk={createPosition({collateralCount, debtCount, Market})}
      preview={<>{preview}</>}
      verb="Create"
      mediumName={mediumName}
      shortName={'Position Creation'}
      onCancel={onCancel}
      isActive={isActive}
      stateSelector={(state: RootState) => state.positions}
    />
  )
}

export default CreatePositionController
