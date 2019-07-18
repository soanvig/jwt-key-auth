/**
 * KeyStore abstract from which keys will be retrieved.
 * Custom adapter may implement that interface (like database adapter or something).
 * For pre-built stores see [[KeyStore]] and [[FileKeyStore]].
 */
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

/**
 * Service used to generate and verify JWTs.
 * For pre-built implementation see [[JwsAdapter]].
 */
export interface IJwtService {
  verify (token: IJwt, publicKey: Buffer): Promise<boolean>;
  sign (payload: IJwtPayload, privateKey: Buffer): Promise<IJwt>;
  getPayload (token: IJwt): IJwtPayload;
}

/**
 * Payload hold by JWT.
 */
export interface IJwtPayload {
  keyName: string;
}

/**
 * Type of generated JWT.
 * Just for convenience.
 */
export type IJwt = string;
