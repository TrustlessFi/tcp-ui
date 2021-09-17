import React, { MouseEvent, useState } from 'react'
import { ReactNode } from 'react';
import { withRouter, useHistory } from 'react-router'
import { Button, Tag, ModalWrapper } from 'carbon-components-react';
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import { Copy16, Launch16 } from '@carbon/icons-react';
import Center from '../library/Center';
import NetworkIndicator from '../library/NetworkIndicator';
import {
  Modal,
} from 'carbon-components-react'
import { abbreviateAddress } from '../../utils/index';

export default (
  {
    collateral,
    debt,
    ethPrice,
    liquidationPrice,
  }: {
    collateral: string,
    debt: string,
    ethPrice: string,
    liquidationPrice: string,
  }
) => {
  return (
    <>
      <div>
        <h3>Collateral:</h3><p>{collateral}</p>
      </div>
      <div>
        <h3>Debt:</h3><p>{debt}</p>
      </div>
      <div>
        <h3>Eth Price:</h3><p>{ethPrice}</p>
      </div>
      <div>
        <h3>Liquidation Price:</h3><p>{liquidationPrice}</p>
      </div>
    </>
  )
}
