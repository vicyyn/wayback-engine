import { assert } from 'chai';
import {
  getTokenBalanceAtSlot,
  getTokenBalanceAtBlocktime,
  getTokenBalanceAtSignature,
} from '../src/';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import {
  getTokenBalanceAtBlocktimeWithMetadata,
  getTokenBalanceAtSignatureWithMetadata,
  getTokenBalanceAtSlotWithMetadata,
} from '../src/balance/token';

describe('Testing Token Balances', () => {
  const address = new PublicKey('AxvCi5vSExwSCoUeH1KiMDaGAUwCaiB23RpKSRY4KRvh');
  const connection = new Connection(clusterApiUrl('mainnet-beta'));
  const signature =
    'V5Cn52BLUvZsQfZdDtuQ7LBzsvRVcfnhzvgd17hCuKXZdY7XE5YLz1rpVN3h2xmJrMaZCHPeXNbYhDu4AyWSe2c';
  it('Token Balance with Signature', async () => {
    const balance = await getTokenBalanceAtSignature(connection, address, signature);
    assert.equal(530.177318, balance.balance);
  });
  it('Token Balance with Blocktime', async () => {
    const balance = await getTokenBalanceAtBlocktime(connection, address, 1629194194);
    assert.equal(530.177318, balance.balance);
  });
  it('Token Balance with Slot', async () => {
    const balance = await getTokenBalanceAtSlot(connection, address, 92071481);
    assert.equal(530.177318, balance.balance);
  });
  it('Token Balance with Signature and Metadata', async () => {
    const balance = await getTokenBalanceAtSignatureWithMetadata(connection, address, signature);
    assert.equal('Raydium', balance.tokenMetadata.name);
  });
  it('Token Balance with Blocktime and Metadata', async () => {
    const balance = await getTokenBalanceAtBlocktimeWithMetadata(connection, address, 1629194194);
    assert.equal('Raydium', balance.tokenMetadata.name);
  });
  it('Token Balance with Slot and Metadata', async () => {
    const balance = await getTokenBalanceAtSlotWithMetadata(connection, address, 92071481);
    assert.equal('Raydium', balance.tokenMetadata.name);
  });
});
