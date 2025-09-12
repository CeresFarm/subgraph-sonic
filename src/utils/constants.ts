import { Address, BigInt } from "@graphprotocol/graph-ts";

export const BIGINT_ZERO = BigInt.zero();
export const BIGINT_ONE = BigInt.fromI32(1);

export const ZERO_ADDRESS = Address.zero();

export namespace TransactionType {
  export const Invalid = "Invalid";
  export const VaultDeposit = "VaultDeposit";
  export const VaultWithdraw = "VaultWithdraw";
}
