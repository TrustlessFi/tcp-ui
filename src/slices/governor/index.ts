import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
import { Governor } from '@trustlessfi/typechain'
import { RootContract } from '../contracts/ProtocolContract'
import getContract from '../../utils/getContract'
import { createChainDataSlice } from '../'

export interface governorInfo {
  phase: number
}

const partialGovernorSlice = createChainDataSlice({
  name: 'governor',
  dependencies: ['rootContracts'],
  thunkFunction:
    async (args: thunkArgs<'rootContracts'>) => {
      const governor = getContract(args.rootContracts.governor, RootContract.Governor) as Governor

      const [
        phase,
      ] = await Promise.all([
        governor.currentPhase(),
      ])

      return { phase }
    },
})

export const governorSlice = {
  ...partialGovernorSlice,
  stateSelector: (state: RootState) => state.governor
}

export default partialGovernorSlice.slice.reducer
