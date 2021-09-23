import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, initialState } from '../'
import { getGenericReducerBuilder } from '../'
import { unscale } from '../../utils'
import { ChainID} from '../chainID'
import { getEthBalance } from '../../utils/Multicall/chainStatus'
import getContract from '../../utils/getContract';
import { ProtocolContract } from '../contracts/index';

import { TcpMulticall } from '../../utils/typechain'


export interface EthBalanceState extends sliceState<number> {}


export type ethBalanceArgs = {
  userAddress: string,
  TcpMulticall: string,
}

export const fetchEthBalance = createAsyncThunk(
  'ethBalance/fetchEthBalance',
  async (args: ethBalanceArgs) => {
    const tcpMulticall = getContract(args.TcpMulticall, ProtocolContract.TcpMulticall) as TcpMulticall

    return unscale(await getEthBalance(tcpMulticall, args.userAddress))
  }
)

export const ethBalanceSlice = createSlice({
  name: 'ethBalance',
  initialState: initialState as EthBalanceState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, fetchEthBalance)
  },
});

export default ethBalanceSlice.reducer
