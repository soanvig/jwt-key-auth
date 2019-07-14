import { JwtService, KeyStore, IJwt } from './types';

export class JwtKeyAuth {
  constructor(
    private gJwtService: JwtService,
    private gKeyStore: KeyStore,
  ) { }

  public async verify(token: IJwt): Promise<boolean> {
    const keyName = (await this.gJwtService.getPayload(token)).keyName;
    const publicKey = await this.gKeyStore.get(keyName);

    if (!publicKey) {
      return false;
    }

    return this.gJwtService.verify(token, publicKey);
  }

  public async generate(keyName: string): Promise<IJwt> {
    const privateKey = await this.gKeyStore.getPrivate();

    return this.gJwtService.sign(keyName, privateKey);
  }
}