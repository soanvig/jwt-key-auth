import { IKeyStore } from './types';

/**
 * Implementation of key store, which handles adding public and private keys.
 *
 * Public and private keys need to be added manually.
 * For automated version of the class see [[FileKeyStore]]
 */
export class KeyStore implements IKeyStore {
  private fPrivateKey: Buffer | null = null;
  private fPublicKeys: Map<string, Buffer> = new Map();

  /**
   * Add key to store.
   *
   * @param keyName - name of the key
   * @param buffer - key's buffer
   */
  public async add (keyName: string, buffer: Buffer): Promise<void> {
    if (this.fPublicKeys.has(keyName)) {
      throw new Error(`Cannot add public key of name "${keyName}. The name is already taken.`);
    }

    this.fPublicKeys.set(keyName, buffer);
  }

  /**
   * Add private key to store.
   *
   * @param buffer - key's buffer
   */
  public async addPrivate (buffer: Buffer): Promise<void> {
    if (this.fPrivateKey) {
      throw new Error('Cannot add private key. The key is already added.');
    }

    this.fPrivateKey = buffer;
  }

  /**
   * Retrieve key of given name from store.
   *
   * @param keyName - name of the key
   */
  public async get (keyName: string): Promise<Buffer | null> {
    return this.fPublicKeys.get(keyName) || null;
  }

  /**
   * Retrieve private key from store.
   */
  public async getPrivate (): Promise<Buffer> {
    if (!this.fPrivateKey) {
      throw new Error('Cannot get private key. Not set yet.');
    }

    return this.fPrivateKey;
  }
}
