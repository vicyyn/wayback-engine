import { PublicKey, Connection } from '@solana/web3.js';
import TokenAccountState from '../states/TokenAccountState';
import {
  fetchMint,
  getSignatureAtBlocktime,
  getSignatureAtSlot,
  getTokenAccountMint,
} from '../utils';

/**
 * Get Token Account Balance for an Address at Signature
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Token Balance to fetch
 * @param signature Signature of the Token Balance to fetch
 */
async function getTokenBalanceAtSignature(
  connection: Connection,
  address: PublicKey,
  signature: string,
): Promise<TokenAccountState> {
  const transaction = await connection.getParsedTransaction(signature);
  if (!transaction?.meta?.postTokenBalances) throw 'Error';
  for (const token_balance of transaction?.meta?.postTokenBalances) {
    if (
      transaction.transaction.message.accountKeys[token_balance.accountIndex].pubkey.toBase58() ==
      address.toBase58()
    ) {
      const tokenAccountState: TokenAccountState = {
        balance: parseFloat(token_balance.uiTokenAmount.uiAmountString),
        address,
        signature: signature,
        slot: transaction.slot,
        blocktime: transaction.blockTime,
        mint: null,
      };
      return tokenAccountState;
    }
  }
}

/**
 * Get Token Account Balance for an Address at Blocktime
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Token Balance to fetch
 * @param blocktime Blocktime of the Token Balance to fetch, if there's no match it uses the next lowest signature blocktime available.
 */
async function getTokenBalanceAtBlocktime(
  connection: Connection,
  address: PublicKey,
  blocktime: number,
): Promise<TokenAccountState> {
  const signature = await getSignatureAtBlocktime(connection, address, blocktime);
  return await getTokenBalanceAtSignature(connection, address, signature.signature);
}

/**
 * Get Token Account Balance for an Address at Slot
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Token Balance to fetch
 * @param slot Slot of the Token Balance to fetch, if there's no match it uses the next lowest signature slot available.
 */
async function getTokenBalanceAtSlot(
  connection: Connection,
  address: PublicKey,
  slot: number,
): Promise<TokenAccountState> {
  const signature = await getSignatureAtSlot(connection, address, slot);
  return await getTokenBalanceAtSignature(connection, address, signature.signature);
}

/**
 * Get Token Account Balance for an Address at Signature With Token Metadata
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Token Balance to fetch
 * @param signature Signature of the Token Balance to fetch
 */
async function getTokenBalanceAtSignatureWithMetadata(
  connection: Connection,
  address: PublicKey,
  signature: string,
): Promise<TokenAccountState> {
  const tokenAccountState = await getTokenBalanceAtSignature(connection, address, signature);
  const mint = await getTokenAccountMint(connection, address);
  const tokenMetadata = await fetchMint(mint);
  return { ...tokenAccountState, tokenMetadata, mint };
}

/**
 * Get Token Account Balance for an Address at Slot With Token Metadata
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Token Balance to fetch
 * @param slot Slot of the Token Balance to fetch
 */
async function getTokenBalanceAtSlotWithMetadata(
  connection: Connection,
  address: PublicKey,
  slot: number,
): Promise<TokenAccountState> {
  const tokenAccountState = await getTokenBalanceAtSlot(connection, address, slot);
  const mint = await getTokenAccountMint(connection, address);
  const tokenMetadata = await fetchMint(mint);
  return { ...tokenAccountState, tokenMetadata, mint };
}

/**
 * Get Token Account Balance for an Address at Blocktime With Token Metadata
 *
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Token Balance to fetch
 * @param blocktime Blocktime of the Token Balance to fetch
 */
async function getTokenBalanceAtBlocktimeWithMetadata(
  connection: Connection,
  address: PublicKey,
  blocktime: number,
): Promise<TokenAccountState> {
  const tokenAccountState = await getTokenBalanceAtBlocktime(connection, address, blocktime);
  const mint = await getTokenAccountMint(connection, address);
  const tokenMetadata = await fetchMint(mint);
  return { ...tokenAccountState, tokenMetadata, mint };
}

export {
  getTokenBalanceAtSignature,
  getTokenBalanceAtSlot,
  getTokenBalanceAtBlocktime,
  getTokenBalanceAtBlocktimeWithMetadata,
  getTokenBalanceAtSlotWithMetadata,
  getTokenBalanceAtSignatureWithMetadata,
};
