import { TransactionHistory } from "../../generated/schema";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
} from "../../generated/VaultV3/VaultV3";
import { TransactionType } from "../utils/constants";

/**
 * Creates transaction history record based on deposit or withdraw events
 * from a Vault V3 contract. This function handles both deposit and withdraw transactions,
 * storing details such as sender, receiver, assets, shares, and transaction metadata.
 *
 * @param depositEvent - The deposit event from the Vault contract, or null if this is a withdrawal
 * @param withdrawEvent - The withdraw event from the Vault contract, or null if this is a deposit
 */
export function createTransactionHistory(
  depositEvent: DepositEvent | null,
  withdrawEvent: WithdrawEvent | null
): void {
  if (depositEvent) {
    // Return if the transaction was already added previously to avoid duplicates
    let transaction = TransactionHistory.load(depositEvent.transaction.hash);
    if (transaction) return;

    // Create a new transaction history record for the deposit event
    transaction = new TransactionHistory(depositEvent.transaction.hash);
    transaction.vaultAddress = depositEvent.address;
    transaction.transactionType = TransactionType.VaultDeposit;
    transaction.sender = depositEvent.params.sender;
    transaction.owner = depositEvent.params.owner;
    transaction.receiver = depositEvent.params.owner;
    transaction.assets = depositEvent.params.assets;
    transaction.shares = depositEvent.params.shares;
    transaction.txHash = depositEvent.transaction.hash;
    transaction.blockNumber = depositEvent.block.number;
    transaction.blockTimestamp = depositEvent.block.timestamp;
    transaction.save();
  } else if (withdrawEvent) {
    // Return if the transaction was already added previously to avoid duplicates
    let transaction = TransactionHistory.load(withdrawEvent.transaction.hash);
    if (transaction) return;

    // Create a new transaction history record for the withdraw event
    transaction = new TransactionHistory(withdrawEvent.transaction.hash);
    transaction.vaultAddress = withdrawEvent.address;
    transaction.transactionType = TransactionType.VaultWithdraw;
    transaction.sender = withdrawEvent.params.sender;
    transaction.owner = withdrawEvent.params.owner;
    transaction.receiver = withdrawEvent.params.receiver;
    transaction.assets = withdrawEvent.params.assets;
    transaction.shares = withdrawEvent.params.shares;
    transaction.txHash = withdrawEvent.transaction.hash;
    transaction.blockNumber = withdrawEvent.block.number;
    transaction.blockTimestamp = withdrawEvent.block.timestamp;
    transaction.save();
  }
}
