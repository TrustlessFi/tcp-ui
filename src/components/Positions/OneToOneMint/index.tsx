import React, { useState } from "react";
import { NumberInput, Loading, Button, Dropdown } from 'carbon-components-react'
import AppTile from '../../library/AppTile'
import { RootState } from '../../../app/store'
import { useAppDispatch, useAppSelector as selector,  } from '../../../app/hooks'
import { waitForReferenceTokens, waitForReferenceTokenBalances, waitForProtocolTokenBalance } from '../../../slices/waitFor'
import { getHueBalance } from '../../../slices/balances/hueBalance'
import { balanceData } from '../../../slices/balances'
import Center from '../../library/Center'
import { Arrows16 } from "@carbon/icons-react";

enum InputToken {
  OTHER,
  ZHU,
}

export default () => (
  <AppTile title="One to one minting">
    <OneToOneMintTile />
  </AppTile>
)

const OneToOneMintTile = ({}) => {
  const dispatch = useAppDispatch()
  // const [referenceToken, setReferenceToken] = useState('')
  const [inputToken, setInputToken] = useState(InputToken.OTHER)
  const [selectedToken, setSelectedToken] = useState('')
  const [inputAmount, setInputAmount] = useState(0)

  const hueBalance = waitForProtocolTokenBalance(
    selector,
    dispatch,
    (state: RootState) => state.hueBalance,
    getHueBalance
  )

  const refTokenBalances = waitForReferenceTokenBalances(selector, dispatch)

  if (refTokenBalances === null || hueBalance === null) {
    return (
      <Center>
        <Loading description="One to one minting loading" withOverlay={false} small />
      </Center>
    )
  }

  if (Object.values(refTokenBalances).length === 0) throw new Error('No reference tokens.')

  if (selectedToken === '') setSelectedToken(Object.values(refTokenBalances)[0].token.symbol)

  const toggleClick = () => inputToken === InputToken.OTHER ? InputToken.ZHU : InputToken.OTHER
  const onLockClick = () => alert('on lock clicked')

  const valueUpdated = (val: number) => setInputAmount(val)

  const inputTokenData = hueBalance
  const outputTokenData = hueBalance

  const tokenOptions = Object.values(refTokenBalances).map(r => ({
    id: r.token.symbol,
    text: r.token.symbol,
  }))

  return (
    <Center>
      <div
        style={{
          paddingTop: 16,
          width: 200,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="input-row">
          <NumberInput
            helperText="Optional helper text"
            id="tj-input"
            invalidText="Number is not valid"
            label="Number input label"
            step={1000}
            value={0}
          />
          input text
        </div>
        <Dropdown
          className="token-display"
          id="tokenSelector"
          items={tokenOptions}
          itemToString={(item) => item.text}
          label=""
          onChange={({ selectedItem }) => selectedItem != null ? setSelectedToken(selectedItem.id) : null}
          selectedItem={{id: selectedToken, text: selectedToken}}
          titleText=""
          type="inline"
        />
        <Button
          className="toggle-button"
          hasIconOnly
          iconDescription="Switch"
          kind="secondary"
          onClick={toggleClick}
          renderIcon={Arrows16}
          size="sm"
        />
        <div className="input-row">
          output text
        </div>
        <Button
          disabled={inputAmount === 0}
          kind="primary"
          onClick={onLockClick}
          type="submit">
          Lock Liquidity
        </Button>
      </div>
    </Center>
  )
}
