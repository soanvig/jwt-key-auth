export interface KeyStore {
  get(keyName: string): Promise<Buffer | null>;

  // throws if not added
  getPrivate(): Promise<Buffer>;
}

export interface JwtService {
  verify(token: IJwt, publicKey: Buffer): Promise<boolean>;
  sign(keyName: string, privateKey: Buffer): Promise<IJwt>;
  getPayload(token: IJwt): Promise<IJwtPayload>;
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