import { BigNumber } from "ethers"
import { timeToPeriod, unscale, scale } from '../../utils'
import { AppDispatch } from '../../app/store'
import { waitForTransaction } from '../transactions'
import getProvider from '../../utils/getProvider'
import { UIID } from '../../constants'
import { ProtocolContract } from '../contracts/index';
import getContract from '../../utils/getContract'
import { TransactionType } from '../transactions/index';
import { getDuplicateFuncMulticall, executeMulticalls } from '../../utils/Multicall/index';
import * as mc from '../../utils/Multicall/index'
import { lendArgs } from './'

import { Accounting, HuePositionNFT, Market, TcpMulticallViewOnly } from '../../utils/typechain'

export const executeLend = async (dispatch: AppDispatch, args: lendArgs) => {
  const provider = getProvider()
  const signer = provider.getSigner()
  const userAddress = await signer.getAddress()

  const market = getContract(args.Market, ProtocolContract.Market) as Market

  const tx = await market.connect(signer).lend(scale(args.amount))
  const hash = tx.hash

  dispatch(waitForTransaction({
    hash,
    message: 'Lend',
    userAddress,
    nonce: tx.nonce,
    type: TransactionType.Lend,
  }))

  return hash
}

export const executeWithdraw = async (dispatch: AppDispatch, args: lendArgs) => {
  const provider = getProvider()
  const signer = provider.getSigner()
  const userAddress = await signer.getAddress()

  const market = getContract(args.Market, ProtocolContract.Market) as Market

  const tx = await market.connect(signer).unlend(scale(args.amount))
  const hash = tx.hash

  dispatch(waitForTransaction({
    hash,
    message: 'Withdraw',
    userAddress,
    nonce: tx.nonce,
    type: TransactionType.Withdraw,
  }))

  return hash
}
