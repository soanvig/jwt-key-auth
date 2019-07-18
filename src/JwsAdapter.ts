import { IJwtService, IJwt, IJwtPayload } from './types';
import { decode, sign, Algorithm, verify } from 'jws';

/**
 * JwsAdapter connects to `jws` module, to perform JWT signing and veryfing.
 */
export class JwsAdapter implements IJwtService {
  static ALG: Algorithm = 'RS256';

  /**
   * Verifies given token against given public key.
   *
   * @param token - token to verify
   * @param publicKey - public key buffer to verify against
   */
  public async verify (token: IJwt, publicKey: Buffer): Promise<boolean> {
    return verify(token, JwsAdapter.ALG, publicKey);
  }

  /**
   * @TODO change keyName into payload
   */
  public async sign (keyName: string, privateKey: Buffer): Promise<IJwt> {
    return sign({
      header: { alg: JwsAdapter.ALG },
      payload: { keyName },
      privateKey,
    });
  }

  /**
   * Returns payload from given token.
   */
  public getPayload (token: IJwt): IJwtPayload {
    const decoded = decode(token);
    const payload = JSON.parse(decoded.payload);

    return {
      keyName: payload.keyName || '',
    };
  }
}
