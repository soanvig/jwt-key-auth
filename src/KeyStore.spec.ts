import { KeyStore } from './KeyStore';

describe('KeyStore', () => {
  let keyStore: KeyStore;

  beforeEach(() => {
    keyStore = new KeyStore();
  });

  describe('public keys', () => {
    it('should set and get public keys', async () => {
      const buf1 = Buffer.alloc(0);
      const buf2 = Buffer.alloc(0);

      keyStore.add('key1', buf1);
      keyStore.add('key2', buf2);

      const key1 = await keyStore.get('key1');
      const key2 = await keyStore.get('key2');

      expect(key1).toBe(buf1);
      expect(key2).toBe(buf2);
    });

    it('should return null if key does not exist', async () => {
      expect(await keyStore.get('someKey')).toBeNull();
    });

    it('should throw if keyName is occupied during adding', async () => {
      keyStore.add('key1', Buffer.alloc(0));
      expect(() => keyStore.add('key1', Buffer.alloc(0))).toThrow();
    });
  });

  describe('private keys', () => {
    it('should set and get private key', async () => {
      const buf = Buffer.alloc(0);

      keyStore.addPrivate(buf);

      const key = await keyStore.getPrivate();

      expect(key).toBe(buf);
    });

    it('should throw if private key was not set before getting', async () => {
      expect(keyStore.getPrivate()).rejects.toThrow();
    });

    it('should throw if private key is already set', async () => {
      const buf = Buffer.alloc(0);

      keyStore.addPrivate(buf);

      expect(() => keyStore.addPrivate(buf)).toThrow();
    });
  });
});
