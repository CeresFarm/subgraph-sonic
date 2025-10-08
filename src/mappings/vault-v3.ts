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
import { VaultStrategyReported } from "../../generated/schema";
import {
  Address,
  BigInt,
  dataSource,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import { createTransactionHistory } from "../modules/transaction";
import {
  calculateVaultPnlInUnderlying,
  createVaultSnapshot,
  getOrCreateVault,
  getVaultPricePerShare,
} from "../modules/vault";
import { updateUserVaultStats } from "../modules/user";
import {
  convertAssetsToBorrowToken,
  getAssetPriceInBorrowToken,
  getOrCreateStrategy,
  getPtPriceInAsset,
  getStrategyPricePerShare,
} from "../modules/strategy";
import {
  BIGINT_MINUS_ONE,
  BIGINT_ONE,
  BIGINT_ZERO,
  ZERO_ADDRESS,
} from "../utils/constants";

export function handleBlock(block: ethereum.Block): void {
  // Creates hourly, daily, and weekly snapshots based on the timestamp
  createVaultSnapshot(dataSource.address(), block.timestamp, block.number);
}

export function handleApproval(event: ApprovalEvent): void {}

export function handleDeposit(event: DepositEvent): void {
  createTransactionHistory(event, null);
  const vault = getOrCreateVault(event.address);

  const pricePerShare = getVaultPricePerShare(event.address);
  let pricePerShareUnderlying: BigInt;

  // Update pricePerShareUnderlying if the default strategy is active
  const strategies = vault.strategies.load();

  log.warning("Strategies length in handleDeposit: {}", [
    strategies.length.toString(),
  ]);

  if (strategies.length > 0) {
    const defaultStrategy = strategies[0];

    pricePerShareUnderlying = convertAssetsToBorrowToken(
      Address.fromBytes(defaultStrategy.id),
      pricePerShare
    );
    const pnlInUnderlying = calculateVaultPnlInUnderlying(
      vault.pricePerShareUnderlying,
      pricePerShareUnderlying,
      vault.totalSupply,
      vault.decimals
    );
    vault.totalPnlUnderlying = vault.totalPnlUnderlying.plus(pnlInUnderlying);
    vault.pricePerShareUnderlying = pricePerShareUnderlying;
  }

  vault.pricePerShare = pricePerShare;
  vault.totalAssetsDeposited = vault.totalAssetsDeposited.plus(
    event.params.assets
  );

  vault.totalAssets = vault.totalAssets.plus(event.params.assets);
  vault.totalSupply = vault.totalSupply.plus(event.params.shares);
  vault.save();

  updateUserVaultStats(
    event.params.owner,
    event.address,
    event.params.shares,
    event.params.assets,
    event.block.timestamp
  );
}

export function handleWithdraw(event: WithdrawEvent): void {
  createTransactionHistory(null, event);
  const vault = getOrCreateVault(event.address);

  const pricePerShare = getVaultPricePerShare(event.address);
  let pricePerShareUnderlying: BigInt;
  // Update pricePerShareUnderlying if the default strategy is active
  const strategies = vault.strategies.load();

  log.warning("Strategies length in handleWithdraw: {}", [
    strategies.length.toString(),
  ]);

  if (strategies.length > 0) {
    const defaultStrategy = strategies[0];

    pricePerShareUnderlying = convertAssetsToBorrowToken(
      Address.fromBytes(defaultStrategy.id),
      pricePerShare
    );
    const pnlInUnderlying = calculateVaultPnlInUnderlying(
      vault.pricePerShareUnderlying,
      pricePerShareUnderlying,
      vault.totalSupply,
      vault.decimals
    );
    vault.totalPnlUnderlying = vault.totalPnlUnderlying.plus(pnlInUnderlying);
    vault.pricePerShareUnderlying = pricePerShareUnderlying;
  }

  vault.pricePerShare = pricePerShare;
  vault.totalAssetsWithdrawn = vault.totalAssetsWithdrawn.plus(
    event.params.assets
  );
  vault.totalAssets = vault.totalAssets.minus(event.params.assets);
  vault.totalSupply = vault.totalSupply.minus(event.params.shares);
  vault.save();

  updateUserVaultStats(
    event.params.owner,
    event.address,
    event.params.shares.times(BIGINT_MINUS_ONE),
    event.params.assets.times(BIGINT_MINUS_ONE),
    event.block.timestamp
  );
}

export function handleTransfer(event: TransferEvent): void {}

export function handleStrategyChanged(event: StrategyChangedEvent): void {
  // If change_type is 1, strategy was added;
  // If change_type is 2, strategy was removed

  const strategy = getOrCreateStrategy(event.params.strategy);
  const vault = getOrCreateVault(event.address);

  if (event.params.change_type == BIGINT_ONE) {
    strategy.vault = vault.id;
    strategy.save();
  } else {
    strategy.vault = ZERO_ADDRESS;
    strategy.save();
  }
}

export function handleDebtUpdated(event: DebtUpdatedEvent): void {}

export function handleRoleSet(event: RoleSetEvent): void {}

export function handleUpdateFutureRoleManager(
  event: UpdateFutureRoleManagerEvent
): void {}

export function handleUpdateRoleManager(event: UpdateRoleManagerEvent): void {}

export function handleUpdateAccountant(event: UpdateAccountantEvent): void {}

export function handleUpdateDepositLimitModule(
  event: UpdateDepositLimitModuleEvent
): void {}

export function handleUpdateWithdrawLimitModule(
  event: UpdateWithdrawLimitModuleEvent
): void {}

export function handleUpdateDefaultQueue(
  event: UpdateDefaultQueueEvent
): void {}

export function handleUpdateUseDefaultQueue(
  event: UpdateUseDefaultQueueEvent
): void {}

export function handleUpdateAutoAllocate(
  event: UpdateAutoAllocateEvent
): void {}

export function handleUpdatedMaxDebtForStrategy(
  event: UpdatedMaxDebtForStrategyEvent
): void {}

export function handleUpdateDepositLimit(
  event: UpdateDepositLimitEvent
): void {}

export function handleUpdateMinimumTotalIdle(
  event: UpdateMinimumTotalIdleEvent
): void {}

export function handleUpdateProfitMaxUnlockTime(
  event: UpdateProfitMaxUnlockTimeEvent
): void {}

export function handleDebtPurchased(event: DebtPurchasedEvent): void {}

export function handleShutdown(event: ShutdownEvent): void {}

/////////////////////////////////////////////////////////////////

export function handleStrategyReported(event: StrategyReportedEvent): void {
  const vault = getOrCreateVault(event.address);
  vault.totalGain = vault.totalGain.plus(event.params.gain);
  vault.totalLoss = vault.totalLoss.plus(event.params.loss);
  vault.currentDebt = event.params.current_debt;
  vault.totalProtocolFees = vault.totalProtocolFees.plus(
    event.params.protocol_fees
  );
  vault.totalFees = vault.totalFees.plus(event.params.total_fees);
  vault.totalRefunds = vault.totalFees.plus(event.params.total_refunds);
  vault.lastUpdatedTimestamp = event.block.timestamp;

  const vaultContract = VaultV3.bind(event.address);

  const pricePerShare = vaultContract.try_pricePerShare();
  if (!pricePerShare.reverted) {
    vault.pricePerShare = pricePerShare.value;
  }

  const pricePerShareUnderlying = convertAssetsToBorrowToken(
    event.params.strategy,
    vault.pricePerShare
  );

  const pnlInUnderlying = calculateVaultPnlInUnderlying(
    vault.pricePerShareUnderlying,
    pricePerShareUnderlying,
    vault.totalAssets,
    vault.decimals
  );
  vault.totalPnlUnderlying = vault.totalPnlUnderlying.plus(pnlInUnderlying);
  vault.pricePerShareUnderlying = pricePerShareUnderlying;

  const totalAssetsRes = vaultContract.try_totalAssets();
  if (!totalAssetsRes.reverted) {
    vault.totalAssets = totalAssetsRes.value;
  }

  vault.save();

  // Store the strategy reports of the vault
  const id = event.address
    .toHexString()
    .concat(event.params.strategy.toHexString())
    .concat(event.transaction.hash.toHexString());

  const vaultStrategyReported = new VaultStrategyReported(id);
  vaultStrategyReported.vault = vault.id;
  vaultStrategyReported.strategy = getOrCreateStrategy(
    event.params.strategy
  ).id;
  vaultStrategyReported.gain = event.params.gain;
  vaultStrategyReported.loss = event.params.loss;
  vaultStrategyReported.timestamp = event.block.timestamp;
  vaultStrategyReported.txHash = event.transaction.hash;

  vaultStrategyReported.vaultPricePerShare = vault.pricePerShare;
  vaultStrategyReported.strategyPricePerShare = getStrategyPricePerShare(
    event.params.strategy
  );
  // @todo Replace/implement separate logic to identify type of strategy
  vaultStrategyReported.ptPriceInAsset = getPtPriceInAsset(
    event.params.strategy
  );
  vaultStrategyReported.assetPriceInBorrowToken = getAssetPriceInBorrowToken(
    event.params.strategy
  );
  vaultStrategyReported.pricePerShareUnderlying = vault.pricePerShareUnderlying;
  vaultStrategyReported.save();
}
