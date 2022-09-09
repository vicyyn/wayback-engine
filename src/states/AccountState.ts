import { PublicKey } from '@solana/web3.js';
import TokenAccountState from './TokenAccountState';

/**
 * The State of an Account at certain Signature/Slot/Blocktime
 *
 * @interface AccountState
 * @member {PublicKey} address Address of the Account
 * @member {number} balance Sol Balance of the Account
 * @member {string} signature Signature of the Account State
 * @member {number} slot Slot of the Account State
 * @member {number} blocktime Blocktime of the Account State
 * @member {TokenAccountState[]} tokenAccounts Token Accounts States of the Account at same Signature/Slot/Blocktime
 */
export default interface AccountState {
  address: PublicKey;
  balance: number;
  signature: string;
  slot: number;
  blockTime: number;
  tokenAccounts: TokenAccountState[];
}
