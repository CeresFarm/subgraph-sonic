import { Bytes } from "@graphprotocol/graph-ts";
import { VaultStats } from "../../generated/schema";
import { BIGINT_ZERO } from "../utils/constants";

export function getOrCreateVaultStats(vaultAddress: Bytes): VaultStats {
  let vaultStats = VaultStats.load(vaultAddress);
  if (!vaultStats) {
    vaultStats = new VaultStats(vaultAddress);
    vaultStats.totalGain = BIGINT_ZERO;
    vaultStats.totalLoss = BIGINT_ZERO;
    vaultStats.currentDebt = BIGINT_ZERO;
    vaultStats.totalProtocolFees = BIGINT_ZERO;
    vaultStats.totalFees = BIGINT_ZERO;
    vaultStats.totalRefunds = BIGINT_ZERO;
    vaultStats.lastUpdateTimestamp = BIGINT_ZERO;
    vaultStats.save();
  }
  return vaultStats;
}
