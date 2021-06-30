import React, { useState } from "react";
import {
  NumberInput,
  Loading,
  Button,
  Dropdown,
  TextInput
} from "carbon-components-react";
import AppTile from "../../library/AppTile";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector as selector } from "../../../app/hooks";
import {
  waitForReferenceTokens,
  waitForReferenceTokenBalances,
  waitForProtocolTokenBalance
} from "../../../slices/waitFor";
import { getHueBalance } from "../../../slices/balances/hueBalance";
import Center from "../../library/Center";
import { Arrows16 } from "@carbon/icons-react";
import { toInt, numDisplay } from "../../../utils";
import { ProtocolContract } from '../../../utils/protocolContracts'

export default () => (
  <AppTile title="One to one minting">
    <OneToOneMintTile />
  </AppTile>
);

const OneToOneMintTile = ({}) => {
  // set up state
  const dispatch = useAppDispatch();
  const [hueFirst, setHueFirst] = useState(false);
  const [refToken, setRefToken] = useState("");
  const [value, setValue] = useState(0);

  // set up on change functions
  const onChange = (e: any) => {
    const val = Number(e.target.value);
    if (val >= 0) setValue(val);
  };
  const toggleClick = () => setHueFirst(!hueFirst);
  const onLockClick = () => alert("on lock clicked");

  // fetch data as needed
  const hueBalance = waitForProtocolTokenBalance(
    selector,
    dispatch,
    (state: RootState) => state.hueBalance,
    getHueBalance
  );
  const refTokenBalances = waitForReferenceTokenBalances(selector, dispatch);


  console.log({hueBalance, refTokenBalances})

  // check that the component is ready to display
  const loading = (
    <Center>
      <Loading
        description="One to one minting loading"
        withOverlay={false}
        small
      />
    </Center>
  );

  if (refTokenBalances === null || hueBalance === null) return loading;

  if (Object.values(refTokenBalances).length === 0)
    throw new Error("No reference tokens.");
  if (refToken === "") {
    setRefToken(Object.keys(refTokenBalances)[0]);
    return loading;
  }

  const refData = refTokenBalances[refToken];
  const refSymbol = refData.token.symbol;

  const _input1 = {
    name: hueFirst ? "Hue" : refSymbol,
    balance: hueFirst ? hueBalance.userBalance : refData.userBalance,
  }

  const input1 = {
    label: 'You pay ' + _input1.name,
    invalid: _input1.balance < value,
    invalidText: "Insufficient balance: " + numDisplay(_input1.balance) + ' ' + _input1.name,
    helperText: 'Wallet Balance: ' + numDisplay(_input1.balance) + ' ' + _input1.name,
    ..._input1
  }

  const _input2 = {
    name: hueFirst ? refSymbol : "Hue",
    balance: hueFirst ? refData.userBalance : hueBalance.userBalance,
  }
  console.log({accountingBalance: refData.balances[ProtocolContract.Accounting]})

  let accountingBalance2 = refData.balances[ProtocolContract.Accounting]
  if (typeof accountingBalance2 !== 'number') accountingBalance2 = 0

  const input2 = {
    label: 'You receive ' + _input2.name,
    invalid: hueFirst ? value > accountingBalance2 : false,
    invalidText: "Insufficient reserves: " + numDisplay(accountingBalance2) + ' ' + _input2.name,
    helperText: hueFirst ? 'Reserves: ' + numDisplay(accountingBalance2) + ' ' + _input2.name : '',
    ..._input2
  }

  const tokenOptions = Object.values(refTokenBalances).map(r => ({
    id: r.token.address,
    text: r.token.symbol
  }));

  // display
  return (
    <Center>
      <div
        style={{
          paddingTop: 16,
          width: 300,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Dropdown
          className="token-display"
          id="tokenSelector"
          items={tokenOptions}
          itemToString={item => item.text}
          label="this is the label"
          onChange={({ selectedItem }) =>
            selectedItem != null ? setRefToken(selectedItem.id) : null
          }
          selectedItem={{ id: refSymbol, text: refSymbol }}
          titleText="Select Token"
          type="inline"
        />
        <OneToOneTextInput
          data={input1}
          value={value}
          onChange={onChange}
        />
        <Center>
          <div style={{display: 'inline-block'}}>
            <Button
              hasIconOnly
              className="toggle-button"
              tooltipPosition="right"
              iconDescription="Switch"
              kind="secondary"
              onClick={toggleClick}
              renderIcon={Arrows16}
              size="sm"
            />
          </div>
        </Center>
        <OneToOneTextInput
          data={input2}
          value={value}
          onChange={onChange}
        />
        <Button
          disabled={value === 0}
          kind="primary"
          onClick={onLockClick}
          type="submit"
        >
          Lock Liquidity
        </Button>
      </div>
    </Center>
  );
};

const OneToOneTextInput = ({
  data,
  value,
  onChange
}: {
  data: {
    name: string,
    balance: number,
    label: string,
    invalid: boolean,
    invalidText: string,
    helperText: string,
  },
  value: number;
  onChange: (event: any) => any;
}) => (
  <div className="input-row" style={{marginTop: 12, marginBottom: 12}}>
    <TextInput
      id="receiveInput"
      className="input"
      labelText={data.label}
      helperText={data.helperText}
      onChange={onChange}
      invalid={data.invalid}
      invalidText={data.invalidText}
      type="number"
      value={parseInt(String(value))}
    />
  </div>
)
