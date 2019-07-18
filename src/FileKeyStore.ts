import { KeyStore } from './KeyStore';
import { promises as fs, Dirent } from 'fs';
import { basename, extname, join } from 'path';

export interface IFileKey {
  name: string;
  buffer: Buffer;
}

/**
 * FileKeyStore is extension to [[KeyStore]].
 * It automates process of adding public and private keys, by retrieving them from given locations of file storage.
 *
 * By using `.fill` method one can add to store all **public** keys, that are present in given location.
 * Filename of the key, without extension, is used as the key name.
 *
 * By using `.addPrivateKeyFile` one can add private key, for that instance of store.
 *
 * It is especially useful, if directory with public keys is mounted to microservice container.
 */
export class FileKeyStore extends KeyStore {
  /**
   * Fills up store with all files (keys) in given `keysDir`.
   * All files are treated as public keys, and filename without extension is used as key name!
   *
   * @param keysDir - absolute path to directory with keys
   */
  public async fill (keysDir: string): Promise<void> {
    const content: Dirent[] = await fs.readdir(keysDir, { withFileTypes: true });
    const files: Dirent[] = content.filter(i => i.isFile());

    const keys: IFileKey[] = await Promise.all(files.map(f => this.loadKey(keysDir, f.name)));

    await Promise.all(keys.map(k => this.add(k.name, k.buffer)));
  }

  /**
   * Loads file under given path as private key.
   *
   * @param keyPath -absolute  path to private key
   */
  public async addPrivateKeyFile (keyPath: string): Promise<void> {
    const buffer: Buffer = await fs.readFile(keyPath);

    this.addPrivate(buffer);
  }

  /**
   * Loads given key and returns it's buffer and name.
   *
   * @param dirPath - path to directory with key
   * @param filename - key filename
   */
  private async loadKey (dirPath: string, filename: string): Promise<IFileKey> {
    const keyName: string = basename(filename, extname(filename));
    const fullPath: string = join(dirPath, filename);

    return {
      name: keyName,
      buffer: await fs.readFile(fullPath),
    };
  }
}
