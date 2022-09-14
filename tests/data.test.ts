import { assert } from 'chai';
import { getAccount } from '../src/';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

describe('Testing Data', () => {
  const address = new PublicKey('B1tf7ce1TgZ9PHRY9Q2jUpyQJefgj4qtYJ3hAf72DzQV');
  const connection = new Connection(clusterApiUrl('devnet'));
  const signature =
    '4XfoC6hkWttvsBFd2A2uhPhs3fkfgvqViVB5PStzychNB7js3L8Z4LPEKktrCQaR2G3SH8LTZXTCNGn1MDxKYJQT';
  it('Get Data at Signature', async () => {
    const data = await getAccount(connection, address, signature);
    console.log(data);
  });
});
