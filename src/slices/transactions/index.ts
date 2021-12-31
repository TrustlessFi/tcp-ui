import { Contract } from 'ethers'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getLocalStorage, assertUnreachable } from '../../utils'
import { waitingForMetamask, metamaskComplete } from '../wallet'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'
import { clearPositions } from '../positions'
import { clearLiquidityPositions } from '../liquidityPositions'
import { clearBalances } from '../balances'
import { clearRewardsInfo } from '../rewards'
import { clearMarketInfo } from '../market'
import { clearPoolsCurrentData } from '../poolsCurrentData'
import { ethers, ContractTransaction, BigNumber } from 'ethers'
import { ProtocolContract } from '../contracts'
import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

import { Market, Rewards, TcpGovernorAlpha } from '@trustlessfi/typechain'
import getContract, { getMulticallContract } from '../../utils/getContract'
import { scale, SLIPPAGE_TOLERANCE, timeMS } from '../../utils'
import { UIID } from '../../constants'
import { getDefaultTransactionTimeout, mnt, parseMetamaskError, extractRevertReasonString } from '../../utils'
import { zeroAddress, bnf, uint256Max } from '../../utils/'
import { ChainID } from '@trustlessfi/addresses'
import { ERC20 } from '@trustlessfi/typechain'
import { numDisplay } from '../../utils'

export enum TransactionType {
  CreatePosition,
  UpdatePosition,
  Lend,
  Withdraw,
  ApproveHue,
  ApproveLendHue,
  CreateLiquidityPosition,
  IncreaseLiquidityPosition,
  DecreaseLiquidityPosition,
  DeleteLiquidityPosition,
  ClaimAllLiquidityPositionRewards,
  ClaimAllPositionRewards,
  ApprovePoolToken,
}

export enum TransactionStatus {
  Pending,
  Success,
  Failure,
}

export interface txCreatePositionArgs {
  type: TransactionType.CreatePosition
  collateralCount: number,
  debtCount: number,
  Market: string,
}

export interface txUpdatePositionArgs {
  type: TransactionType.UpdatePosition
  positionID: number,
  collateralIncrease: number,
  debtIncrease: number,
  Market: string,
}

export interface txLendArgs {
  type: TransactionType.Lend
  count: number,
  Market: string,
}

export interface txWithdrawArgs {
  type: TransactionType.Withdraw
  count: number,
  Market: string,
}

export interface txCreateLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.CreateLiquidityPosition
  token0: string
  token0Decimals: number
  token0IsWeth: boolean
  token1: string
  token1Decimals: number
  token1IsWeth: boolean
  fee: number
  tickLower: number
  tickUpper: number
  amount0Desired: number
  amount0Min: number
  amount1Desired: number
  amount1Min: number
  trustlessMulticall: string
  Rewards: string
}

export interface txIncreaseLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.IncreaseLiquidityPosition
  positionID: number
  token0Increase: number
  token0Decimals: number
  token0IsWeth: boolean
  token1Increase: number
  token1Decimals: number
  token1IsWeth: boolean
  Rewards: string
  trustlessMulticall: string
}

export interface txDecreaseLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.DecreaseLiquidityPosition
  positionID: number
  token0Decrease: number
  token0Decimals: number
  token1Decrease: number
  token1Decimals: number
  liquidity: string
  Rewards: string
  trustlessMulticall: string
}

export interface txDeleteLiquidityPositionArgs {
  chainID: ChainID
  type: TransactionType.DeleteLiquidityPosition
  positionID: number
  token0Decrease: number
  token0Decimals: number
  token1Decrease: number
  token1Decimals: number
  Rewards: string
  trustlessMulticall: string
}

export interface txClaimPositionRewards {
  type: TransactionType.ClaimAllPositionRewards
  positionIDs: number[]
  Market: string
}

export interface txClaimLiquidityPositionRewards {
  type: TransactionType.ClaimAllLiquidityPositionRewards
  positionIDs: string[]
  Rewards: string
}

export interface txApprovePoolToken {
  type: TransactionType.ApprovePoolToken
  tokenAddress: string
  Rewards: string
  poolAddress: string,
  symbol: string
}

export interface txApproveHue {
  type: TransactionType.ApproveHue
  Hue: string
  spenderAddress: string
}

export interface txApproveLendHue {
  type: TransactionType.ApproveLendHue
  LendHue: string
  spenderAddress: string
}

export type TransactionArgs =
  txCreatePositionArgs |
  txUpdatePositionArgs |
  txLendArgs |
  txWithdrawArgs |
  txCreateLiquidityPositionArgs |
  txIncreaseLiquidityPositionArgs |
  txDecreaseLiquidityPositionArgs |
  txDeleteLiquidityPositionArgs |
  txClaimPositionRewards |
  txClaimLiquidityPositionRewards |
  txApprovePoolToken |
  txApproveHue |
  txApproveLendHue

export interface TransactionData {
  args: TransactionArgs
  openTxTab: () => void
  userAddress: string
  chainID: ChainID
}

export type TransactionInfo = {
  hash: string
  nonce: number
  userAddress: string
  type: TransactionType
  status: TransactionStatus
  startTimeMS: number
  chainID: ChainID
  args: TransactionArgs
}

export type TransactionState = {[key in string]: TransactionInfo}

export const getTxLongName = (args: TransactionArgs) => {
  const type = args.type
  switch(type) {
    case TransactionType.CreatePosition:
      if (args.debtCount === 0) return 'Create Position without debt'
      return 'Create Position with ' + numDisplay(args.debtCount) + ' Hue debt'
    case TransactionType.UpdatePosition:
      return 'Update position ' + args.positionID
    case TransactionType.Lend:
      return 'Lend ' + args.count + ' Hue'
    case TransactionType.Withdraw:
      return 'Withdraw ' + args.count + ' Hue'
    case TransactionType.ApproveHue:
      return 'Approve Hue'
    case TransactionType.ApproveLendHue:
      return 'Approve Withdraw'
    case TransactionType.CreateLiquidityPosition:
      return 'Create Liquidity Position'
    case TransactionType.IncreaseLiquidityPosition:
      return 'Increase Liquidity Position ' + args.positionID
    case TransactionType.DecreaseLiquidityPosition:
      return 'Decrease Liquidity Position ' + args.positionID
    case TransactionType.DeleteLiquidityPosition:
      return 'Delete Liquidity Position ' + args.positionID
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve ' + args.symbol
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxShortName = (type: TransactionType) => {
  switch(type) {
    case TransactionType.CreatePosition:
      return 'Create Position'
    case TransactionType.UpdatePosition:
      return 'Update position'
    case TransactionType.Lend:
      return 'Lend Hue'
    case TransactionType.Withdraw:
      return 'Withdraw Hue'
    case TransactionType.ApproveHue:
      return 'Approve Hue'
    case TransactionType.ApproveLendHue:
      return 'Approve Withdraw'
    case TransactionType.CreateLiquidityPosition:
      return 'Create Liquidity Position'
    case TransactionType.IncreaseLiquidityPosition:
      return 'Increase Liquidity Position'
    case TransactionType.DecreaseLiquidityPosition:
      return 'Decrease Liquidity Position'
    case TransactionType.DeleteLiquidityPosition:
      return 'Delete Liquidity Position'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve Token'
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxErrorName = (type: TransactionType) => getTxShortName(type) + ' Failed'

const getDeadline = async (chainID: ChainID, multicallAddress: string) => {
  const trustlessMulticall = getMulticallContract(multicallAddress)
  const transactionTimeout = getDefaultTransactionTimeout(chainID)

  const blockTime = await trustlessMulticall.getCurrentBlockTimestamp()

  return BigNumber.from(blockTime).add(transactionTimeout)
}

const executeTransaction = async (
  args: TransactionArgs,
  provider: ethers.providers.Web3Provider,
): Promise<ContractTransaction> => {
  const getMarket = (address: string) =>
    getContract(address, ProtocolContract.Market)
      .connect(provider.getSigner()) as Market

  const getRewards = (address: string) =>
    getContract(address, ProtocolContract.Rewards)
      .connect(provider.getSigner()) as Rewards

  const type = args.type

  let deadline
  let rewards

  switch(type) {
    case TransactionType.CreatePosition:
      return await getMarket(args.Market).createPosition(scale(args.debtCount), UIID, {
        value: scale(args.collateralCount)
      })

    case TransactionType.UpdatePosition:
      return await getMarket(args.Market).adjustPosition(
        args.positionID,
        mnt(args.debtIncrease),
        args.collateralIncrease < 0 ? mnt(Math.abs(args.collateralIncrease)) : 0,
        UIID,
        { value: (args.collateralIncrease > 0 ? mnt(args.collateralIncrease) : 0) }
      )
    case TransactionType.Lend:
      return await getMarket(args.Market).lend(scale(args.count))

    case TransactionType.Withdraw:
      return await getMarket(args.Market).unlend(scale(args.count))

    case TransactionType.CreateLiquidityPosition:
      rewards = getRewards(args.Rewards)

      const amount0Desired = bnf(mnt(args.amount0Desired, args.token0Decimals))
      const amount1Desired = bnf(mnt(args.amount1Desired, args.token1Decimals))

      const ethCount = (args.token0IsWeth ? amount0Desired : bnf(0)).add(args.token1IsWeth ? amount1Desired : bnf(0))

      deadline = await getDeadline(args.chainID, args.trustlessMulticall)

      return await rewards.createLiquidityPosition({
        token0: args.token0,
        token1: args.token1,
        fee: args.fee,
        tickLower: args.tickLower,
        tickUpper: args.tickUpper,
        amount0Desired,
        amount0Min: bnf(mnt(args.amount0Min, args.token0Decimals)),
        amount1Desired,
        amount1Min: bnf(mnt(args.amount1Min, args.token1Decimals)),
        recipient: zeroAddress,
        deadline
      },
      UIID,
      {value: ethCount}
    )

    case TransactionType.IncreaseLiquidityPosition:
      rewards = getRewards(args.Rewards)

      deadline = await getDeadline(args.chainID, args.trustlessMulticall)

      const token0Increase = bnf(mnt(args.token0Increase, args.token0Decimals))
      const token1Increase = bnf(mnt(args.token1Increase, args.token1Decimals))

      const ethIncrease = (args.token0IsWeth ? token0Increase : bnf(0)).add(args.token1IsWeth ? token1Increase : bnf(0))

      return await rewards.increaseLiquidityPosition({
        tokenId: args.positionID,
        amount0Desired: token0Increase,
        amount0Min: token0Increase.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        amount1Desired: token1Increase,
        amount1Min: token1Increase.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        deadline,
      }, UIID, {value: ethIncrease})

    case TransactionType.DecreaseLiquidityPosition:
      rewards = getRewards(args.Rewards)

      deadline = await getDeadline(args.chainID, args.trustlessMulticall)

      const token0DecreaseA = bnf(mnt(args.token0Decrease, args.token0Decimals))
      const token1DecreaseA = bnf(mnt(args.token1Decrease, args.token1Decimals))

      return await rewards.decreaseLiquidityPosition({
        tokenId: args.positionID,
        amount0Min: token0DecreaseA.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        amount1Min: token1DecreaseA.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        liquidity: args.liquidity,
        deadline,
      }, UIID)

    case TransactionType.DeleteLiquidityPosition:
      rewards = getRewards(args.Rewards)

      deadline = await getDeadline(args.chainID, args.trustlessMulticall)

      const token0DecreaseB = bnf(mnt(args.token0Decrease, args.token0Decimals))
      const token1DecreaseB = bnf(mnt(args.token1Decrease, args.token1Decimals))

      return await rewards.removeLiquidityPosition({
        tokenId: args.positionID,
        amount0Min: token0DecreaseB.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        amount1Min: token1DecreaseB.mul(1e9*(1 - SLIPPAGE_TOLERANCE)).div(1e9),
        liquidity: 0,
        deadline,
      })

    case TransactionType.ClaimAllPositionRewards:
      return await getMarket(args.Market).claimAllRewards(args.positionIDs, UIID)

    case TransactionType.ClaimAllLiquidityPositionRewards:
      return await getRewards(args.Rewards).claimAllRewards(args.positionIDs, UIID)

    case TransactionType.ApprovePoolToken:
      const tokenContract = new Contract(args.tokenAddress, erc20Artifact.abi, provider) as ERC20

      return await tokenContract.connect(provider.getSigner()).approve(args.Rewards, uint256Max)

    case TransactionType.ApproveHue:
      const hue = new Contract(args.Hue, erc20Artifact.abi, provider) as ERC20
      return await hue.connect(provider.getSigner()).approve(args.spenderAddress, uint256Max)

    case TransactionType.ApproveLendHue:
      const lendHue = new Contract(args.LendHue, erc20Artifact.abi, provider) as ERC20
      return await lendHue.connect(provider.getSigner()).approve(args.spenderAddress, uint256Max)

    default:
      assertUnreachable(type)
  }
  throw new Error('Shoudnt get here')
}

export const waitForTransaction = createAsyncThunk(
  'transactions/waitForTransaction',
  async (data: TransactionData, {dispatch}): Promise<void> => {
    const args = data.args
    const userAddress = data.userAddress

    const provider = getProvider()

    let tx: ContractTransaction
    try {
      dispatch(waitingForMetamask())
      tx = await executeTransaction(args, provider)
    } catch (e) {

      const errorMessages = parseMetamaskError(e)
      console.error("failureMessages: " + errorMessages.join(', '))

      const reasonString =
        errorMessages.length > 0
        ? extractRevertReasonString(errorMessages[0])
        : null

      dispatch(addNotification({
        type: args.type,
        userAddress,
        status: TransactionStatus.Failure,
        chainID: data.chainID,
        message: reasonString ? reasonString : errorMessages.join(', ')
      }))
      dispatch(metamaskComplete())
      return
    }

    dispatch(transactionCreated({
      hash: tx.hash,
      nonce: tx.nonce,
      userAddress,
      startTimeMS: timeMS(),
      type: args.type,
      status: TransactionStatus.Pending,
      chainID: data.chainID,
      args: data.args,
    }))
    data.openTxTab()

    const receipt = await provider.waitForTransaction(tx.hash)
    dispatch(metamaskComplete())

    const succeeded = receipt.status === 1
    if (succeeded) {
      dispatch(transactionSucceeded(tx.hash))
    } else {
      dispatch(addNotification({
        type: args.type,
        userAddress,
        status: TransactionStatus.Failure,
        hash: tx.hash,
        chainID: data.chainID,
      }))
      dispatch(transactionFailed(tx.hash))
    }

    // Kick off side-effects to reload relevant data
    if (succeeded) {
      const type = args.type

      switch (type) {
        case TransactionType.CreatePosition:
        case TransactionType.UpdatePosition:
          dispatch(clearPositions())
          dispatch(clearMarketInfo())
          dispatch(clearBalances())
          break
        case TransactionType.ClaimAllPositionRewards:
          dispatch(clearPositions())
          dispatch(clearMarketInfo())
          dispatch(clearBalances())
          break
        case TransactionType.Lend:
        case TransactionType.Withdraw:
          dispatch(clearBalances())
          break
        case TransactionType.CreateLiquidityPosition:
        case TransactionType.IncreaseLiquidityPosition:
        case TransactionType.DecreaseLiquidityPosition:
        case TransactionType.DeleteLiquidityPosition:
          dispatch(clearLiquidityPositions())
          dispatch(clearRewardsInfo())
          dispatch(clearPoolsCurrentData())
          dispatch(clearBalances())
          break
        case TransactionType.ClaimAllLiquidityPositionRewards:
          dispatch(clearLiquidityPositions())
          dispatch(clearRewardsInfo())
          dispatch(clearBalances())
          break
        case TransactionType.ApprovePoolToken:
        case TransactionType.ApproveHue:
        case TransactionType.ApproveLendHue:
          dispatch(clearBalances())
          break
      default:
        assertUnreachable(type)
      }
    }
  })

const name = 'transactions'

export const transactionsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, {}) as TransactionState,
  reducers: {
    clearUserTransactions: (state, action: PayloadAction<string>) => {
      const userAddress = action.payload
      return Object.fromEntries(
               Object.values(state)
                 .filter(tx => tx.userAddress !== userAddress)
                   .map(tx => [tx.hash, tx]))
    },
    transactionCreated: (state, action: PayloadAction<TransactionInfo>) => {
      const txInfo = action.payload
      state[txInfo.hash] = txInfo
    },
    transactionSucceeded: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      if (state.hasOwnProperty(hash)) {
        state[hash].status = TransactionStatus.Success
      }
    },
    transactionFailed: (state, action: PayloadAction<string>) => {
      const hash = action.payload
      if (state.hasOwnProperty(hash)) {
        state[hash].status = TransactionStatus.Failure
      }
    },
  },
})

export const {
  clearUserTransactions,
  transactionCreated,
  transactionSucceeded,
  transactionFailed,
} = transactionsSlice.actions

export default transactionsSlice.reducer
