import {
  Dropdown,
  OnChangeData,
} from 'carbon-components-react'
import { useEffect, useState, CSSProperties } from 'react'

const InputPicker = <T extends string, TEnumValue extends string>({
  options,
  onChange,
  initialValue,
  style,
}:{
  options: { [key in T]: TEnumValue }
  onChange: (value: TEnumValue) => void
  initialValue: TEnumValue,
  style?: CSSProperties,
}) => {
  return (
    <div style={{display: 'inline-block', width: 146, marginTop: 8}} >
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
        initialSelectedItem={initialValue}
        label='Lend/Borrow options'
        titleText={<> </>}
        style={style === undefined ? {marginLeft: 8, marginRight: 8} : style}
      />
    </div>
  )
}

export default InputPicker
