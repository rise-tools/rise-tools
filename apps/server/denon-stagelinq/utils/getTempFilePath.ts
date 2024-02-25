import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * Recursively create a directory under the OS's temp path.
 * @param {string} p_path Directory to create including filename
 * @returns {string} Absolute path
 */
export function getTempFilePath(p_path: string): string {
	const tmpPath = `/${os.tmpdir()}/localdb/${p_path}`.replace('net://', '');
	let paths = tmpPath.split(/[/\\]/).filter((e) => e.length > 0);
	const isFolder = p_path.endsWith('/') || p_path.endsWith('\\');
	let filename = '';
	if (isFolder === false) {
		filename = paths[paths.length - 1];
		paths.pop();
	}
	const newPath = paths.join('/');
	fs.mkdirSync(path.resolve('/', newPath), { recursive: true });
	return path.resolve('/', newPath, filename);
}
