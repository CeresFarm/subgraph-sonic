import { Bytes } from "@graphprotocol/graph-ts";
import { Strategy, Vault } from "../../generated/schema";
import { BIGINT_ZERO } from "../utils/constants";
import { getOrCreateVault } from "./vault";

import { ITokenizedStrategy } from "../../generated/VaultV3/ITokenizedStrategy";

export function getOrCreateStrategy(
  strategyAddress: Bytes,
  vaultAddress: Bytes
): Strategy {
  let strategy = Strategy.load(strategyAddress);
  if (!strategy) {
    strategy = new Strategy(strategyAddress);

    strategy.vault = getOrCreateVault(vaultAddress).id;

    const strategyContract = ITokenizedStrategy.bind(strategyAddress);

    const name = strategyContract.try_name();
    if (!name.reverted) {
      strategy.name = name.value;
    } else {
      strategy.name = "Unknown Strategy";
    }

    const symbol = strategyContract.try_symbol();
    if (!symbol.reverted) {
      strategy.symbol = symbol.value;
    } else {
      strategy.symbol = "UNKNOWN";
    }

    const decimals = strategyContract.try_decimals();
    if (!decimals.reverted) {
      strategy.decimals = decimals.value;
    } else {
      strategy.decimals = 18;
    }

    // Default to "Invalid" type; can be updated later with updateStrategyType
    strategy.strategyType = "Invalid";

    // Initialize financial metrics
    strategy.totalAssets = BIGINT_ZERO;
    strategy.totalSupply = BIGINT_ZERO;

    const pricePerShare = strategyContract.try_pricePerShare();
    if (!pricePerShare.reverted) {
      strategy.pricePerShare = pricePerShare.value;
    } else {
      strategy.pricePerShare = BIGINT_ZERO;
    }

    const performanceFee = strategyContract.try_performanceFee();
    if (!performanceFee.reverted) {
      strategy.performanceFeeBps = performanceFee.value;
    } else {
      strategy.performanceFeeBps = 0;
    }

    strategy.protocolFeeBps = 0;
    strategy.isActive = true;
    strategy.lastReportTimestamp = BIGINT_ZERO;
    strategy.totalProfit = BIGINT_ZERO;
    strategy.totalLoss = BIGINT_ZERO;
    strategy.totalProtocolFees = BIGINT_ZERO;
    strategy.totalPerformanceFees = BIGINT_ZERO;

    strategy.save();
  }
  return strategy;
}
