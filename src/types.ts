export interface IKeyStore {
  /**
   * Returns one of the public keys
   * @param keyName - public key name or identifier
   */
  get (keyName: string): Promise<Buffer | null>;

  /**
   * Returns individual private key
   */
  getPrivate (): Promise<Buffer>;
}

export interface IJwtService {
  verify (token: IJwt, publicKey: Buffer): Promise<boolean>;
  sign (keyName: string, privateKey: Buffer): Promise<IJwt>;
  getPayload (token: IJwt): Promise<IJwtPayload>;
}

export interface IKey {
  name: string;
  buffer: Buffer;
}

export interface IKeyPath {
  name: string;
  path: string;
}

export interface IJwtPayload {
  keyName: string;
}

export type IJwt = string;
