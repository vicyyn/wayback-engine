import { Connection, PublicKey } from '@solana/web3.js';

async function getAccount(
  connection: Connection,
  address: PublicKey,
  signature: string,
): Promise<any> {
  const data = connection.getAccountInfo(address);
  return data;
}

export { getAccount };
