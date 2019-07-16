import { IJwtService, IJwt, IJwtPayload } from './types';
import { decode, sign, Algorithm, verify } from 'jws';

export class JwsAdapter implements IJwtService {
  static ALG: Algorithm = 'RS256';

  public async verify (token: IJwt, publicKey: Buffer): Promise<boolean> {
    return verify(token, JwsAdapter.ALG, publicKey);
  }

  public async sign (keyName: string, privateKey: Buffer): Promise<IJwt> {
    return sign({
      header: { alg: JwsAdapter.ALG },
      payload: { keyName },
      privateKey,
    });
  }

  public getPayload (token: IJwt): IJwtPayload {
    const decoded = decode(token);
    const payload = JSON.parse(decoded.payload);

    return {
      keyName: payload.keyName || '',
    };
  }
}
