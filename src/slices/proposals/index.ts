import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { sliceState, initialState } from '../'
import { genProposals } from './api'
import { getGenericReducerBuilder } from '../'
import { ChainID } from '../chainID'

export enum ProposalStates {
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
    state: ProposalStates | undefined
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

export interface proposalsInfo { [key: number]: Proposal }

export type proposalsArgs = {
  chainID: ChainID,
}

export interface ProposalsState extends sliceState<proposalsInfo> {}

export const getProposals = createAsyncThunk(
  'proposals/getProposals',
  async (args: proposalsArgs) => await genProposals(args.chainID),
)

export const proposalsSlice = createSlice({
  name: 'proposals',
  initialState: initialState as ProposalsState,
  reducers: {},
  extraReducers: (builder) => {
    builder = getGenericReducerBuilder(builder, getProposals)
  },
})

export default proposalsSlice.reducer
