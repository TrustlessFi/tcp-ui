import { Contract } from 'ethers'
import { PayloadAction, createAsyncThunk, ThunkDispatch, AnyAction } from '@reduxjs/toolkit'
import { assertUnreachable } from '../../utils'
import { waitingForMetamask, metamaskComplete } from '../wallet'
import getProvider from '../../utils/getProvider'
import { addNotification } from '../notifications'
import { ethers, ContractTransaction } from 'ethers'
import ProtocolContract from '../contracts/ProtocolContract'
import erc20Artifact from '@trustlessfi/artifacts/dist/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'
import { Market, Rewards } from '@trustlessfi/typechain'
import getContract from '../../utils/getContract'
import { scale, timeMS } from '../../utils'
import { UIID } from '../../constants'
import { mnt, parseMetamaskError, extractRevertReasonString } from '../../utils'
import { bnf, uint256Max } from '../../utils/'
import { ChainID } from '@trustlessfi/addresses'
import { ERC20 } from '@trustlessfi/typechain'
import { numDisplay } from '../../utils'
import { createLocalSlice, CacheDuration } from '../'
import { RootState } from '../fetchNodes'
import allSlices from '../allSlices'

export enum WalletToken {
  Hue = 'Hue',
  LendHue = 'LendHue',
  Tcp = 'Tcp',
}

export enum TransactionType {
  CreatePosition,
  UpdatePosition,
  IncreaseStake,
  DecreaseStake,
  ApproveHue,
  ApproveLendHue,
  ClaimAllLiquidityPositionRewards,
  ClaimAllPositionRewards,
  ApprovePoolToken,
  AddLiquidity,
  RemoveLiquidity,
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
  type: TransactionType.IncreaseStake
  count: number,
  Market: string,
}

export interface txWithdrawArgs {
  type: TransactionType.DecreaseStake
  count: number,
  Market: string,
}

export interface txClaimPositionRewards {
  type: TransactionType.ClaimAllPositionRewards
  positionIDs: number[]
  Market: string
}

export interface txClaimLiquidityPositionRewards {
  type: TransactionType.ClaimAllLiquidityPositionRewards
  Rewards: string
  poolID: number
}

export interface txApprovePoolToken {
  type: TransactionType.ApprovePoolToken
  tokenAddress: string
  Rewards: string
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

interface tokenInfo {
  count: number
  decimals: number
  isWeth: boolean
}

export interface txAddLiquidity {
  type: TransactionType.AddLiquidity
  poolID: number
  token0: tokenInfo
  token1: tokenInfo
  Rewards: string
}

export interface txRemoveLiquidity {
  type: TransactionType.RemoveLiquidity
  poolID: number
  Rewards: string
  liquidity: string
  amount0Min: string
  amount1Min: string
  liquidityPercentage: number
  poolName: string
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
  txClaimPositionRewards |
  txClaimLiquidityPositionRewards |
  txApprovePoolToken |
  txApproveHue |
  txApproveLendHue |
  txAddLiquidity |
  txRemoveLiquidity

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

export type TransactionState = {[hash: string]: TransactionInfo}

export const getTxLongName = (args: TransactionArgs) => {
  const type = args.type
  switch(type) {
    case TransactionType.CreatePosition:
      if (args.debtCount === 0) return 'Create Position without debt'
      return 'Create Position with ' + numDisplay(args.debtCount) + ' Hue debt'
    case TransactionType.UpdatePosition:
      return 'Update position ' + args.positionID
    case TransactionType.IncreaseStake:
      return 'Lend ' + numDisplay(args.count) + ' Hue'
    case TransactionType.DecreaseStake:
      return 'Withdraw ' + numDisplay(args.count) + ' Hue'
    case TransactionType.ApproveHue:
      return 'Approve Hue'
    case TransactionType.ApproveLendHue:
      return 'Approve Withdraw'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve ' + args.symbol
    case TransactionType.AddLiquidity:
      return 'Add liquidity to pool ' + args.poolID
    case TransactionType.RemoveLiquidity:
      return `Withdraw ${numDisplay(args.liquidityPercentage)}% of liquidity from pool ${args.poolName}`
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
    case TransactionType.IncreaseStake:
      return 'Lend Hue'
    case TransactionType.DecreaseStake:
      return 'Withdraw Hue'
    case TransactionType.ApproveHue:
      return 'Approve Hue'
    case TransactionType.ApproveLendHue:
      return 'Approve Withdraw'
    case TransactionType.ClaimAllPositionRewards:
      return 'Claim All Rewards'
    case TransactionType.ClaimAllLiquidityPositionRewards:
      return 'Claim All Liquidity Rewards'
    case TransactionType.ApprovePoolToken:
      return 'Approve Token'
    case TransactionType.AddLiquidity:
      return 'Add Liquidity'
    case TransactionType.RemoveLiquidity:
      return 'Withdraw Liquidity'
    default:
      assertUnreachable(type)
  }
  return ''
}

export const getTxErrorName = (type: TransactionType) => getTxShortName(type) + ' Failed'

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
    case TransactionType.IncreaseStake:
      return await getMarket(args.Market).lend(scale(args.count))

    case TransactionType.DecreaseStake:
      return await getMarket(args.Market).unlend(scale(args.count))

    case TransactionType.ClaimAllPositionRewards:
      return await getMarket(args.Market).claimAllRewards(args.positionIDs, UIID)

    case TransactionType.ClaimAllLiquidityPositionRewards:
      return await getRewards(args.Rewards).claimRewards(args.poolID, UIID)

    case TransactionType.ApprovePoolToken:
      const tokenContract = new Contract(args.tokenAddress, erc20Artifact.abi, provider) as ERC20

      return await tokenContract.connect(provider.getSigner()).approve(args.Rewards, uint256Max)

    case TransactionType.ApproveHue:
      const hue = new Contract(args.Hue, erc20Artifact.abi, provider) as ERC20
      return await hue.connect(provider.getSigner()).approve(args.spenderAddress, uint256Max)

    case TransactionType.ApproveLendHue:
      const lendHue = new Contract(args.LendHue, erc20Artifact.abi, provider) as ERC20
      return await lendHue.connect(provider.getSigner()).approve(args.spenderAddress, uint256Max)

    case TransactionType.AddLiquidity:
      const amount0Desired = scale(args.token0.count, args.token0.decimals)
      const amount1Desired = scale(args.token1.count, args.token1.decimals)
      const amount0Min = amount0Desired.mul(95).div(100)
      const amount1Min = amount1Desired.mul(95).div(100)

      const token0Value = args.token0.isWeth ? amount0Desired : bnf(0)
      const token1Value = args.token1.isWeth ? amount1Desired : bnf(0)
      const value = token0Value.add(token1Value)

      return await getRewards(args.Rewards).deposit(
        {
          poolID: args.poolID,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
        },
        UIID,
        { value },
      )

    case TransactionType.RemoveLiquidity:
      return await getRewards(args.Rewards).withdraw(
        {
          poolID: args.poolID,
          liquidity: args.liquidity,
          amount0Min: args.amount0Min,
          amount1Min: args.amount1Min,
        },
        UIID
      )

    default:
      assertUnreachable(type)
  }
  throw new Error('Shoudnt get here')
}

export const waitForTransaction = async (
  tx: TransactionInfo,
  provider: ethers.providers.Web3Provider,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  const receipt = await provider.waitForTransaction(tx.hash)

  const succeeded = receipt.status === 1
  if (succeeded) {
    dispatch(transactionSucceeded(tx.hash))
  } else {
    dispatch(addNotification({
      type: tx.type,
      userAddress: tx.userAddress,
      status: TransactionStatus.Failure,
      hash: tx.hash,
      chainID: tx.chainID,
    }))
    dispatch(transactionFailed(tx.hash))
  }

  if (succeeded) {
    const type = tx.type

    const clearPositions = () => dispatch(allSlices.positions.slice.actions.clearData())
    const clearMarketInfo = () => dispatch(allSlices.marketInfo.slice.actions.clearData())
    const clearBalances = () => dispatch(allSlices.balances.slice.actions.clearData())
    const clearRewardsInfo = () => dispatch(allSlices.rewardsInfo.slice.actions.clearData())
    const clearPoolsCurrentData = () => dispatch(allSlices.poolsCurrentData.slice.actions.clearData())
    const clearStaking = () => dispatch(allSlices.staking.slice.actions.clearData())
    const goToLiquidityBasePage = () => dispatch(allSlices.liquidityPage.slice.actions.incrementNonce())

    switch (type) {
      case TransactionType.CreatePosition:
      case TransactionType.UpdatePosition:
        clearPositions()
        clearMarketInfo()
        clearBalances()
        break
      case TransactionType.ClaimAllPositionRewards:
        clearPositions()
        clearMarketInfo()
        clearBalances()
        break
      case TransactionType.IncreaseStake:
      case TransactionType.DecreaseStake:
        clearBalances()
        clearMarketInfo()
        clearStaking()
        break
      case TransactionType.ClaimAllLiquidityPositionRewards:
        clearRewardsInfo()
        clearBalances()
        break
      case TransactionType.ApprovePoolToken:
      case TransactionType.ApproveHue:
      case TransactionType.ApproveLendHue:
        clearBalances()
        break
      case TransactionType.AddLiquidity:
      case TransactionType.RemoveLiquidity:
        clearBalances()
        clearPoolsCurrentData()
        goToLiquidityBasePage()
        break
    default:
      assertUnreachable(type)
    }
  }

  return succeeded
}

export const submitTransaction = createAsyncThunk(
  'transactions/submitTransaction',
  async (data: TransactionData, {dispatch}): Promise<void> => {
    const args = data.args
    const userAddress = data.userAddress

    const provider = getProvider()

    let rawTransaction: ContractTransaction
    try {
      dispatch(waitingForMetamask())
      rawTransaction = await executeTransaction(args, provider)
      dispatch(metamaskComplete())
    } catch (e) {
      const errorMessages = parseMetamaskError(e)
      console.error("failureMessages: " + errorMessages.messages.join(', '))

      const reasonString =
        errorMessages.messages.length > 0
        ? extractRevertReasonString(errorMessages.messages[0])
        : null

      if (errorMessages.code !== 4001) {
        dispatch(addNotification({
          type: args.type,
          userAddress,
          status: TransactionStatus.Failure,
          chainID: data.chainID,
          message: reasonString ? reasonString : errorMessages.messages.join(', ')
        }))
      }
      dispatch(metamaskComplete())
      return
    }

    const tx = {
      hash: rawTransaction.hash,
      nonce: rawTransaction.nonce,
      userAddress,
      startTimeMS: timeMS(),
      type: args.type,
      status: TransactionStatus.Pending,
      chainID: data.chainID,
      args: data.args,
    }

    dispatch(transactionCreated(tx))

    data.openTxTab()
  })

const transactionsSlice = createLocalSlice({
  name: 'transactions',
  initialState: {} as TransactionState,
  stateSelector: (state: RootState) => state.transactions,
  cacheDuration: CacheDuration.INFINITE,
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
  }
})

export const {
  clearUserTransactions,
  transactionCreated,
  transactionSucceeded,
  transactionFailed,
} = transactionsSlice.slice.actions

export default transactionsSlice
