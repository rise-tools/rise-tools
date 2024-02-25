import { EventEmitter } from 'events';
import { Services, DeviceId } from '../types';
import { Logger } from '../LogEmitter';
import * as fs from 'fs';
import { DbConnection } from './DbConnection';
import { getTempFilePath } from '../utils';
import { StageLinq } from '../StageLinq';
import { Broadcast, BroadcastMessage, FileTransfer } from '../services';


export declare interface Sources {
	/**
	 *
	 * @event newSource
	 */
	on(event: 'newSource', listener: (source: Source) => void): this;
	on(event: 'sourceRemoved', listener: (sourceName: string, deviceId: DeviceId) => void): this;
	on(event: 'dbDownloaded', listener: (source: Source) => void): this;
}

export class Sources extends EventEmitter {
	#sources: Map<string, Source> = new Map();

	/**
	 * Sources EndPoint Class
	 */


	/**
	 * Check if sources has Source
	 * @param {string} sourceName - Name of source in EngineOS, eg: 'DJ STICK (USB 1)'
	 * @param {DeviceId} deviceId - DeviceID instance
	 * @returns {boolean} true if has source
	 */
	hasSource(sourceName: string, deviceId: DeviceId): boolean {
		return this.#sources.has(`${deviceId.string}${sourceName}`);
	}

	/**
	 * Check if sources has Source AND source has downloaded DB
	 * @param {string} sourceName - Name of source in EngineOS, eg: 'DJ STICK (USB 1)'
	 * @param {DeviceId} deviceId - DeviceID instance
	 * @returns {boolean} true if has Source AND the source has downloaded DB
	 */
	hasSourceAndDB(sourceName: string, deviceId: DeviceId): boolean {
		const source = this.#sources.get(`${deviceId.string}${sourceName}`);
		const dbs = source.getDatabases().filter(db => db.downloaded)
		return (source && dbs.length) ? true : false
	}

	/**
	 * Get Source
	 * @param {string} sourceName Name of source in EngineOS, eg: 'DJ STICK (USB 1)'
	 * @param {DeviceId} deviceId DeviceID instance
	 * @returns {Source}
	 */
	getSource(sourceName: string, deviceId: DeviceId): Source {
		return this.#sources.get(`${deviceId.string}${sourceName}`);
	}

	/**
	 * Get all Sources
	 * @param {DeviceId} [deviceId] Optional narrow results by DeviceId
	 * @returns {Source[]} an array of Sources
	 */
	getSources(deviceId?: DeviceId): Source[] {
		if (deviceId) {
			const filteredMap = new Map([...this.#sources.entries()].filter(entry => entry[0].substring(0, 36) == deviceId.string))
			return [...filteredMap.values()]
		}
		return [...this.#sources.values()]
	}

	/**
	 * Add a new Source
	 * @param {Source} source
	 */
	setSource(source: Source) {
		this.#sources.set(`${source.deviceId.string}${source.name}`, source);
		this.emit('newSource', source);
	}

	/**
	 * Delete Source
	 * @param {string} sourceName name of the source
	 * @param {DeviceId} deviceId
	 */
	deleteSource(sourceName: string, deviceId: DeviceId) {
		this.#sources.delete(`${deviceId.string}${sourceName}`)
		this.emit('sourceRemoved', sourceName, deviceId);
	}

	/**
	 * Get Databases by UUID
	 * @param {string} uuid
	 * @returns {Database[]}
	 */
	getDBByUuid(uuid: string): Database[] {
		const dbs = [...this.#sources.values()].map(src => src.getDatabases()).flat(1)
		return dbs.filter(db => db.uuid == uuid)
	}

	/**
	 * Download a file from Source
	 * @param {Source} source
	 * @param {string} path
	 * @returns {Promise<Uint8Array>}
	 */
	async downloadFile(source: Source, path: string): Promise<Uint8Array> {
		const service = StageLinq.devices.device(source.deviceId).service('FileTransfer') as FileTransfer;
		await service.isAvailable();

		try {
			const file = await service.getFile(source, path);
			return file;
		} catch (err) {
			Logger.error(err);
			throw new Error(err);
		}
	}

	/**
	 * Download DBs from source
	 * @param {Source} source
	 */
	async downloadDbs(source: Source) {
		Logger.debug(`downloadDb request for ${source.name}`);
		for (const database of source.getDatabases()) {
			Logger.info(`downloading ${database.filename}`)
			await database.downloadDb();
		}
		this.emit('dbDownloaded', source);
		this.setSource(source);
		Logger.debug(`Downloaded ${source.deviceId.string}/${source.name}`);
	}
}

type DBInfo = {
	id: number;
	uuid: string;
}

export class Source {
	name: string;
	deviceId: DeviceId;
	#databases: Map<string, Database> = new Map();

	/**
	 * Source Type Class
	 * @constructor
	 * @param {string} name
	 * @param {DeviceId} deviceId
	 */


	constructor(name: string, deviceId: DeviceId) {
		this.name = name;
		this.deviceId = deviceId;
	}
	/**
	 * Get a Database by File Name
	 * @param {string }name Filename eg "m.db"
	 * @returns {Database}
	 */
	getDatabase(name?: string): Database {
		return this.#databases.get(name || "m.db")
	}

	/**
	 * Get an array of all Databases
	 * @returns {Database[]}
	 */

	getDatabases(): Database[] {
		return [...this.#databases.values()]
	}

	/**
	 * New Database Constructor
	 * @param {string} filename
	 * @param {number} size
	 * @param {string} remotePath
	 * @returns
	 */
	newDatabase(filename: string, size: number, remotePath: string): Database {
		const db = new Database(filename, size, remotePath, this)
		this.#databases.set(db.filename, db);
		return db
	}

}


class Database {
	deviceId: DeviceId = null;
	size: number;
	filename: string;
	remotePath: string;
	localPath: string = null;
	uuid: string = null;
	source: Source = null;
	sourceName: string = null;
	txid: number;
	downloaded: boolean = false;

	/**
	 * Database Type Class
	 * @constructor
	 * @param {string} filename name of the file EG: 'm.db'
	 * @param {number} size size of the file
	 * @param {string} remotePath remote path (excl filename) of file
	 * @param {Source} source Source that the DB file is on
	 * @param {Transfer} transfer
	 */
	constructor(filename: string, size: number, remotePath: string, source: Source) {
		this.filename = filename;
		this.size = size;
		this.remotePath = remotePath;
		this.sourceName = source.name;
		this.source = source;
		this.deviceId = source.deviceId;
		this.localPath = getTempFilePath(`${source.deviceId.string}/${source.name}/`);
	}

	/**
	 * Get full remote path & filename
	 */
	get remoteDBPath() {
		return `${this.remotePath}/${this.filename}`
	}

	/**
	 * Get full local path & filename
	 */
	get localDBPath() {
		return `${this.localPath}/${this.filename}`
	}

	/**
	 * Create new Connection to the DB for Querying
	 * @returns {DbConnection}
	 */
	connection(): DbConnection {
		return new DbConnection(this.localDBPath)
	}


	/**
	 * Downloads the Database
	 */
	async downloadDb() {
		const source = StageLinq.sources.getSource(this.sourceName, this.deviceId)
		const service = StageLinq.devices.device(this.deviceId).service("FileTransfer") as FileTransfer;

		if (!service) {
			Logger.error(`FileTransfer service not available for ${this.deviceId.string}`);
			return;
		} else {
			Logger.debug(`FileTransfer service available for ${this.deviceId.string}`);
		}

		Logger.info(`Reading database ${source.deviceId.string}/${source.name}/${this.filename}`);
		const file = await service.getFile(source, this.remoteDBPath);
		Logger.info(`Saving ${this.remoteDBPath}} to ${this.localDBPath}`);
		fs.writeFileSync(this.localDBPath, Buffer.from(file));
		this.downloaded = true;
		await this.processDB();
		Logger.info(`Downloaded ${source.deviceId.string}/${source.name} to ${this.remoteDBPath}`);
	}

	private async processDB() {
		const db = new DbConnection(this.localDBPath)
		const result: DBInfo[] = await db.querySource('SELECT * FROM Information LIMIT 1')
		this.uuid = result[0].uuid
		db.close();

		if (StageLinq.options.services.includes(Services.Broadcast)) {
			Broadcast.emitter.addListener(this.uuid, (key, value) => this.broadcastListener(key, value))
			Logger.debug(`Sources added broadcast listener for ${this.uuid}`);
		}
	}

	private broadcastListener(key: string, value: BroadcastMessage) {
		Logger.silly(`MSG FROM BROADCAST ${key}`, value);
		// const service = StageLinq.devices.device(this.deviceId).service('FileTransfer') as FileTransfer
		// service.getSourceDirInfo(this.source);
	}

}
