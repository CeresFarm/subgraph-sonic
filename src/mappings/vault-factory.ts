import {
  FactoryShutdown as FactoryShutdownEvent,
  GovernanceTransferred as GovernanceTransferredEvent,
  NewVault as NewVaultEvent,
  RemovedCustomProtocolFee as RemovedCustomProtocolFeeEvent,
  UpdateCustomProtocolFee as UpdateCustomProtocolFeeEvent,
  UpdatePendingGovernance as UpdatePendingGovernanceEvent,
  UpdateProtocolFeeBps as UpdateProtocolFeeBpsEvent,
  UpdateProtocolFeeRecipient as UpdateProtocolFeeRecipientEvent,
} from "../../generated/VaultFactory/VaultFactory";
import { NewVault, Vault } from "../../generated/schema";
import { VaultV3 as VaultV3Template } from "../../generated/templates";
import { getOrCreateVault } from "../modules/vault";

export function handleNewVault(event: NewVaultEvent): void {
  {
    // Store immutable entity for historical reference
    let entity = new NewVault(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.vault_address = event.params.vault_address;
    entity.asset = event.params.asset;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
  }

  // Create a new vault data source from Template
  getOrCreateVault(event.params.vault_address);
  VaultV3Template.create(event.params.vault_address);
}

export function handleFactoryShutdown(event: FactoryShutdownEvent): void {}

export function handleGovernanceTransferred(
  event: GovernanceTransferredEvent
): void {}

export function handleRemovedCustomProtocolFee(
  event: RemovedCustomProtocolFeeEvent
): void {}

export function handleUpdateCustomProtocolFee(
  event: UpdateCustomProtocolFeeEvent
): void {}

export function handleUpdatePendingGovernance(
  event: UpdatePendingGovernanceEvent
): void {}

export function handleUpdateProtocolFeeBps(
  event: UpdateProtocolFeeBpsEvent
): void {}

export function handleUpdateProtocolFeeRecipient(
  event: UpdateProtocolFeeRecipientEvent
): void {}
