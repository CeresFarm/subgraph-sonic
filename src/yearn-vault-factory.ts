import {
  NewVault as NewVaultEvent,
  UpdateProtocolFeeBps as UpdateProtocolFeeBpsEvent,
  UpdateProtocolFeeRecipient as UpdateProtocolFeeRecipientEvent,
  UpdateCustomProtocolFee as UpdateCustomProtocolFeeEvent,
  RemovedCustomProtocolFee as RemovedCustomProtocolFeeEvent,
  FactoryShutdown as FactoryShutdownEvent,
  GovernanceTransferred as GovernanceTransferredEvent,
  UpdatePendingGovernance as UpdatePendingGovernanceEvent,
} from "../generated/Yearn Vault Factory/Yearn Vault Factory"
import {
  NewVault,
  UpdateProtocolFeeBps,
  UpdateProtocolFeeRecipient,
  UpdateCustomProtocolFee,
  RemovedCustomProtocolFee,
  FactoryShutdown,
  GovernanceTransferred,
  UpdatePendingGovernance,
} from "../generated/schema"

export function handleNewVault(event: NewVaultEvent): void {
  let entity = new NewVault(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.vault_address = event.params.vault_address
  entity.asset = event.params.asset

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateProtocolFeeBps(
  event: UpdateProtocolFeeBpsEvent,
): void {
  let entity = new UpdateProtocolFeeBps(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.old_fee_bps = event.params.old_fee_bps
  entity.new_fee_bps = event.params.new_fee_bps

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateProtocolFeeRecipient(
  event: UpdateProtocolFeeRecipientEvent,
): void {
  let entity = new UpdateProtocolFeeRecipient(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.old_fee_recipient = event.params.old_fee_recipient
  entity.new_fee_recipient = event.params.new_fee_recipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateCustomProtocolFee(
  event: UpdateCustomProtocolFeeEvent,
): void {
  let entity = new UpdateCustomProtocolFee(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.vault = event.params.vault
  entity.new_custom_protocol_fee = event.params.new_custom_protocol_fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemovedCustomProtocolFee(
  event: RemovedCustomProtocolFeeEvent,
): void {
  let entity = new RemovedCustomProtocolFee(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.vault = event.params.vault

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFactoryShutdown(event: FactoryShutdownEvent): void {
  let entity = new FactoryShutdown(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGovernanceTransferred(
  event: GovernanceTransferredEvent,
): void {
  let entity = new GovernanceTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousGovernance = event.params.previousGovernance
  entity.newGovernance = event.params.newGovernance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdatePendingGovernance(
  event: UpdatePendingGovernanceEvent,
): void {
  let entity = new UpdatePendingGovernance(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newPendingGovernance = event.params.newPendingGovernance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
