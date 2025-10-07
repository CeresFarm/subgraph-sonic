import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserVaultStats, Vault } from "../../generated/schema";
import {
  BIGDECIMAL_ZERO,
  BIGINT_MINUS_ONE,
  BIGINT_ZERO,
} from "../utils/constants";

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
    userVaultStats.realizedPnlAssets = BIGINT_ZERO;
    userVaultStats.realizedPnlUnderlying = BIGDECIMAL_ZERO;
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

  let stats = getOrCreateUserVaultStats(userAddress, vaultAddress);

  // Deposit tx
  if (assets.gt(BIGINT_ZERO)) {
    const totalSharesAfterDeposit = stats.currentShares.plus(shares);

    if (vault.pricePerShare.notEqual(BIGINT_ZERO)) {
      // Avg PricePerShare = (Prev shares * Prev Avg PPS + Deposited Shares * Current PPS) / totalShares
      const numerator = stats.avgPricePerShare
        .times(stats.currentShares)
        .plus(shares.times(vault.pricePerShare));
      stats.avgPricePerShare = numerator.div(totalSharesAfterDeposit);
    }

    stats.totalAssetsDeposited = stats.totalAssetsDeposited.plus(assets);
    stats.currentShares = totalSharesAfterDeposit;
  } else {
    // Withdrawal tx - shares and assets are negative
    if (vault.pricePerShare.notEqual(BIGINT_ZERO)) {
      const decimalsFactor = BigInt.fromI32(10).pow(vault.decimals as u8);
      // Calculate realized profits/loss
      const pnlAssets = vault.pricePerShare
        .minus(stats.avgPricePerShare)
        .times(shares)
        .times(BIGINT_MINUS_ONE)
        .div(decimalsFactor);

      stats.realizedPnlAssets = stats.realizedPnlAssets.plus(pnlAssets);

      // @todo Add realized pnl usd
    }

    // Assets and shares are negative on withdraw, so we subtract a negative = add
    stats.totalAssetsWithdrawn = stats.totalAssetsWithdrawn.minus(assets);
    stats.currentShares = stats.currentShares.plus(shares);
    // Avg price per share remains the same on withdraw
  }
  stats.lastUpdatedTimestamp = txTimestamp;
  stats.save();
}
