import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Token } from "../../generated/schema";
import { ERC20 } from "../../generated/templates/VaultV3/ERC20";

export function getOrCreateToken(address: Bytes): Token {
  let token = Token.load(address);
  if (!token) {
    const erc20 = ERC20.bind(Address.fromBytes(address));
    token = new Token(address);
    const name = erc20.try_name();
    if (!name.reverted) {
      token.name = name.value;
    } else {
      token.name = "INVALID";
    }

    const symbol = erc20.try_symbol();
    if (!symbol.reverted) {
      token.symbol = symbol.value;
    } else {
      token.symbol = "INVALID";
    }

    const decimals = erc20.try_decimals();
    if (!decimals.reverted) {
      token.decimals = decimals.value;
    } else {
      token.decimals = 18; // default to 18 decimals
    }

    token.save();
  }
  return token;
}
