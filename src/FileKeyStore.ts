import { KeyStore } from './KeyStore';
import { promises as fs, Dirent } from 'fs';
import { basename, extname, join } from 'path';

export interface IFileKey {
  name: string;
  buffer: Buffer;
}

export class FileKeyStore extends KeyStore {
  public async fill (keysDir: string): Promise<void> {
    const content: Dirent[] = await fs.readdir(keysDir, { withFileTypes: true });
    const files: Dirent[] = content.filter(i => i.isFile());

    const keys: IFileKey[] = await Promise.all(files.map(f => this.loadKey(keysDir, f.name)));

    await Promise.all(keys.map(k => this.add(k.name, k.buffer)));
  }

  public async addPrivateKeyFile (keyPath: string): Promise<void> {
    const buffer: Buffer = await fs.readFile(keyPath);

    this.addPrivate(buffer);
  }

  private async loadKey (dirPath: string, filename: string): Promise<IFileKey> {
    const keyName: string = basename(filename, extname(filename));
    const fullPath: string = join(dirPath, filename);

    return {
      name: keyName,
      buffer: await fs.readFile(fullPath),
    };
  }
}
