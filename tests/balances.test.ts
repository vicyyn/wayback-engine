import { assert } from 'chai';
import { getBalancesAtSignature } from '../src/';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import {
  getBalancesAtBlocktime,
  getBalancesAtBlocktimeWithMetadata,
  getBalancesAtSignatureWithMetadata,
  getBalancesAtSlot,
  getBalancesAtSlotWithMetadata,
} from '../src/balance/multiple';

describe('Testing Balances', () => {
  const address = new PublicKey('5xYwKrT5a5n4GXhXQqDtQabyadR7sPrBHHbjqbdtb4nz');
  const connection = new Connection(clusterApiUrl('mainnet-beta'));
  const signature =
    '5DU9RPF3q8iE7Hjy1W5Kgq4omdpo7TUGsQWJHbvd45Zr4pD6U7Vmq7BufNXxNz3NE8UApHSE5XjMfKjqhySiahqk';
  it('User Balances with Signature', async () => {
    const accountState = await getBalancesAtSignature(connection, address, signature);
    assert.equal(8, accountState.tokenAccounts.length);
  });
  it('User Balances with Blocktime', async () => {
    const accountState = await getBalancesAtBlocktime(connection, address, 1618853134);
    assert.equal(8, accountState.tokenAccounts.length);
  });
  it('User Balances with Slot', async () => {
    const accountState = await getBalancesAtSlot(connection, address, 74396594);
    assert.equal(8, accountState.tokenAccounts.length);
  });
  it('User Balances with Signature and Metadata', async () => {
    const accountState = await getBalancesAtSignatureWithMetadata(connection, address, signature);
    assert.equal(8, accountState.tokenAccounts.length);
  });
  it('User Balances with Blocktime and Metadata', async () => {
    const accountState = await getBalancesAtBlocktimeWithMetadata(connection, address, 1618853134);
    assert.equal(8, accountState.tokenAccounts.length);
  });
  it('User Balances with Slot and Metadata', async () => {
    const accountState = await getBalancesAtSlotWithMetadata(connection, address, 74396594);
    assert.equal(8, accountState.tokenAccounts.length);
  });
});
