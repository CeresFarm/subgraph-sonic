import { LeveragedStrategy } from "../../generated/templates/LeveragedStrategy/LeveragedStrategy";
import {
  LossOnWithdrawal as LossOnWithdrawalEvent,
  StrategyRebalance as StrategyRebalanceEvent,
} from "../../generated/templates/LeveragedStrategy/LeveragedStrategy";
import { getOrCreateStrategy } from "../modules/strategy";

export function handleLossOnWithdrawal(event: LossOnWithdrawalEvent): void {}

export function handleStrategyRebalance(event: StrategyRebalanceEvent): void {
  const strategy = getOrCreateStrategy(event.address);

  const strategyContract = LeveragedStrategy.bind(event.address);
  const response = strategyContract.try_getRealAssetBalance();
  if (!response.reverted) {
    strategy.totalAssets = response.value.getTotalAssets();
    strategy.totalCollateral = response.value.getTotalCollateral();
    strategy.totalDebt = response.value.getTotalDebt();
    strategy.save();
  }
}
