import { scale } from '../../utils'
import { AppDispatch } from '../../app/store'
import { waitForTransaction } from '../transactions'
import getProvider from '../../utils/getProvider'
import { ProtocolContract } from '../contracts/index';
import getContract from '../../utils/getContract'
import { TransactionType } from '../transactions/index';
import { lendArgs } from './'

import { Market } from '../../utils/typechain'
import { parseMetamaskError } from '../../utils/';

export const executeLend = async (dispatch: AppDispatch, args: lendArgs) => {
  const provider = getProvider()
  const signer = provider.getSigner()
  const userAddress = await signer.getAddress()

  const market = getContract(args.Market, ProtocolContract.Market) as Market

  try {
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
  } catch (e) {
    console.error('Error in execute Lend')
    console.error(e)
    throw parseMetamaskError(e)
  }
}

export const executeWithdraw = async (dispatch: AppDispatch, args: lendArgs) => {
  const provider = getProvider()
  const signer = provider.getSigner()
  const userAddress = await signer.getAddress()

  const market = getContract(args.Market, ProtocolContract.Market) as Market

  try {
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
  } catch (e: any) {
    console.error('Error in execute Withdraw')
    console.error(e)
    throw parseMetamaskError(e)
  }
}
