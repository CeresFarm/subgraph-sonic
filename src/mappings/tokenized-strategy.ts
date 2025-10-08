import {
  Reported as ReportedEvent,
  UpdatePerformanceFeeRecipient as UpdatePerformanceFeeRecipientEvent,
} from "../../generated/templates/ITokenizedStrategy/ITokenizedStrategy";
import { getOrCreateStrategy } from "../modules/strategy";

export function handleReported(event: ReportedEvent): void {
  const strategy = getOrCreateStrategy(event.address);

  strategy.totalProfit = strategy.totalProfit.plus(event.params.profit);
  strategy.totalLoss = strategy.totalLoss.plus(event.params.loss);
  strategy.totalProtocolFees = strategy.totalProtocolFees.plus(
    event.params.protocolFees
  );
  strategy.totalPerformanceFees = strategy.totalPerformanceFees.plus(
    event.params.performanceFees
  );
  strategy.save();
}

export function handleUpdatePerformanceFeeRecipient(
  event: UpdatePerformanceFeeRecipientEvent
): void {
  const strategy = getOrCreateStrategy(event.address);
  strategy.performanceFeeRecipient = event.params.newPerformanceFeeRecipient;
  strategy.save();
}
