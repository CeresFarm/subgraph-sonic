import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Deposit,
  Withdraw,
  Transfer,
  Approval,
  StrategyChanged,
  StrategyReported,
  DebtUpdated,
  RoleSet,
  UpdateFutureRoleManager,
  UpdateRoleManager,
  UpdateAccountant,
  UpdateDepositLimitModule,
  UpdateWithdrawLimitModule,
  UpdateDefaultQueue,
  UpdateUseDefaultQueue,
  UpdateAutoAllocate,
  UpdatedMaxDebtForStrategy,
  UpdateDepositLimit,
  UpdateMinimumTotalIdle,
  UpdateProfitMaxUnlockTime,
  DebtPurchased,
  Shutdown
} from "../generated/VaultV3/VaultV3"

export function createDepositEvent(
  sender: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return depositEvent
}

export function createWithdrawEvent(
  sender: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return withdrawEvent
}

export function createTransferEvent(
  sender: Address,
  receiver: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createStrategyChangedEvent(
  strategy: Address,
  change_type: BigInt
): StrategyChanged {
  let strategyChangedEvent = changetype<StrategyChanged>(newMockEvent())

  strategyChangedEvent.parameters = new Array()

  strategyChangedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  strategyChangedEvent.parameters.push(
    new ethereum.EventParam(
      "change_type",
      ethereum.Value.fromUnsignedBigInt(change_type)
    )
  )

  return strategyChangedEvent
}

export function createStrategyReportedEvent(
  strategy: Address,
  gain: BigInt,
  loss: BigInt,
  current_debt: BigInt,
  protocol_fees: BigInt,
  total_fees: BigInt,
  total_refunds: BigInt
): StrategyReported {
  let strategyReportedEvent = changetype<StrategyReported>(newMockEvent())

  strategyReportedEvent.parameters = new Array()

  strategyReportedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  strategyReportedEvent.parameters.push(
    new ethereum.EventParam("gain", ethereum.Value.fromUnsignedBigInt(gain))
  )
  strategyReportedEvent.parameters.push(
    new ethereum.EventParam("loss", ethereum.Value.fromUnsignedBigInt(loss))
  )
  strategyReportedEvent.parameters.push(
    new ethereum.EventParam(
      "current_debt",
      ethereum.Value.fromUnsignedBigInt(current_debt)
    )
  )
  strategyReportedEvent.parameters.push(
    new ethereum.EventParam(
      "protocol_fees",
      ethereum.Value.fromUnsignedBigInt(protocol_fees)
    )
  )
  strategyReportedEvent.parameters.push(
    new ethereum.EventParam(
      "total_fees",
      ethereum.Value.fromUnsignedBigInt(total_fees)
    )
  )
  strategyReportedEvent.parameters.push(
    new ethereum.EventParam(
      "total_refunds",
      ethereum.Value.fromUnsignedBigInt(total_refunds)
    )
  )

  return strategyReportedEvent
}

export function createDebtUpdatedEvent(
  strategy: Address,
  current_debt: BigInt,
  new_debt: BigInt
): DebtUpdated {
  let debtUpdatedEvent = changetype<DebtUpdated>(newMockEvent())

  debtUpdatedEvent.parameters = new Array()

  debtUpdatedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  debtUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "current_debt",
      ethereum.Value.fromUnsignedBigInt(current_debt)
    )
  )
  debtUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "new_debt",
      ethereum.Value.fromUnsignedBigInt(new_debt)
    )
  )

  return debtUpdatedEvent
}

export function createRoleSetEvent(account: Address, role: BigInt): RoleSet {
  let roleSetEvent = changetype<RoleSet>(newMockEvent())

  roleSetEvent.parameters = new Array()

  roleSetEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleSetEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromUnsignedBigInt(role))
  )

  return roleSetEvent
}

export function createUpdateFutureRoleManagerEvent(
  future_role_manager: Address
): UpdateFutureRoleManager {
  let updateFutureRoleManagerEvent =
    changetype<UpdateFutureRoleManager>(newMockEvent())

  updateFutureRoleManagerEvent.parameters = new Array()

  updateFutureRoleManagerEvent.parameters.push(
    new ethereum.EventParam(
      "future_role_manager",
      ethereum.Value.fromAddress(future_role_manager)
    )
  )

  return updateFutureRoleManagerEvent
}

export function createUpdateRoleManagerEvent(
  role_manager: Address
): UpdateRoleManager {
  let updateRoleManagerEvent = changetype<UpdateRoleManager>(newMockEvent())

  updateRoleManagerEvent.parameters = new Array()

  updateRoleManagerEvent.parameters.push(
    new ethereum.EventParam(
      "role_manager",
      ethereum.Value.fromAddress(role_manager)
    )
  )

  return updateRoleManagerEvent
}

export function createUpdateAccountantEvent(
  accountant: Address
): UpdateAccountant {
  let updateAccountantEvent = changetype<UpdateAccountant>(newMockEvent())

  updateAccountantEvent.parameters = new Array()

  updateAccountantEvent.parameters.push(
    new ethereum.EventParam(
      "accountant",
      ethereum.Value.fromAddress(accountant)
    )
  )

  return updateAccountantEvent
}

export function createUpdateDepositLimitModuleEvent(
  deposit_limit_module: Address
): UpdateDepositLimitModule {
  let updateDepositLimitModuleEvent =
    changetype<UpdateDepositLimitModule>(newMockEvent())

  updateDepositLimitModuleEvent.parameters = new Array()

  updateDepositLimitModuleEvent.parameters.push(
    new ethereum.EventParam(
      "deposit_limit_module",
      ethereum.Value.fromAddress(deposit_limit_module)
    )
  )

  return updateDepositLimitModuleEvent
}

export function createUpdateWithdrawLimitModuleEvent(
  withdraw_limit_module: Address
): UpdateWithdrawLimitModule {
  let updateWithdrawLimitModuleEvent =
    changetype<UpdateWithdrawLimitModule>(newMockEvent())

  updateWithdrawLimitModuleEvent.parameters = new Array()

  updateWithdrawLimitModuleEvent.parameters.push(
    new ethereum.EventParam(
      "withdraw_limit_module",
      ethereum.Value.fromAddress(withdraw_limit_module)
    )
  )

  return updateWithdrawLimitModuleEvent
}

export function createUpdateDefaultQueueEvent(
  new_default_queue: Array<Address>
): UpdateDefaultQueue {
  let updateDefaultQueueEvent = changetype<UpdateDefaultQueue>(newMockEvent())

  updateDefaultQueueEvent.parameters = new Array()

  updateDefaultQueueEvent.parameters.push(
    new ethereum.EventParam(
      "new_default_queue",
      ethereum.Value.fromAddressArray(new_default_queue)
    )
  )

  return updateDefaultQueueEvent
}

export function createUpdateUseDefaultQueueEvent(
  use_default_queue: boolean
): UpdateUseDefaultQueue {
  let updateUseDefaultQueueEvent =
    changetype<UpdateUseDefaultQueue>(newMockEvent())

  updateUseDefaultQueueEvent.parameters = new Array()

  updateUseDefaultQueueEvent.parameters.push(
    new ethereum.EventParam(
      "use_default_queue",
      ethereum.Value.fromBoolean(use_default_queue)
    )
  )

  return updateUseDefaultQueueEvent
}

export function createUpdateAutoAllocateEvent(
  auto_allocate: boolean
): UpdateAutoAllocate {
  let updateAutoAllocateEvent = changetype<UpdateAutoAllocate>(newMockEvent())

  updateAutoAllocateEvent.parameters = new Array()

  updateAutoAllocateEvent.parameters.push(
    new ethereum.EventParam(
      "auto_allocate",
      ethereum.Value.fromBoolean(auto_allocate)
    )
  )

  return updateAutoAllocateEvent
}

export function createUpdatedMaxDebtForStrategyEvent(
  sender: Address,
  strategy: Address,
  new_debt: BigInt
): UpdatedMaxDebtForStrategy {
  let updatedMaxDebtForStrategyEvent =
    changetype<UpdatedMaxDebtForStrategy>(newMockEvent())

  updatedMaxDebtForStrategyEvent.parameters = new Array()

  updatedMaxDebtForStrategyEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  updatedMaxDebtForStrategyEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  updatedMaxDebtForStrategyEvent.parameters.push(
    new ethereum.EventParam(
      "new_debt",
      ethereum.Value.fromUnsignedBigInt(new_debt)
    )
  )

  return updatedMaxDebtForStrategyEvent
}

export function createUpdateDepositLimitEvent(
  deposit_limit: BigInt
): UpdateDepositLimit {
  let updateDepositLimitEvent = changetype<UpdateDepositLimit>(newMockEvent())

  updateDepositLimitEvent.parameters = new Array()

  updateDepositLimitEvent.parameters.push(
    new ethereum.EventParam(
      "deposit_limit",
      ethereum.Value.fromUnsignedBigInt(deposit_limit)
    )
  )

  return updateDepositLimitEvent
}

export function createUpdateMinimumTotalIdleEvent(
  minimum_total_idle: BigInt
): UpdateMinimumTotalIdle {
  let updateMinimumTotalIdleEvent =
    changetype<UpdateMinimumTotalIdle>(newMockEvent())

  updateMinimumTotalIdleEvent.parameters = new Array()

  updateMinimumTotalIdleEvent.parameters.push(
    new ethereum.EventParam(
      "minimum_total_idle",
      ethereum.Value.fromUnsignedBigInt(minimum_total_idle)
    )
  )

  return updateMinimumTotalIdleEvent
}

export function createUpdateProfitMaxUnlockTimeEvent(
  profit_max_unlock_time: BigInt
): UpdateProfitMaxUnlockTime {
  let updateProfitMaxUnlockTimeEvent =
    changetype<UpdateProfitMaxUnlockTime>(newMockEvent())

  updateProfitMaxUnlockTimeEvent.parameters = new Array()

  updateProfitMaxUnlockTimeEvent.parameters.push(
    new ethereum.EventParam(
      "profit_max_unlock_time",
      ethereum.Value.fromUnsignedBigInt(profit_max_unlock_time)
    )
  )

  return updateProfitMaxUnlockTimeEvent
}

export function createDebtPurchasedEvent(
  strategy: Address,
  amount: BigInt
): DebtPurchased {
  let debtPurchasedEvent = changetype<DebtPurchased>(newMockEvent())

  debtPurchasedEvent.parameters = new Array()

  debtPurchasedEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  debtPurchasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return debtPurchasedEvent
}

export function createShutdownEvent(): Shutdown {
  let shutdownEvent = changetype<Shutdown>(newMockEvent())

  shutdownEvent.parameters = new Array()

  return shutdownEvent
}
