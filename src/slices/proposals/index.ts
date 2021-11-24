import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, initialState } from '../'
import { genProposals } from './api'
import { getGenericReducerBuilder } from '../'
import { ContractsInfo } from '../contracts'


export enum ProposalState {
  Pending = 'Pending',
  Active = 'Active',
  Canceled = 'Canceled',
  Defeated = 'Defeated',
  Succeeded = 'Succeeded',
  Queued = 'Queued',
  Expired = 'Expired',
  Executed = 'Executed',
}

export interface Proposal {
  proposal: {
    id: number
    ipfsHash: string
    proposer: string
    eta: number
    targets: string[]
    signatures: string[]
    calldatas: string[]
    startBlock: number
    endBlock: number
    forVotes: number
    againstVotes: number
    canceled: boolean
    executed: boolean
    state: ProposalState,
  },
  receipt: {
    hasVoted: boolean
    support: boolean
    votes: number
  },
  voterAddress?: string
  votingPower: number
  voting: boolean
  voted: boolean
}

export interface proposalsInfo {
  quorum: number,
  proposals: {[key in number]: Proposal}
}

export type proposalsArgs = {
  contracts: ContractsInfo
  userAddress: string
}

export interface ProposalsState extends sliceState<proposalsInfo> {}

export const getProposals = createAsyncThunk(
  'proposals/getProposals',
  async (args: proposalsArgs) => await genProposals(args),
)

export const proposalsSlice = createSlice({
  name: 'proposals',
  initialState: initialState as ProposalsState,
  reducers: {
    clearProposals: (state) => {
      state.data.value = null
    },
  },
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getProposals)
  },
})

export const { clearProposals } = proposalsSlice.actions

export default proposalsSlice.reducer
