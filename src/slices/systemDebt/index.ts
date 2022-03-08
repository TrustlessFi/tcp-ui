import getContract from '../../utils/getContract'
import { Accounting } from '@trustlessfi/typechain';
import ProtocolContract from '../contracts/ProtocolContract'
import { thunkArgs, RootState  } from '../fetchNodes'
import { createChainDataSlice, CacheDuration } from '../'

export interface sdi {
  debt: string
  totalTCPRewards: string
  cumulativeDebt: string
  debtExchangeRate: string
}

const systemDebtSlice = createChainDataSlice({
  name: 'systemDebt',
  dependencies: ['contracts'],
  stateSelector: (state: RootState) => state.sdi,
  cacheDuration: CacheDuration.SHORT,
  isUserData: false,
  thunkFunction:
    async (args: thunkArgs<'contracts'>) => {
      const accounting = getContract(args.contracts[ProtocolContract.Accounting], ProtocolContract.Accounting) as Accounting

      const sdi = await accounting.getSystemDebtInfo()

      return {
        debt: sdi.debt.toString(),
        totalTCPRewards: sdi.totalTCPRewards.toString(),
        cumulativeDebt: sdi.cumulativeDebt.toString(),
        debtExchangeRate: sdi.debtExchangeRate.toString(),
      }
    },
})

export default systemDebtSlice
