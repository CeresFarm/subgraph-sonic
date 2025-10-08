import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Strategy } from "../../generated/schema";
import { BIGINT_ZERO, ZERO_ADDRESS } from "../utils/constants";
import { getOrCreateVault } from "./vault";

import { ITokenizedStrategy } from "../../generated/VaultV3/ITokenizedStrategy";
import { getOrCreateProtocolStats } from "./protocol";
import { LeveragedStrategy } from "../../generated/templates/LeveragedStrategy/LeveragedStrategy";
import { getOrCreateToken } from "./token";

export function getOrCreateStrategy(strategyAddress: Bytes): Strategy {
  let strategy = Strategy.load(strategyAddress);
  if (!strategy) {
    strategy = new Strategy(strategyAddress);
    // Link to a singleton ProtocolStats entity with ID "0"
    strategy.protocolStats = getOrCreateProtocolStats().id;

    strategy.vault = getOrCreateVault(ZERO_ADDRESS).id;

    const strategyContract = ITokenizedStrategy.bind(
      Address.fromBytes(strategyAddress)
    );

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

    const asset = strategyContract.try_asset();
    if (!asset.reverted) {
      strategy.asset = getOrCreateToken(asset.value).id;
    } else {
      strategy.asset = getOrCreateToken(ZERO_ADDRESS).id;
    }

    // Default to "Invalid" type; can be updated later with updateStrategyType
    strategy.strategyType = "Invalid";

    // Initialize financial metrics
    strategy.totalAssets = BIGINT_ZERO;
    strategy.totalSupply = BIGINT_ZERO;
    strategy.totalCollateral = BIGINT_ZERO;
    strategy.totalDebt = BIGINT_ZERO;

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
    strategy.lastSnapshotTimestamp = BIGINT_ZERO;

    strategy.save();
  }
  return strategy;
}

export function getStrategyPricePerShare(strategyAddress: Address): BigInt {
  const strategyContract = ITokenizedStrategy.bind(strategyAddress);
  const pricePerShare = strategyContract.try_pricePerShare();
  if (!pricePerShare.reverted) {
    return pricePerShare.value;
  } else {
    return BIGINT_ZERO;
  }
}

// NOTE: This is a leveraged strategy specific function. Make sure to only call it for leveraged strategies.
export function getPtPriceInAsset(strategyAddress: Address): BigInt {
  const strategy = getOrCreateStrategy(strategyAddress);
  const oneUnit = BigInt.fromI32(10).pow(strategy.decimals as u8);
  if (oneUnit.equals(BIGINT_ZERO)) {
    return BIGINT_ZERO;
  }

  // Convert one unit of pt token to assets
  const strategyContract = LeveragedStrategy.bind(strategyAddress);
  const ptPriceInAsset = strategyContract.try_convertPtToAsset(oneUnit);
  if (!ptPriceInAsset.reverted) {
    return ptPriceInAsset.value;
  } else {
    return BIGINT_ZERO;
  }
}

// NOTE: This is a leveraged strategy specific function. Make sure to only call it for leveraged strategies.
export function getAssetPriceInBorrowToken(strategyAddress: Address): BigInt {
  const strategy = getOrCreateStrategy(strategyAddress);
  const oneUnit = BigInt.fromI32(10).pow(strategy.decimals as u8);
  if (oneUnit.equals(BIGINT_ZERO)) {
    return BIGINT_ZERO;
  }

  // Convert one unit of pt token to assets
  const strategyContract = LeveragedStrategy.bind(strategyAddress);
  const assetPriceInBorrowToken =
    strategyContract.try_convertAssetToBorrowToken(oneUnit);
  if (!assetPriceInBorrowToken.reverted) {
    return assetPriceInBorrowToken.value;
  } else {
    return BIGINT_ZERO;
  }
}

// NOTE: This is a leveraged strategy specific function. Make sure to only call it for leveraged strategies.
export function convertAssetsToBorrowToken(
  strategyAddress: Address,
  assetAmount: BigInt
): BigInt {
  // Convert one unit of pt token to assets
  const strategyContract = LeveragedStrategy.bind(strategyAddress);
  const amountInBorrowTokens =
    strategyContract.try_convertAssetToBorrowToken(assetAmount);
  if (!amountInBorrowTokens.reverted) {
    return amountInBorrowTokens.value;
  } else {
    return BIGINT_ZERO;
  }
}
