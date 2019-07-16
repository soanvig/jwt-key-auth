import { promises as fs } from 'fs';
import { JwsAdapter } from './JwsAdapter';
import { IJwt } from './types';
import { getTestPath } from '../test/fs';

describe('JwsAdapter', () => {
  let Adapter: JwsAdapter;
  let publicKey: Buffer;
  let privateKey: Buffer;
  let keyName: string;

  beforeAll(async () => {
    Adapter = new JwsAdapter();
    publicKey = await fs.readFile(getTestPath('keys/rsa_2048_public.pem'));
    privateKey = await fs.readFile(getTestPath('keys/rsa_2048_private.pem'));
    keyName = 'rsa_pem_2048';
  });

  it('should return proper payload (keyName) encoded', async () => {
    const token: IJwt = await Adapter.sign(keyName, privateKey);

    expect(Adapter.getPayload(token).keyName).toBe(keyName);
  });

  it('should properly sign and verify token with given keys', async () => {
    const token: IJwt = await Adapter.sign(keyName, privateKey);
    console.log(token);
    const verifyResult: boolean = await Adapter.verify(token, publicKey);

    expect(verifyResult).toBe(true);
  });
});
