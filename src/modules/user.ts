import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { UserVaultStats, Vault } from "../../generated/schema";
import { BIGINT_MINUS_ONE, BIGINT_ZERO, BYTES_ZERO } from "../utils/constants";
import { convertAssetsToBorrowToken } from "./strategy";

export function getOrCreateUserVaultStats(
  userAddress: Bytes,
  vaultAddress: Bytes
): UserVaultStats {
  const id = userAddress
    .toHexString()
    .concat("-")
    .concat(vaultAddress.toHexString());
  let userVaultStats = UserVaultStats.load(id);
  if (!userVaultStats) {
    userVaultStats = new UserVaultStats(id);
    userVaultStats.userAddress = userAddress;
    userVaultStats.vaultAddress = vaultAddress;
    userVaultStats.totalAssetsDeposited = BIGINT_ZERO;
    userVaultStats.totalDepositsUnderlying = BIGINT_ZERO;
    userVaultStats.totalAssetsWithdrawn = BIGINT_ZERO;
    userVaultStats.totalWithdrawalsUnderlying = BIGINT_ZERO;
    userVaultStats.totalSharesTransferred = BIGINT_ZERO;
    userVaultStats.realizedPnlAssets = BIGINT_ZERO;
    userVaultStats.realizedPnlUnderlying = BIGINT_ZERO;
    userVaultStats.currentShares = BIGINT_ZERO;
    userVaultStats.avgPricePerShare = BIGINT_ZERO;
    userVaultStats.avgPricePerShareUnderlying = BIGINT_ZERO;
    userVaultStats.lastUpdatedTimestamp = BIGINT_ZERO;
    userVaultStats.save();
  }
  return userVaultStats;
}

export function updateUserVaultStats(
  userAddress: Bytes,
  vaultAddress: Bytes,
  shares: BigInt,
  assets: BigInt,
  txTimestamp: BigInt
): void {
  const vault = Vault.load(vaultAddress);
  if (!vault) return;

  const strategies = vault.strategies.load();

  log.warning("Strategies lengthin updateUserVaultStats: {}", [
    strategies.length.toString(),
  ]);

  let defaultStrategy = BYTES_ZERO;
  if (strategies.length > 0) {
    defaultStrategy = strategies[0].id;
    log.warning("Default strategy for vault {} is {}", [
      vaultAddress.toHexString(),
      defaultStrategy.toHexString(),
    ]);
  }

  let stats = getOrCreateUserVaultStats(userAddress, vaultAddress);

  // Deposit tx - shares and assets are positive
  if (assets.gt(BIGINT_ZERO)) {
    const totalSharesAfterDeposit = stats.currentShares.plus(shares);

    // Avg PricePerShare = (Prev shares * Prev Avg PPS + Deposited Shares * Current PPS) / totalShares
    if (vault.pricePerShare.notEqual(BIGINT_ZERO)) {
      const numerator = stats.avgPricePerShare
        .times(stats.currentShares)
        .plus(shares.times(vault.pricePerShare));
      stats.avgPricePerShare = numerator.div(totalSharesAfterDeposit);
    }

    // Average price per share in underlying
    if (
      vault.pricePerShareUnderlying.notEqual(BIGINT_ZERO) &&
      defaultStrategy.notEqual(BYTES_ZERO)
    ) {
      const pricePerShareUnderlying = vault.pricePerShareUnderlying;

      const numerator = stats.avgPricePerShareUnderlying
        .times(stats.currentShares)
        .plus(shares.times(pricePerShareUnderlying));
      stats.avgPricePerShareUnderlying = numerator.div(totalSharesAfterDeposit);
    }

    stats.totalAssetsDeposited = stats.totalAssetsDeposited.plus(assets);
    const assetsInUnderlying = convertAssetsToBorrowToken(
      Address.fromBytes(defaultStrategy),
      assets
    );
    stats.totalDepositsUnderlying =
      stats.totalDepositsUnderlying.plus(assetsInUnderlying);
    stats.currentShares = totalSharesAfterDeposit;
  } else {
    // Withdrawal tx - shares and assets are negative initially
    // Convert to positive for calculations
    shares = shares.times(BIGINT_MINUS_ONE);
    assets = assets.times(BIGINT_MINUS_ONE);

    if (vault.pricePerShare.notEqual(BIGINT_ZERO)) {
      const decimalsFactor = BigInt.fromI32(10).pow(vault.decimals as u8);
      // Calculate realized profits/loss
      const pnlAssets = vault.pricePerShare
        .minus(stats.avgPricePerShare)
        .times(shares)
        .div(decimalsFactor);

      stats.realizedPnlAssets = stats.realizedPnlAssets.plus(pnlAssets);

      // Realized pnl in underlying
      if (vault.pricePerShareUnderlying.notEqual(BIGINT_ZERO)) {
        const pnlUnderlying = vault.pricePerShareUnderlying
          .minus(stats.avgPricePerShareUnderlying)
          .times(shares)
          .div(decimalsFactor);

        stats.realizedPnlUnderlying =
          stats.realizedPnlUnderlying.plus(pnlUnderlying);
      }
    }

    // Avg price per share remains the same on withdraw
    stats.totalAssetsWithdrawn = stats.totalAssetsWithdrawn.plus(assets);
    stats.currentShares = stats.currentShares.minus(shares);

    const assetsInUnderlying = convertAssetsToBorrowToken(
      Address.fromBytes(defaultStrategy),
      assets
    );
    stats.totalWithdrawalsUnderlying =
      stats.totalWithdrawalsUnderlying.plus(assetsInUnderlying);
  }

  stats.lastUpdatedTimestamp = txTimestamp;
  stats.save();
}
