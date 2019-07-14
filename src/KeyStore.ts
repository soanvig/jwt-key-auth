import { IKeyStore } from './types';

export class KeyStore implements IKeyStore {
  private fPrivateKey: Buffer | null = null;
  private fPublicKeys: Map<string, Buffer> = new Map();

  public add (keyName: string, buffer: Buffer): void {
    if (this.fPublicKeys.has(keyName)) {
      throw new Error(`Cannot add public key of name "${keyName}. The name is already taken.`);
    }

    this.fPublicKeys.set(keyName, buffer);
  }

  public addPrivate (buffer: Buffer): void {
    if (this.fPrivateKey) {
      throw new Error('Cannot add private key. The key is already added.');
    }

    this.fPrivateKey = buffer;
  }

  public async get (keyName: string): Promise<Buffer | null> {
    return this.fPublicKeys.get(keyName) || null;
  }

  public async getPrivate (): Promise<Buffer> {
    if (!this.fPrivateKey) {
      throw new Error('Cannot get private key. Not set yet.');
    }

    return this.fPrivateKey;
  }
}
