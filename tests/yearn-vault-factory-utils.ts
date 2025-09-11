import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  NewVault,
  UpdateProtocolFeeBps,
  UpdateProtocolFeeRecipient,
  UpdateCustomProtocolFee,
  RemovedCustomProtocolFee,
  FactoryShutdown,
  GovernanceTransferred,
  UpdatePendingGovernance
} from "../generated/Yearn Vault Factory/Yearn Vault Factory"

export function createNewVaultEvent(
  vault_address: Address,
  asset: Address
): NewVault {
  let newVaultEvent = changetype<NewVault>(newMockEvent())

  newVaultEvent.parameters = new Array()

  newVaultEvent.parameters.push(
    new ethereum.EventParam(
      "vault_address",
      ethereum.Value.fromAddress(vault_address)
    )
  )
  newVaultEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )

  return newVaultEvent
}

export function createUpdateProtocolFeeBpsEvent(
  old_fee_bps: i32,
  new_fee_bps: i32
): UpdateProtocolFeeBps {
  let updateProtocolFeeBpsEvent =
    changetype<UpdateProtocolFeeBps>(newMockEvent())

  updateProtocolFeeBpsEvent.parameters = new Array()

  updateProtocolFeeBpsEvent.parameters.push(
    new ethereum.EventParam(
      "old_fee_bps",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(old_fee_bps))
    )
  )
  updateProtocolFeeBpsEvent.parameters.push(
    new ethereum.EventParam(
      "new_fee_bps",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(new_fee_bps))
    )
  )

  return updateProtocolFeeBpsEvent
}

export function createUpdateProtocolFeeRecipientEvent(
  old_fee_recipient: Address,
  new_fee_recipient: Address
): UpdateProtocolFeeRecipient {
  let updateProtocolFeeRecipientEvent =
    changetype<UpdateProtocolFeeRecipient>(newMockEvent())

  updateProtocolFeeRecipientEvent.parameters = new Array()

  updateProtocolFeeRecipientEvent.parameters.push(
    new ethereum.EventParam(
      "old_fee_recipient",
      ethereum.Value.fromAddress(old_fee_recipient)
    )
  )
  updateProtocolFeeRecipientEvent.parameters.push(
    new ethereum.EventParam(
      "new_fee_recipient",
      ethereum.Value.fromAddress(new_fee_recipient)
    )
  )

  return updateProtocolFeeRecipientEvent
}

export function createUpdateCustomProtocolFeeEvent(
  vault: Address,
  new_custom_protocol_fee: i32
): UpdateCustomProtocolFee {
  let updateCustomProtocolFeeEvent =
    changetype<UpdateCustomProtocolFee>(newMockEvent())

  updateCustomProtocolFeeEvent.parameters = new Array()

  updateCustomProtocolFeeEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  updateCustomProtocolFeeEvent.parameters.push(
    new ethereum.EventParam(
      "new_custom_protocol_fee",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(new_custom_protocol_fee))
    )
  )

  return updateCustomProtocolFeeEvent
}

export function createRemovedCustomProtocolFeeEvent(
  vault: Address
): RemovedCustomProtocolFee {
  let removedCustomProtocolFeeEvent =
    changetype<RemovedCustomProtocolFee>(newMockEvent())

  removedCustomProtocolFeeEvent.parameters = new Array()

  removedCustomProtocolFeeEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )

  return removedCustomProtocolFeeEvent
}

export function createFactoryShutdownEvent(): FactoryShutdown {
  let factoryShutdownEvent = changetype<FactoryShutdown>(newMockEvent())

  factoryShutdownEvent.parameters = new Array()

  return factoryShutdownEvent
}

export function createGovernanceTransferredEvent(
  previousGovernance: Address,
  newGovernance: Address
): GovernanceTransferred {
  let governanceTransferredEvent =
    changetype<GovernanceTransferred>(newMockEvent())

  governanceTransferredEvent.parameters = new Array()

  governanceTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousGovernance",
      ethereum.Value.fromAddress(previousGovernance)
    )
  )
  governanceTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "newGovernance",
      ethereum.Value.fromAddress(newGovernance)
    )
  )

  return governanceTransferredEvent
}

export function createUpdatePendingGovernanceEvent(
  newPendingGovernance: Address
): UpdatePendingGovernance {
  let updatePendingGovernanceEvent =
    changetype<UpdatePendingGovernance>(newMockEvent())

  updatePendingGovernanceEvent.parameters = new Array()

  updatePendingGovernanceEvent.parameters.push(
    new ethereum.EventParam(
      "newPendingGovernance",
      ethereum.Value.fromAddress(newPendingGovernance)
    )
  )

  return updatePendingGovernanceEvent
}
