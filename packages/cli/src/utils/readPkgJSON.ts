import fs from 'node:fs';
import path from 'node:path';

export const readPkgJSON = (root: string) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
  } catch (error) {
    return {};
  }
};
