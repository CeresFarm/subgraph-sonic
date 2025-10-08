import { NewStrategy as NewStrategyEvent } from "../../generated/StrategyFactory/StrategyFactory";
import { NewStrategy } from "../../generated/schema";
import { getOrCreateStrategy } from "../modules/strategy";
import {
  ITokenizedStrategy as ITokenizedStrategyTemplate,
  LeveragedStrategy as LeveragedStrategyTemplate,
} from "../../generated/templates";
export function handleNewStrategy(event: NewStrategyEvent): void {
  {
    // Store immutable entity for historical reference
    let entity = new NewStrategy(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.strategy = event.params.strategy;
    entity.asset = event.params.asset;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
  }

  // Create a new strategy data source from Template
  getOrCreateStrategy(event.params.strategy);
  LeveragedStrategyTemplate.create(event.params.strategy);
  ITokenizedStrategyTemplate.create(event.params.strategy);
}
