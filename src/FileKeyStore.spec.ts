import { FileKeyStore } from './FileKeyStore';
import { getTestPath } from '../test/fs';

describe('FileKeyStore', () => {
  describe('fill', () => {
    it('should load all keys in directory as public with filename without ext as their names', async () => {
      const store = new FileKeyStore();
      await store.fill(getTestPath('keys'));

      expect(await store.get('rsa_2048_public')).toBeTruthy();
      expect(await store.get('rsa_2048_private')).toBeTruthy();
    });
  });

  describe('addPrivateKeyFile', () => {
    it('should load private key', async () => {
      const store = new FileKeyStore();
      await store.addPrivateKeyFile(getTestPath('keys/rsa_2048_private.pem'));

      expect(await store.getPrivate()).toBeTruthy();
    });
  });
});
