import { Bytes } from "@graphprotocol/graph-ts";
import { ProtocolStats } from "../../generated/schema";

export function getOrCreateProtocolStats(): ProtocolStats {
  let protocolStats = ProtocolStats.load("0");
  if (!protocolStats) {
    protocolStats = new ProtocolStats("0");
    protocolStats.vaults = [];
    protocolStats.strategies = [];
    protocolStats.save();
  }
  return protocolStats;
}

export function addVaultToProtocolStats(vaultAddress: Bytes): void {
  const protocolStats = getOrCreateProtocolStats();
  const vaults = protocolStats.vaults;
  vaults.push(vaultAddress);
  protocolStats.vaults = vaults;
  protocolStats.save();
}
