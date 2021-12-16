import { Contract } from "ethers"
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { sliceState, initialState } from '../'
import { SwapRouter } from '@trustlessfi/typechain'
import { getLocalStorage } from '../../utils'
import { getGenericReducerBuilder } from '../index';
import { getMulticallContract } from '../../utils/getContract';
import { executeMulticall, rc } from '@trustlessfi/multicall'
import routerArtifact from "@trustlessfi/artifacts/dist/contracts/uniswap/uniswap-v3-periphery/contracts/SwapRouter.sol/SwapRouter.json"
import getProvider from '../../utils/getProvider';

// TODO add TCP Allocation
export enum UniswapContract {
  Factory = "Factory",
  Weth = "Weth",
}

export interface contractsArgs {
  router: string
  trustlessMulticall: string
}

export type uniswapContractsInfo = {[key in UniswapContract]: string}


export const getContracts = createAsyncThunk(
  'uniswapContracts/getContracts',
  async (args: contractsArgs): Promise<uniswapContractsInfo> => {
    const trustlessMulticall = getMulticallContract(args.trustlessMulticall)

    const router = new Contract(args.router, routerArtifact.abi, getProvider()) as SwapRouter


    const result =  (await executeMulticall(
      trustlessMulticall,
      router,
      {
        WETH9: rc.String,
        factory: rc.String,
      },
    ))

    return {
      [UniswapContract.Weth]: result.WETH9,
      [UniswapContract.Factory]: result.factory,
    }
  }
)

export interface UniswapContractsState extends sliceState<uniswapContractsInfo> {}

const name = 'uniswapContracts'

export const uniswapContractsSlice = createSlice({
  name,
  initialState: getLocalStorage(name, initialState) as UniswapContractsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getContracts)
  }
})

export default uniswapContractsSlice.reducer
