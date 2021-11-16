import { useState } from 'react'
import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForLiquidityPositions } from '../../slices/waitFor'
import InputPicker from '../Lend/library/InputPicker'
import LargeText from '../utils/LargeText'
import PositionNumberInput from '../library/PositionNumberInput'

enum ChangeType {
  Increase = 'Increase',
  Decrease = 'Decrease',
}

interface MatchParams {
  positionID: string
}

const UpdateLiquidityPosition = () => {
  const params: MatchParams = useParams()
  const dispatch = useAppDispatch();

  const liquidityPositions = waitForLiquidityPositions(selector, dispatch)
  const position = liquidityPositions && liquidityPositions[params.positionID]

  const [changeType, setChangeType] = useState(ChangeType.Increase)

  if(!position) {
    return <span />
  }

  return (
    <LargeText>
      Liquidity position #{position.positionID} has {position.tickLower} lower and {position.tickUpper} upper.
      I want to
      <InputPicker
        options={ChangeType}
        initialValue={ChangeType.Increase}
        onChange ={(option: ChangeType) => setChangeType(option)}
      />
      {/*changeType === ChangeType.Increase ? (
        <>
          <PositionNumberInput
            id='collateralInput'
            action={(value: number) => setCollateralCount(value)}
            value={collateralCount}
          />
          Eth and
          <InputPicker
            options={DebtChange}
            initialValue={initialDebtChange}
            onChange ={(option: DebtChange) => setDebtChange(option)}
          />
          <PositionNumberInput
            id='debtInput'
            action={(value: number) => setDebtCount(value)}
            value={debtCount}
          />
          Hue.
        </>
      ) : (
        <PositionNumberInput
          id='debtInput'
          action={(value: number) => setDebtCount(value)}
          value={debtCount}
        />
      )*/}
    </LargeText>
  )
}

export default UpdateLiquidityPosition