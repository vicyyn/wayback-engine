import { ConfirmedSignatureInfo, PublicKey, Connection } from '@solana/web3.js';
import axios from 'axios';

interface TokenMetadata {
  name: string;
  symbol: string;
  logoURI: string | null;
  verified?: boolean;
  address: string;
  tags?: Set<'lp-token'>;
  decimals: number | null;
  holders?: number | null;
}

/**
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Signatures to fetch
 * @param maxLength Max Number of Signatures to fetch (default 100,000)
 */
async function getSignaturesForAddress(
  connection: Connection,
  address: PublicKey,
  maxLength?: number,
): Promise<ConfirmedSignatureInfo[]> {
  const signatures = [];
  let _signatures = await connection.getSignaturesForAddress(address);
  signatures.push(..._signatures);
  while (true) {
    if (_signatures.length >= 1000 && signatures.length < (maxLength | 100000)) {
      const lastSignature = _signatures[_signatures.length - 1];
      _signatures = await connection.getSignaturesForAddress(address, {
        before: lastSignature.signature,
      });
      signatures.push(..._signatures);
      continue;
    }
    break;
  }
  return signatures;
}

/**
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Signatures to fetch
 * @param blocktime Blocktime of the Signature to fetch
 */
async function getSignatureAtBlocktime(
  connection: Connection,
  address: PublicKey,
  blocktime: number,
): Promise<ConfirmedSignatureInfo> {
  let signatures = await connection.getSignaturesForAddress(address);
  while (true) {
    for (const signature of signatures) {
      if (!signature.blockTime) continue;
      if (signature.blockTime <= blocktime) {
        return signature;
      }
    }
    if (signatures.length < 1000) {
      break;
    }
    signatures = await connection.getSignaturesForAddress(address, {
      before: signatures[signatures.length - 1].signature,
    });
  }
  throw 'error';
}

/**
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Signatures to fetch
 * @param slot Slot of the Signature to fetch
 */
async function getSignatureAtSlot(
  connection: Connection,
  address: PublicKey,
  slot: number,
): Promise<ConfirmedSignatureInfo> {
  let signatures = await connection.getSignaturesForAddress(address);
  while (true) {
    for (const signature of signatures) {
      if (signature.slot <= slot) {
        return signature;
      }
    }
    if (signatures.length < 1000) {
      break;
    }
    signatures = await connection.getSignaturesForAddress(address, {
      before: signatures[signatures.length - 1].signature,
    });
  }
  throw 'error';
}

/**
 * @param address Address of the Mint Metadata to fetch
 */
async function fetchMint(address: PublicKey): Promise<TokenMetadata> {
  const response = await axios.post(
    `https://token-list-api.solana.cloud/v1/mints?chainId=101`,
    {
      addresses: [address.toBase58()],
    },
    { timeout: 10000 },
  );
  return response.data.content[0];
}

/**
 * @param connection A connection to a fullnode JSON RPC endpoint
 * @param address Address of the Mint to fetch
 */
async function getTokenAccountMint(connection: Connection, address: PublicKey): Promise<PublicKey> {
  const mint = new PublicKey(
    ((await connection.getParsedAccountInfo(address)).value.data as any).parsed['info']['mint'],
  );
  return mint;
}

export {
  getSignaturesForAddress,
  fetchMint,
  TokenMetadata,
  getTokenAccountMint,
  getSignatureAtSlot,
  getSignatureAtBlocktime,
};
