import { PublicKey, Connection } from '@solana/web3.js';

/**
 * Get Sol Balance for an Address at Signature
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balance to fetch
 * @param signature Signature of the Balance to fetch
 */
async function getBalanceAtSignature(
  connection: Connection,
  address: PublicKey,
  signature: string,
): Promise<number> {
  const transaction = await connection.getTransaction(signature);
  if (!transaction) throw 'Error';
  for (const [index, account_key] of transaction.transaction.message.accountKeys.entries()) {
    if (account_key.toBase58() == address.toBase58()) {
      const balance = transaction?.meta?.postBalances[index];
      return balance;
    }
  }
}

/**
 * Get Sol Balance for an Address at Blocktime
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balance to fetch
 * @param blocktime Blocktime of the Balance to fetch, if there's no match it uses the next lowest signature blocktime available.
 */
async function getBalanceAtBlocktime(
  connection: Connection,
  address: PublicKey,
  blocktime: number,
): Promise<number> {
  const signatures = await connection.getSignaturesForAddress(address);
  for (const signature of signatures) {
    if (!signature.blockTime) continue;
    if (signature.blockTime <= blocktime) {
      return await getBalanceAtSignature(connection, address, signature.signature);
    }
  }
  throw 'Error';
}

/**
 * Get Sol Balance for an Address at Slot
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balance to fetch
 * @param slot Slot of the Balance to fetch, if there's no match it uses the next lowest signature slot available.
 */
async function getBalanceAtSlot(
  connection: Connection,
  address: PublicKey,
  slot: number,
): Promise<number> {
  const signatures = await connection.getSignaturesForAddress(address);
  for (const signature of signatures) {
    if (signature.slot <= slot) {
      return await getBalanceAtSignature(connection, address, signature.signature);
    }
  }
  throw 'Error';
}

export { getBalanceAtSignature, getBalanceAtSlot, getBalanceAtBlocktime };
