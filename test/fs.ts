import { join } from 'path';

export function getTestPath(filePath: string): string {
  return join(__dirname, filePath);
}
