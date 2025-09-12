import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createDepositEvent } from "./vault-v3-utils";
import { handleDeposit } from "../src/mappings/vault-v3";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let owner = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let assets = BigInt.fromI32(234);
    let shares = BigInt.fromI32(234);
    let newDepositEvent = createDepositEvent(sender, owner, assets, shares);
    handleDeposit(newDepositEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Deposit created and stored", () => {
    assert.entityCount("Deposit", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Deposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "Deposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "Deposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assets",
      "234"
    );
    assert.fieldEquals(
      "Deposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "shares",
      "234"
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
