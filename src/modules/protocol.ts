import { ProtocolStats } from "../../generated/schema";

export function getOrCreateProtocolStats(): ProtocolStats {
  let protocolStats = ProtocolStats.load("0");
  if (!protocolStats) {
    protocolStats = new ProtocolStats("0");
    protocolStats.save();
  }
  return protocolStats;
}
