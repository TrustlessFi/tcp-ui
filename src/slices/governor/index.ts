import { RootState } from '../../app/store'
import { thunkArgs } from '../fetchNodes'
import { Governor } from '@trustlessfi/typechain'
import { RootContract } from '../contracts/ProtocolContract'
import getContract from '../../utils/getContract'
import { createChainDataSlice } from '../'

export interface governorInfo {
  phase: number
}

const _governorSlice = createChainDataSlice({
  name: 'governor',
  dependencies: ['governor'],
  thunkFunction:
    async (args: thunkArgs<'governor'>) => {
      const governor = getContract(args.governor, RootContract.Governor) as Governor

      const [
        phase,
      ] = await Promise.all([
        governor.currentPhase(),
      ])

      return { phase }
    },
})

export const governorSlice = {
  ..._governorSlice,
  stateSelector: (state: RootState) => state.governor
}

export default _governorSlice.slice.reducer
