import React from "react";
import { TransactionType } from '../../slices/transactions'
import CreateTransactionButton from '../utils/CreateTransactionButton'

/*import { BalanceState } from '../../stores/UserBalanceStore';
import { CNPDelegationState } from '../../stores/CNPDelegationStore';
import { delegate } from '../../actions/CNPDelegationActions';
import ExecuteButton from '../library/ExecuteButton';
import AddressDisplay from '../library/AddressDisplay'*/

//import { oneRowTableCreator, numDisplay, abbreviateAddress } from '../../utils/common'

interface VoteDelegationPanelProps {
  //balances: BalanceState
  //cnpDelegation: CNPDelegationState
}

const VoteDelegationPanel = ({
  //balances,
  //cnpDelegation
}: VoteDelegationPanelProps) => {
  return <span />
  /*
    const executeSelfDelegation = () => {
      let to = cnpDelegation.cnpDelegation.user
      await delegate(to)
    }

    const cnpBalance = balances.balances.tokens.cnp.balance

    const selfDelegated = cnpDelegation.cnpDelegation.delegatee === cnpDelegation.cnpDelegation.user
    const cantSelfDelegate = cnpBalance === 0 || selfDelegated

    let selfDelegateButton =
      <CreateTransactionButton
        title="Confirm Delegation in Metamask"
        txArgs={{
          type: TransactionType.CreatePosition,
          collateralCount,
          debtCount,
          Market: marketContract!,
        }}
      />

    return (
      <div>
        Voting Power
        {oneRowTableCreator([
          {key: 'CNP Balance', val: numDisplay(cnpBalance)},
          {key: 'Total voting power', val: numDisplay(cnpDelegation.cnpDelegation.currentVotes)},
          {key: 'Votes delegated to', val: <AddressDisplay address={cnpDelegation.cnpDelegation.delegatee} />},
          {key: 'Votes self-delegated', val: selfDelegated ? 'Yes' : 'No'},
          {key: 'Self-delegate voting power', val: selfDelegateButton},
        ])}
      </div>
    );
    */
}

export default VoteDelegationPanel;
