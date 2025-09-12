import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { VaultStats } from "../../generated/schema";
import { BIGINT_ZERO } from "../utils/constants";
import { VaultV3 } from "../../generated/VaultV3/VaultV3";

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

export function getVaultPricePerShare(vaultAddress: Address): BigInt | null {
  const vaultContract = VaultV3.bind(vaultAddress);
  const pricePerShare = vaultContract.try_pricePerShare();
  if (!pricePerShare.reverted) {
    return pricePerShare.value;
  } else {
    return null;
  }
}
