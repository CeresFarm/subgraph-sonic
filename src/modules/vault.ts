import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Vault, VaultSnapshot } from "../../generated/schema";
import {
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  ONE_DAY_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_WEEK_IN_SECONDS,
  SnapshotType,
  ZERO_ADDRESS,
} from "../utils/constants";
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
      vault.pricePerShareUnderlying = pricePerShare.value;
    } else {
      vault.pricePerShare = BIGINT_ZERO;
      vault.pricePerShareUnderlying = BIGINT_ZERO;
    }

    vault.depositLimit = BIGINT_ZERO;
    vault.totalAssetsDeposited = BIGINT_ZERO;
    vault.totalAssetsWithdrawn = BIGINT_ZERO;
    vault.isShutdown = false;
    vault.lastUpdatedTimestamp = BIGINT_ZERO;
    vault.lastHourlySnapshot = BIGINT_ZERO;
    vault.lastDailySnapshot = BIGINT_ZERO;
    vault.lastWeeklySnapshot = BIGINT_ZERO;

    vault.save();
  }
  return vault;
}

export function getVaultPricePerShare(vaultAddress: Address): BigInt {
  const vaultContract = VaultV3.bind(vaultAddress);
  const pricePerShare = vaultContract.try_pricePerShare();
  if (!pricePerShare.reverted) {
    return pricePerShare.value;
  } else {
    return BIGINT_ZERO;
  }
}

export function getVaultTotalAssets(vaultAddress: Address): BigInt {
  const vaultContract = VaultV3.bind(vaultAddress);
  const totalAssets = vaultContract.try_totalAssets();
  if (!totalAssets.reverted) {
    return totalAssets.value;
  } else {
    return BIGINT_ZERO;
  }
}

export function createVaultSnapshot(
  vaultAddress: Bytes,
  timestamp: BigInt,
  blockNumber: BigInt
): void {
  let vault = getOrCreateVault(vaultAddress);

  if (!vault) return;

  const baseSnapshotId = vaultAddress
    .toHexString()
    .concat(timestamp.toString())
    .concat("-");

  // Hourly snapshot
  if (vault.lastHourlySnapshot.plus(ONE_HOUR_IN_SECONDS) < timestamp) {
    vault.lastHourlySnapshot = timestamp;
    vault.save();

    const snapshot = new VaultSnapshot(
      baseSnapshotId.concat(SnapshotType.Hourly)
    );

    snapshot.vault = vault.id;
    snapshot.snapshotType = SnapshotType.Hourly;
    snapshot.timestamp = timestamp;
    snapshot.blockNumber = blockNumber;
    snapshot.depositApy = BIGDECIMAL_ZERO;
    snapshot.borrowApy = BIGDECIMAL_ZERO;

    snapshot.pricePerShare = vault.pricePerShare;
    snapshot.pricePerShareUnderlying = vault.pricePerShareUnderlying;

    snapshot.totalAssets = getVaultTotalAssets(Address.fromBytes(vaultAddress));
    snapshot.save();
    return;
  }

  // Daily snapshot
  if (vault.lastDailySnapshot.plus(ONE_DAY_IN_SECONDS) < timestamp) {
    vault.lastDailySnapshot = timestamp;
    vault.save();

    const snapshot = new VaultSnapshot(
      baseSnapshotId.concat(SnapshotType.Daily)
    );

    snapshot.vault = vault.id;
    snapshot.snapshotType = SnapshotType.Daily;
    snapshot.timestamp = timestamp;
    snapshot.blockNumber = blockNumber;
    snapshot.depositApy = BIGDECIMAL_ZERO;
    snapshot.borrowApy = BIGDECIMAL_ZERO;

    snapshot.pricePerShare = vault.pricePerShare;
    snapshot.pricePerShareUnderlying = vault.pricePerShareUnderlying;

    snapshot.totalAssets = getVaultTotalAssets(Address.fromBytes(vaultAddress));
    snapshot.save();
    return;
  }

  // Weekly snapshot
  if (vault.lastWeeklySnapshot.plus(ONE_WEEK_IN_SECONDS) < timestamp) {
    vault.lastWeeklySnapshot = timestamp;
    vault.save();

    const snapshot = new VaultSnapshot(
      baseSnapshotId.concat(SnapshotType.Weekly)
    );

    snapshot.vault = vault.id;
    snapshot.snapshotType = SnapshotType.Weekly;
    snapshot.timestamp = timestamp;
    snapshot.blockNumber = blockNumber;
    snapshot.depositApy = BIGDECIMAL_ZERO;
    snapshot.borrowApy = BIGDECIMAL_ZERO;

    snapshot.pricePerShare = vault.pricePerShare;
    snapshot.pricePerShareUnderlying = vault.pricePerShareUnderlying;

    snapshot.totalAssets = getVaultTotalAssets(Address.fromBytes(vaultAddress));
    snapshot.save();
    return;
  }
}
