import { useState } from "react"
import { Row, Col } from 'react-flexbox-grid'
import {
  Button,
  NumberInput,
  Dropdown,
  OnChangeData,
  TextAreaSkeleton,
} from 'carbon-components-react'
import LargeText from '../utils/LargeText'
import Bold from '../utils/Bold'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { waitForHueBalance, waitForLendHueBalance, waitForMarket, waitForPrices, waitForLiquidations } from '../../slices/waitFor'
import { onNumChange, numDisplay }  from '../../utils/'
import { first } from '../../utils/index';
import PositionNumberInput from '../Positions/library/PositionNumberInput';
import LendController, { LendBorrowOptions } from './LendController'

const InputPicker = <T extends string, TEnumValue extends string>({
  options,
  onChange,
}:{
  options: { [key in T]: TEnumValue }
  onChange: (value: TEnumValue) => void
}) => {
  return (
    <div style={{display: 'inline-block', width: 146}} >
      <Dropdown
        ariaLabel="Dropdown"
        id="Lend_Borrow_Dropdown"
        items={Object.values(options)}
        onChange={(data: OnChangeData<TEnumValue>) => {
          const selectedItem = data.selectedItem
          if (selectedItem === null || selectedItem === undefined) throw new Error('InputPicker: Unknown value')
          onChange(selectedItem)
        }}
        size="sm"
        initialSelectedItem={first(Object.values(options))}
        label='Lend/Borrow options'
        titleText={<> </>}
        style={{marginLeft: 8, marginRight: 8}}
      />
    </div>
  )
}

const Lend = () => {
  const dispatch = useAppDispatch()

  const hueBalance = waitForHueBalance(selector, dispatch)
  console.log({hueBalance})
  const lendHueBalance = waitForLendHueBalance(selector, dispatch)

  const [selectedOption, setSelectedOption] = useState(first(Object.values(LendBorrowOptions)))
  const [amount, setAmount] = useState(0)
  const [showBorrowLend, setShowBorrowLend] = useState(false)

  if (
    hueBalance === null ||
    lendHueBalance === null
  ) return <TextAreaSkeleton />

  const onChange = (option: LendBorrowOptions) => {
    setAmount(0)
    setSelectedOption(option)
  }

  const isFailing = false

  return (
    <>
      <div>
        <LargeText>
          I have {numDisplay(hueBalance.userBalance, 2)} Hue available to deposit.
          <div />
          The current lend APR is {numDisplay(hueBalance.userBalance, 2)} but will vary over time.
        </LargeText>
      </div>
      <LargeText>
        I want to
        <InputPicker options={LendBorrowOptions} onChange={onChange} />
        <PositionNumberInput
          id="lendInput"
          action={(value: number) => setAmount(value)}
          value={amount}
        />
        Hue.
      </LargeText>
      <div style={{marginTop: 32, marginBottom: 32}}>
        <Button onClick={() => setShowBorrowLend(true)} disabled={isFailing}>
          {selectedOption}
        </Button>
      </div>
      <LendController
        option={selectedOption}
        amount={amount}
        onCancel={() => setShowBorrowLend(false)}
        isActive={showBorrowLend}
      />
    </>
  )
}

export default Lend
