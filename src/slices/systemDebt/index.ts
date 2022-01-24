import { unscale } from '../../utils'
import getContract from '../../utils/getContract'
import { Accounting } from '@trustlessfi/typechain';
import ProtocolContract from '../contracts/ProtocolContract'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice } from '../'

export interface sdi {
  debt: number
  totalTCPRewards: number
  cumulativeDebt: number
  debtExchangeRate: number
}

const systemDebtSlice = createChainDataSlice({
  name: 'systemDent',
  dependencies: ['contracts'],
  stateSelector: (state: RootState) => state.sdi,
  thunkFunction:
    async (args: thunkArgs<'contracts'>) => {
      const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting

      const sdi = await accounting.getSystemDebtInfo()

      return {
        debt: unscale(sdi.debt),
        totalTCPRewards: unscale(sdi.totalTCPRewards),
        cumulativeDebt: unscale(sdi.cumulativeDebt),
        debtExchangeRate: unscale(sdi.debtExchangeRate),
      }
    },
})

export default systemDebtSlice
