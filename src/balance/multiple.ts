import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { getBalanceAtSignature } from './wallet';
import { getTokenBalanceAtBlocktime, getTokenBalanceAtBlocktimeWithMetadata } from './token';
import AccountState from '../states/AccountState';
import TokenAccountState from '../states/TokenAccountState';

/**
 * Get Sol Balance and Token Accounts Balances for an Address at Signature
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balances to fetch
 * @param signature Signature of the Balances to fetch
 */
async function getBalancesAtSignature(
  connection: Connection,
  address: PublicKey,
  signature: string,
): Promise<AccountState> {
  const balance = await getBalanceAtSignature(connection, address, signature);
  const transaction = await connection.getTransaction(signature);
  const tokenAccounts = await connection.getTokenAccountsByOwner(address, {
    programId: TOKEN_PROGRAM_ID,
  });

  const tokenAccountStates: TokenAccountState[] = [];
  for (const tokenAccount of tokenAccounts.value) {
    try {
      const tokenAccountState = await getTokenBalanceAtBlocktime(
        connection,
        tokenAccount.pubkey,
        transaction.blockTime,
      );
      tokenAccountStates.push(tokenAccountState);
    } catch (e) {
      continue;
    }
  }

  const accountState: AccountState = {
    balance,
    signature,
    slot: transaction.slot,
    blockTime: transaction.blockTime,
    address,
    tokenAccounts: tokenAccountStates,
  };
  return accountState;
}

/**
 * Get Sol Balance and Token Accounts Balances for an Address at Blocktime
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balances to fetch
 * @param blocktime Blocktime of the Balances to fetch
 */
async function getBalancesAtBlocktime(
  connection: Connection,
  address: PublicKey,
  blocktime: number,
): Promise<AccountState> {
  const signatures = await connection.getSignaturesForAddress(address);
  for (const signature of signatures) {
    if (!signature.blockTime) continue;
    if (signature.blockTime <= blocktime) {
      return await getBalancesAtSignature(connection, address, signature.signature);
    }
  }
  throw 'Error';
}

/**
 * Get Sol Balance and Token Accounts Balances for an Address at Slot
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balances to fetch
 * @param slot Slot of the Balances to fetch
 */
async function getBalancesAtSlot(
  connection: Connection,
  address: PublicKey,
  slot: number,
): Promise<AccountState> {
  const signatures = await connection.getSignaturesForAddress(address);
  for (const signature of signatures) {
    if (signature.slot <= slot) {
      return await getBalancesAtSignature(connection, address, signature.signature);
    }
  }
  throw 'Error';
}

/**
 * Get Sol Balance and Token Accounts Balances for an Address at Signature
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balances to fetch
 * @param signature Signature of the Balances to fetch
 */
async function getBalancesAtSignatureWithMetadata(
  connection: Connection,
  address: PublicKey,
  signature: string,
): Promise<AccountState> {
  const balance = await getBalanceAtSignature(connection, address, signature);
  const transaction = await connection.getTransaction(signature);
  const tokenAccounts = await connection.getTokenAccountsByOwner(address, {
    programId: TOKEN_PROGRAM_ID,
  });

  const tokenAccountStates: TokenAccountState[] = [];
  for (const tokenAccount of tokenAccounts.value) {
    try {
      const tokenAccountState = await getTokenBalanceAtBlocktimeWithMetadata(
        connection,
        tokenAccount.pubkey,
        transaction.blockTime,
      );
      tokenAccountStates.push(tokenAccountState);
    } catch (e) {
      continue;
    }
  }

  const accountState: AccountState = {
    balance,
    signature,
    slot: transaction.slot,
    blockTime: transaction.blockTime,
    address,
    tokenAccounts: tokenAccountStates,
  };
  return accountState;
}

/**
 * Get Sol Balance and Token Accounts Balances for an Address at Blocktime
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balances to fetch
 * @param blocktime Blocktime of the Balances to fetch
 */
async function getBalancesAtBlocktimeWithMetadata(
  connection: Connection,
  address: PublicKey,
  blocktime: number,
): Promise<AccountState> {
  const signatures = await connection.getSignaturesForAddress(address);
  for (const signature of signatures) {
    if (!signature.blockTime) continue;
    if (signature.blockTime <= blocktime) {
      return await getBalancesAtSignatureWithMetadata(connection, address, signature.signature);
    }
  }
  throw 'Error';
}

/**
 * Get Sol Balance and Token Accounts Balances for an Address at Slot
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Balances to fetch
 * @param slot Slot of the Balances to fetch
 */
async function getBalancesAtSlotWithMetadata(
  connection: Connection,
  address: PublicKey,
  slot: number,
): Promise<AccountState> {
  const signatures = await connection.getSignaturesForAddress(address);
  for (const signature of signatures) {
    if (signature.slot <= slot) {
      return await getBalancesAtSignatureWithMetadata(connection, address, signature.signature);
    }
  }
  throw 'Error';
}

export {
  getBalancesAtSignature,
  getBalancesAtBlocktime,
  getBalancesAtSlot,
  getBalancesAtSignatureWithMetadata,
  getBalancesAtSlotWithMetadata,
  getBalancesAtBlocktimeWithMetadata,
};
