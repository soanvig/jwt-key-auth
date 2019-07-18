import { IJwtService, IKeyStore, IJwt } from './types';

/**
 * JwtKeyAuth performs generating and veryfing JWTs.
 * It is designed to work with another JwtKeyAuth instance, in another microservice.
 *
 * JwtKeyAuth's behavior is similar to how SSH works:
 * 1. Instance A, of name "A" generates token for itself.
 * 2. Instance B receives token.
 * 3. If instance B has access to public key of name "A" it verifies token.
 * 4. Instance B returns the result of token's signature validation.
 *
 * By redistributing public keys (by mounting various keys to different services),
 * one can manage microservices permissions. If service B won't have public key of service A,
 * service A won't be allowed to access service B API.
 *
 * JwtKeyAuth requires access to two internal services:
 * - JwtService, which will perform JWT generation and veryfing
 * - KeyStore, which will store public keys of another subjects, and private key of that subject
 *
 * Both services are built-in into JwtKeyAuth (namely [[JwtAdapter]] for `JwtService`,
 * and [[FileKeyStore]] ([[KeyStore]]) for `KeyStore`), but you may provide your custom implementations.
 */
export class JwtKeyAuth {
  constructor (
    private gJwtService: IJwtService,
    private gKeyStore: IKeyStore,
  ) { }

  /**
   * Verifies if given token is properly signed.
   * Requires subject's public key in store.
   * If public key is not present, `false` is returned.
   */
  public async verify (token: IJwt): Promise<boolean> {
    const keyName = this.gJwtService.getPayload(token).keyName;
    const publicKey = await this.gKeyStore.get(keyName);

    if (!publicKey) {
      return false;
    }

    return this.gJwtService.verify(token, publicKey);
  }

  /**
   * Generates token to be sent to other JwtKeyAuth instances.
   *
   * @param keyName - keyName, that should be used later on by other JwtKeyAuth guards
   */
  public async generate (keyName: string): Promise<IJwt> {
    const privateKey = await this.gKeyStore.getPrivate();

    return this.gJwtService.sign({ keyName }, privateKey);
  }
}
