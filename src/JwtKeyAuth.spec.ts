import { KeyStore } from './KeyStore';
import { JwsAdapter } from './JwsAdapter';
import { promises as fs } from 'fs';
import { getTestPath } from '../test/fs';
import { JwtKeyAuth } from './JwtKeyAuth';
import { FileKeyStore } from './FileKeyStore';

describe('JwtKeyAuth integration', () => {
  describe('manually loaded keys', () => {
    it('should properly generate and validate token', async () => {
      const keyName = 'foobar';

      const keyStore = new KeyStore();
      const jwtService = new JwsAdapter();
      const jwtKeyAuth = new JwtKeyAuth(jwtService, keyStore);

      await keyStore.add(keyName, await fs.readFile(getTestPath('keys/rsa_2048_public.pem')));
      await keyStore.addPrivate(await fs.readFile(getTestPath('keys/rsa_2048_private.pem')));

      const token = await jwtKeyAuth.generate(keyName);
      expect(await jwtKeyAuth.verify(token)).toBe(true);
    });
  });

  describe('automatically loaded keys', () => {
    it('should properly generate and validate token', async () => {
      const keyName = 'rsa_2048_public';

      const keyStore = new FileKeyStore();
      const jwtService = new JwsAdapter();
      const jwtKeyAuth = new JwtKeyAuth(jwtService, keyStore);

      await keyStore.fill(getTestPath('keys'));
      await keyStore.addPrivateKeyFile(getTestPath('keys/rsa_2048_private.pem'));

      const token = await jwtKeyAuth.generate(keyName);
      expect(await jwtKeyAuth.verify(token)).toBe(true);
    });
  });
});
