import Database = require('better-sqlite3');
import { TrackDBEntry } from '../types';
import { Logger } from '../LogEmitter';
import { inflate } from 'zlib'

export class DbConnection {
	private db: Database.Database;
	private dbPath: string;
	/**
	 *  Create a SQLite DB Interface
	 * @constructor
	 * @param {string} dbPath file path to SQLite.db file
	 */
	constructor(dbPath: string) {
		this.dbPath = dbPath;
		console.log(`Opening ${this.dbPath}`);
		this.db = new Database(this.dbPath);
		this.db.pragma('journal_mode = WAL');
	}

	/**
	 * Execute a SQL query.
	 *
	 * @param {string} query SQL query to execute
	 * @param {any} params Parameters for BetterSqlite3 result.all.
	 * @returns
	 */
	querySource<T>(query: string, ...params: any[]): T[] {
		Logger.debug(`Querying ${this.dbPath}: ${query} (${params.join(', ')})`);
		const result = this.db.prepare(query);
		return result.all(params);
	}

	/**
	 * Inflate Zlib compressed data
	 * @param {Buffer} data
	 * @returns {Promise<Buffer>} Zlib inflated data
	 */
	private async zInflate(data: Buffer): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			inflate(data.slice(4), (err, buffer) => {
				if (err) {
					reject(err);
				} else {
					resolve(buffer);
				}
			});
		});
	}

	/**
	 * Return track's DB entry.
	 *
	 * @param {string} _trackPath Path of track on the source's filesystem.
	 * @returns {Promise<Track>}
	 */
	async getTrackInfo(_trackPath: string): Promise<TrackDBEntry> {
		const trackPath = _trackPath.split('/').slice(5, _trackPath.length).join('/')
		const result: TrackDBEntry[] = this.querySource('SELECT * FROM Track WHERE path = (?) LIMIT 1', trackPath);
		if (!result) throw new Error(`Could not find track: ${trackPath} in database.`);

		result[0].trackData = await this.zInflate(result[0].trackData);
		result[0].overviewWaveFormData = await this.zInflate(result[0].overviewWaveFormData);
		result[0].beatData = await this.zInflate(result[0].beatData);

		return result[0];
	}

	/**
	 *
	 * @param {number} id /ID of track in the database
	 * @returns {Promise<TrackDBEntry>}
	 */
	async getTrackById(id: number): Promise<TrackDBEntry> {
		const result: TrackDBEntry[] = this.querySource('SELECT * FROM Track WHERE id = (?) LIMIT 1', id);
		if (!result) throw new Error(`Could not find track id: ${id} in database.`);
		result[0].trackData = await this.zInflate(result[0].trackData);
		result[0].overviewWaveFormData = await this.zInflate(result[0].overviewWaveFormData);
		result[0].beatData = await this.zInflate(result[0].beatData);
		return result[0];
	}


	/**
	 * Close DB Connection
	 */
	close() {
		Logger.debug(`Closing ${this.dbPath}`);
		this.db.close();
	}

}
