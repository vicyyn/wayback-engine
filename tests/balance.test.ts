import { assert } from 'chai';
import { getBalanceAtSignature, getBalanceAtBlocktime, getBalanceAtSlot } from '../src/';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

describe('Testing Balance', () => {
  const address = new PublicKey('5xYwKrT5a5n4GXhXQqDtQabyadR7sPrBHHbjqbdtb4nz');
  const connection = new Connection(clusterApiUrl('mainnet-beta'));
  const signature =
    '4XfoC6hkWttvsBFd2A2uhPhs3fkfgvqViVB5PStzychNB7js3L8Z4LPEKktrCQaR2G3SH8LTZXTCNGn1MDxKYJQT';
  it('User Balance with Signature', async () => {
    const balance = await getBalanceAtSignature(connection, address, signature);
    assert.equal(887793060, balance);
  });
  it('User Balance with Blocktime', async () => {
    const balance = await getBalanceAtBlocktime(connection, address, 1644487905);
    assert.equal(887793060, balance);
  });
  it('User Balance with Slot', async () => {
    const balance = await getBalanceAtSlot(connection, address, 120188217);
    assert.equal(887793060, balance);
  });
});
