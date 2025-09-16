import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Vault, VaultStats, VaultSnapshotHourly } from "../../generated/schema";
import { BIGDECIMAL_ZERO, BIGINT_ZERO, ZERO_ADDRESS } from "../utils/constants";
import { VaultV3 } from "../../generated/VaultV3/VaultV3";
import { getOrCreateProtocolStats } from "./protocol";

export function getOrCreateVault(vaultAddress: Bytes): Vault {
  let vault = Vault.load(vaultAddress);
  if (!vault) {
    vault = new Vault(vaultAddress);
    // Link to a singleton ProtocolStats entity with ID "0"
    vault.protocolStats = getOrCreateProtocolStats().id;

    const vaultContract = VaultV3.bind(Address.fromBytes(vaultAddress));

    const name = vaultContract.try_name();
    if (!name.reverted) {
      vault.name = name.value;
    } else {
      vault.name = "Invalid Vault";
    }

    const symbol = vaultContract.try_symbol();
    if (!symbol.reverted) {
      vault.symbol = symbol.value;
    } else {
      vault.symbol = "INVALID";
    }

    const decimals = vaultContract.try_decimals();
    if (!decimals.reverted) {
      vault.decimals = decimals.value;
    } else {
      vault.decimals = 18;
    }

    const asset = vaultContract.try_asset();
    if (!asset.reverted) {
      vault.asset = asset.value;
    } else {
      vault.asset = ZERO_ADDRESS;
    }

    vault.totalAssets = BIGINT_ZERO;
    vault.totalSupply = BIGINT_ZERO;

    const pricePerShare = vaultContract.try_pricePerShare();
    if (!pricePerShare.reverted) {
      vault.pricePerShare = pricePerShare.value;
    } else {
      vault.pricePerShare = BIGINT_ZERO;
    }

    vault.depositLimit = BIGINT_ZERO;
    vault.isShutdown = false;
    vault.lastUpdatedTimestamp = BIGINT_ZERO;
    vault.lastSnapshotTimestamp = BIGINT_ZERO;

    vault.save();
  }
  return vault;
}

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

export function createVaultSnapshotHourly(
  vaultAddress: Bytes,
  timestamp: BigInt,
  blockNumber: BigInt
): void {
  const snapshot = new VaultSnapshotHourly(
    vaultAddress.toHex() + "-" + timestamp.toString()
  );

  snapshot.vault = getOrCreateVault(vaultAddress).id;
  snapshot.timestamp = timestamp;
  snapshot.blockNumber = blockNumber;

  // Fetch and store Vault contract specific data
  const vaultContract = VaultV3.bind(Address.fromBytes(vaultAddress));

  const pricePerShare = vaultContract.try_pricePerShare();
  if (!pricePerShare.reverted) {
    snapshot.pricePerShare = pricePerShare.value;
  } else {
    snapshot.pricePerShare = BIGINT_ZERO;
  }

  const totalAssets = vaultContract.try_totalAssets();
  if (!totalAssets.reverted) {
    snapshot.totalAssets = totalAssets.value;
  } else {
    snapshot.totalAssets = BIGINT_ZERO;
  }

  // @todo Fetch the values from other sources
  snapshot.depositApy = BIGDECIMAL_ZERO;
  snapshot.borrowApy = BIGDECIMAL_ZERO;

  snapshot.save();
}
