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
import { Address, BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { createTransactionHistory } from "../modules/transaction";
import {
  createVaultSnapshot,
  getOrCreateVault,
  getVaultPricePerShare,
} from "../modules/vault";
import { getOrCreateUserVaultStats } from "../modules/user";
import {
  convertAssetsToBorrowToken,
  getAssetPriceInBorrowToken,
  getOrCreateStrategy,
  getPtPriceInAsset,
  getStrategyPricePerShare,
} from "../modules/strategy";
import { BIGINT_ZERO } from "../utils/constants";

export function handleBlock(block: ethereum.Block): void {
  // Creates hourly, daily, and weekly snapshots based on the timestamp
  createVaultSnapshot(dataSource.address(), block.timestamp, block.number);
}

export function handleApproval(event: ApprovalEvent): void {}

export function handleDeposit(event: DepositEvent): void {
  createTransactionHistory(event, null);
  const vault = getOrCreateVault(event.address);

  const pricePerShare = getVaultPricePerShare(event.address);

  // Update pricePerShareUnderlying if the default strategy is active
  const defaultStrategy = vault.strategies.load().at(0);
  if (defaultStrategy.isActive) {
    vault.pricePerShareUnderlying = convertAssetsToBorrowToken(
      Address.fromBytes(defaultStrategy.id),
      pricePerShare
    );
  }

  vault.pricePerShare = pricePerShare;
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
    if (pricePerShare && pricePerShare.notEqual(BIGINT_ZERO)) {
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

  const pricePerShare = getVaultPricePerShare(event.address);

  // Update pricePerShareUnderlying if the default strategy is active
  const defaultStrategy = vault.strategies.load().at(0);
  if (defaultStrategy.isActive) {
    vault.pricePerShareUnderlying = convertAssetsToBorrowToken(
      Address.fromBytes(defaultStrategy.id),
      pricePerShare
    );
  }

  vault.pricePerShare = pricePerShare;
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

    if (pricePerShare && pricePerShare.notEqual(BIGINT_ZERO)) {
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

export function handleStrategyChanged(event: StrategyChangedEvent): void {}

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

  const totalAssetsRes = vaultContract.try_totalAssets();
  if (!totalAssetsRes.reverted) {
    vault.totalAssets = totalAssetsRes.value;
  }

  const pricePerShare = vaultContract.try_pricePerShare();
  if (!pricePerShare.reverted) {
    vault.pricePerShare = pricePerShare.value;
  }

  vault.pricePerShareUnderlying = convertAssetsToBorrowToken(
    event.params.strategy,
    vault.pricePerShare
  );

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
