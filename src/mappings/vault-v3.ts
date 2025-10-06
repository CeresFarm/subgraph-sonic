import {
  Approval as ApprovalEvent,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as TransferEvent,
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
  VaultV3,
} from "../../generated/VaultV3/VaultV3";
import {
  StrategyChanged,
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
  VaultStrategyReported,
} from "../../generated/schema";
import { BigInt, Bytes, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { createTransactionHistory } from "../modules/transaction";
import {
  createVaultSnapshot,
  getOrCreateVault,
  getOrCreateVaultStats,
  getVaultPricePerShare,
} from "../modules/vault";
import { getOrCreateUserVaultStats } from "../modules/user";
import { getOrCreateStrategy } from "../modules/strategy";

export function handleBlock(block: ethereum.Block): void {
  // Creates hourly, daily, and weekly snapshots based on the timestamp
  createVaultSnapshot(dataSource.address(), block.timestamp, block.number);
}

export function handleApproval(event: ApprovalEvent): void {}

export function handleDeposit(event: DepositEvent): void {
  createTransactionHistory(event, null);
  const vault = getOrCreateVault(event.address);
  vault.totalAssetsDeposited = vault.totalAssetsDeposited.plus(
    event.params.assets
  );
  vault.save();

  // Update user vault stats
  {
    let userVaultStats = getOrCreateUserVaultStats(
      event.params.owner,
      event.address
    );
    userVaultStats.userAddress = event.params.owner;
    userVaultStats.vaultAddress = event.address;
    const totalSharesAfterDeposit = userVaultStats.currentShares.plus(
      event.params.shares
    );
    const pricePerShare = getVaultPricePerShare(event.address);
    if (pricePerShare) {
      // If the pricePerShare value is received from the contract, calculate the avgPricePerShare of user
      // Avg PricePerShare = (Prev shares * Prev Avg PPS + Deposited Shares * Current PPS) / totalShares
      const numerator = userVaultStats.avgPricePerShare
        .times(userVaultStats.currentShares)
        .plus(event.params.shares.times(pricePerShare));
      userVaultStats.avgPricePerShare = numerator.div(totalSharesAfterDeposit);
    }

    userVaultStats.totalAssetsDeposited =
      userVaultStats.totalAssetsDeposited.plus(event.params.assets);
    userVaultStats.currentShares = totalSharesAfterDeposit;
    userVaultStats.lastUpdatedTimestamp = event.block.timestamp;
    userVaultStats.save();
  }
}

export function handleWithdraw(event: WithdrawEvent): void {
  createTransactionHistory(null, event);

  const vault = getOrCreateVault(event.address);
  vault.totalAssetsWithdrawn = vault.totalAssetsWithdrawn.plus(
    event.params.assets
  );
  vault.save();

  // Update user vault stats
  {
    let userVaultStats = getOrCreateUserVaultStats(
      event.params.owner,
      event.address
    );

    const pricePerShare = getVaultPricePerShare(event.address);
    if (pricePerShare) {
      const vaultDecimalsFactor = BigInt.fromI32(10).pow(18); // @todo Replace18 with vault decimals to generalize fn
      // Calculate realized profits/loss
      const pnlAssets = pricePerShare
        .minus(userVaultStats.avgPricePerShare)
        .times(event.params.shares)
        .div(vaultDecimalsFactor);

      userVaultStats.realizedPnlAssets =
        userVaultStats.realizedPnlAssets.plus(pnlAssets);

      // @todo Add realized pnl usd
    }

    userVaultStats.totalAssetsWithdrawn =
      userVaultStats.totalAssetsWithdrawn.plus(event.params.assets);
    userVaultStats.currentShares = userVaultStats.currentShares.minus(
      event.params.shares
    );
    // Avg price per share remains the same on withdraw
    userVaultStats.lastUpdatedTimestamp = event.block.timestamp;
    userVaultStats.save();
  }
}

export function handleTransfer(event: TransferEvent): void {}

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

/////////////////////////////////////////////////////////////////

export function handleStrategyReported(event: StrategyReportedEvent): void {
  const vaultStats = getOrCreateVaultStats(event.address);
  vaultStats.totalGain = vaultStats.totalGain.plus(event.params.gain);
  vaultStats.totalLoss = vaultStats.totalLoss.plus(event.params.loss);
  vaultStats.currentDebt = event.params.current_debt;
  vaultStats.totalProtocolFees = event.params.protocol_fees;
  vaultStats.totalFees = vaultStats.totalFees.plus(event.params.total_fees);
  vaultStats.totalRefunds = vaultStats.totalFees.plus(
    event.params.total_refunds
  );
  vaultStats.lastUpdateTimestamp = event.block.timestamp;
  vaultStats.save();

  const vault = getOrCreateVault(event.address);
  const vaultContract = VaultV3.bind(event.address);

  const totalAssetsRes = vaultContract.try_totalAssets();
  if (!totalAssetsRes.reverted) {
    vault.totalAssets = totalAssetsRes.value;
  }

  const pricePerShare = vaultContract.try_pricePerShare();
  if (!pricePerShare.reverted) {
    vault.pricePerShare = pricePerShare.value;
  }

  vault.lastUpdatedTimestamp = event.block.timestamp;
  vault.save();

  // Store the strategy reports
  const id = event.address
    .toHexString()
    .concat(event.params.strategy.toHexString())
    .concat(event.transaction.hash.toHexString());
  const vaultStrategyReported = new VaultStrategyReported(id);
  vaultStrategyReported.vault = getOrCreateVault(event.address).id;
  vaultStrategyReported.strategy = getOrCreateStrategy(
    event.params.strategy
  ).id;
  vaultStrategyReported.gain = event.params.gain;
  vaultStrategyReported.loss = event.params.loss;
  vaultStrategyReported.timestamp = event.block.timestamp;
  vaultStrategyReported.txHash = event.transaction.hash;
  vaultStrategyReported.save();
}
