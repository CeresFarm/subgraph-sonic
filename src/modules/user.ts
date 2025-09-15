import { Bytes } from "@graphprotocol/graph-ts";
import { UserVaultStats } from "../../generated/schema";
import { BIGDECIMAL_ZERO, BIGINT_ZERO, ZERO_ADDRESS } from "../utils/constants";

export function getOrCreateUserVaultStats(id: string): UserVaultStats {
  let userVaultStats = UserVaultStats.load(id);
  if (!userVaultStats) {
    userVaultStats = new UserVaultStats(id);
    userVaultStats.userAddress = ZERO_ADDRESS;
    userVaultStats.vaultAddress = ZERO_ADDRESS;
    userVaultStats.totalAssetsDeposited = BIGINT_ZERO;
    userVaultStats.totalAssetsWithdrawn = BIGINT_ZERO;
    userVaultStats.realizedPnlAssets = BIGINT_ZERO;
    userVaultStats.realizedPnlUsd = BIGDECIMAL_ZERO;
    userVaultStats.currentShares = BIGINT_ZERO;
    userVaultStats.avgPricePerShare = BIGINT_ZERO;
    userVaultStats.lastUpdatedTimestamp = BIGINT_ZERO;
    userVaultStats.save();
  }
  return userVaultStats;
}
