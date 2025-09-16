import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const BIGINT_ZERO = BigInt.zero();
export const BIGINT_ONE = BigInt.fromI32(1);

export const BIGDECIMAL_ZERO = BigDecimal.zero();
export const BIGDECIMAL_ONE = BigDecimal.fromString("1");

export const ZERO_ADDRESS = Address.zero();

export const BIGINT_ETHER = BigInt.fromI32(10).pow(18);

export const ONE_HOUR_IN_SECONDS = 3600;
export const ONE_DAY_IN_SECONDS = 86400;

export namespace TransactionType {
  export const Invalid = "Invalid";
  export const VaultDeposit = "VaultDeposit";
  export const VaultWithdraw = "VaultWithdraw";
}
