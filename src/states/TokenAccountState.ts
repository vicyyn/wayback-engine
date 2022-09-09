import { PublicKey } from '@solana/web3.js';
import { TokenMetadata } from '../utils';

/**
 * The State of a Token Account at certain Signature/Slot/Blocktime
 *
 * @interface TokenAccountState
 * @member {PublicKey} address Address of the Token Account
 * @member {PublicKey} mint Mint Address of the Token Account
 * @member {number} balance Token Balance of the Account
 * @member {string} signature Signature of the Account State
 * @member {number} slot Slot of the Account State
 * @member {number} blocktime Blocktime of the Account State
 */
export default interface TokenAccountState {
  address: PublicKey;
  mint: PublicKey;
  balance: number;
  signature: string;
  slot: number;
  blocktime: number;
  tokenMetadata?: TokenMetadata;
}
