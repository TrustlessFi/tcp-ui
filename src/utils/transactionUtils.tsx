import { ContractTransaction, ContractReceipt } from 'ethers'
import { isDevEnvironment, sleepS } from "./";

const showAlert = (data: any) => console.log(data)
const hideAlert = () => console.log()

export type TransactionError = {code: number, message: string}

type TransactionSuccessCallback = (receipt?: ContractReceipt) => any
type TransactionFailureCallback = (error?: TransactionError) => any

export type TransactionHandler = {
  txLabel: { executing: string, executed: string},
  success: TransactionSuccessCallback,
  failure: TransactionFailureCallback,
}

export const genExecuteTransaction = async(
  rawTransaction: Promise<ContractTransaction>
): Promise<ContractReceipt> => {
  try {
    const tx = await rawTransaction;

    showAlert({ content: `Executing ${tx.hash}` });

    const receipt = await tx.wait(1)
    if (isDevEnvironment) await sleepS(2)

    hideAlert();
    showAlert({ content: `Transaction complete!` });

    return receipt;
  } catch(e: any) {
    handleFailure(e);
    throw e;
  }
}

const handleFailure = (rawError: any) => {
  let error: TransactionError = rawError.hasOwnProperty('data') ? rawError.data : rawError;

  switch (error.code) {
    case 4001:
      showAlert({ content: "Transaction Rejected. Please re-submit the transaction and accept it in Metamask." })
      break;
    case -32603:
      showAlert({ content: `Transaction failed: ${error.message}` })
      break;
    default:
      showAlert({ content: `Encountered unexpected error ${error.code}. Check console or try again.` });
  }

  console.error(error);
}
