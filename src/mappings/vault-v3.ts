import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
  StrategyChanged as StrategyChangedEvent,
  StrategyReported as StrategyReportedEvent,
  DebtUpdated as DebtUpdatedEvent,
  RoleSet as RoleSetEvent,
  UpdateFutureRoleManager as UpdateFutureRoleManagerEvent,
  UpdateRoleManager as UpdateRoleManagerEvent,
  UpdateAccountant as UpdateAccountantEvent,
  UpdateDepositLimitModule as UpdateDepositLimitModuleEvent,
  UpdateWithdrawLimitModule as UpdateWithdrawLimitModuleEvent,
  UpdateDefaultQueue as UpdateDefaultQueueEvent,
  UpdateUseDefaultQueue as UpdateUseDefaultQueueEvent,
  UpdateAutoAllocate as UpdateAutoAllocateEvent,
  UpdatedMaxDebtForStrategy as UpdatedMaxDebtForStrategyEvent,
  UpdateDepositLimit as UpdateDepositLimitEvent,
  UpdateMinimumTotalIdle as UpdateMinimumTotalIdleEvent,
  UpdateProfitMaxUnlockTime as UpdateProfitMaxUnlockTimeEvent,
  DebtPurchased as DebtPurchasedEvent,
  Shutdown as ShutdownEvent,
} from "../../generated/VaultV3/VaultV3";
import {
  Deposit,
  Withdraw,
  Transfer,
  Approval,
  StrategyChanged,
  StrategyReported,
  DebtUpdated,
  RoleSet,
  UpdateFutureRoleManager,
  UpdateRoleManager,
  UpdateAccountant,
  UpdateDepositLimitModule,
  UpdateWithdrawLimitModule,
  UpdateDefaultQueue,
  UpdateUseDefaultQueue,
  UpdateAutoAllocate,
  UpdatedMaxDebtForStrategy,
  UpdateDepositLimit,
  UpdateMinimumTotalIdle,
  UpdateProfitMaxUnlockTime,
  DebtPurchased,
  Shutdown,
} from "../../generated/schema";
import { Bytes } from "@graphprotocol/graph-ts";
import { createTransactionHistory } from "../modules/transaction";

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  createTransactionHistory(event, null);
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.receiver = event.params.receiver;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  createTransactionHistory(null, event);
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.receiver = event.params.receiver;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStrategyChanged(event: StrategyChangedEvent): void {
  let entity = new StrategyChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.params.strategy;
  entity.change_type = event.params.change_type;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleStrategyReported(event: StrategyReportedEvent): void {
  let entity = new StrategyReported(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.params.strategy;
  entity.gain = event.params.gain;
  entity.loss = event.params.loss;
  entity.current_debt = event.params.current_debt;
  entity.protocol_fees = event.params.protocol_fees;
  entity.total_fees = event.params.total_fees;
  entity.total_refunds = event.params.total_refunds;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDebtUpdated(event: DebtUpdatedEvent): void {
  let entity = new DebtUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.params.strategy;
  entity.current_debt = event.params.current_debt;
  entity.new_debt = event.params.new_debt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleSet(event: RoleSetEvent): void {
  let entity = new RoleSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;
  entity.role = event.params.role;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateFutureRoleManager(
  event: UpdateFutureRoleManagerEvent
): void {
  let entity = new UpdateFutureRoleManager(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.future_role_manager = event.params.future_role_manager;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateRoleManager(event: UpdateRoleManagerEvent): void {
  let entity = new UpdateRoleManager(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role_manager = event.params.role_manager;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateAccountant(event: UpdateAccountantEvent): void {
  let entity = new UpdateAccountant(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.accountant = event.params.accountant;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateDepositLimitModule(
  event: UpdateDepositLimitModuleEvent
): void {
  let entity = new UpdateDepositLimitModule(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.deposit_limit_module = event.params.deposit_limit_module;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateWithdrawLimitModule(
  event: UpdateWithdrawLimitModuleEvent
): void {
  let entity = new UpdateWithdrawLimitModule(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.withdraw_limit_module = event.params.withdraw_limit_module;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateDefaultQueue(event: UpdateDefaultQueueEvent): void {
  let entity = new UpdateDefaultQueue(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.new_default_queue = changetype<Bytes[]>(
    event.params.new_default_queue
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateUseDefaultQueue(
  event: UpdateUseDefaultQueueEvent
): void {
  let entity = new UpdateUseDefaultQueue(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.use_default_queue = event.params.use_default_queue;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateAutoAllocate(event: UpdateAutoAllocateEvent): void {
  let entity = new UpdateAutoAllocate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.auto_allocate = event.params.auto_allocate;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdatedMaxDebtForStrategy(
  event: UpdatedMaxDebtForStrategyEvent
): void {
  let entity = new UpdatedMaxDebtForStrategy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.strategy = event.params.strategy;
  entity.new_debt = event.params.new_debt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateDepositLimit(event: UpdateDepositLimitEvent): void {
  let entity = new UpdateDepositLimit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.deposit_limit = event.params.deposit_limit;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateMinimumTotalIdle(
  event: UpdateMinimumTotalIdleEvent
): void {
  let entity = new UpdateMinimumTotalIdle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.minimum_total_idle = event.params.minimum_total_idle;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUpdateProfitMaxUnlockTime(
  event: UpdateProfitMaxUnlockTimeEvent
): void {
  let entity = new UpdateProfitMaxUnlockTime(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.profit_max_unlock_time = event.params.profit_max_unlock_time;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDebtPurchased(event: DebtPurchasedEvent): void {
  let entity = new DebtPurchased(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.strategy = event.params.strategy;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleShutdown(event: ShutdownEvent): void {
  let entity = new Shutdown(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
