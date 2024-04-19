import { EventEmitter } from 'stream';
import * as fs from 'fs';

export declare interface Logger {
	on(event: 'log', listener: (...args: any) => void): this;
	on(event: 'error', listener: (...args: any) => void): this;
	on(event: 'warn', listener: (...args: any) => void): this;
	on(event: 'info', listener: (...args: any) => void): this;
	on(event: 'debug', listener: (...args: any) => void): this;
	on(event: 'silly', listener: (...args: any) => void): this;
	on(event: 'any', listener: (...args: any) => void): this;
}

export class Logger extends EventEmitter {
	private logStream: fs.WriteStream = null;
	private static _instance: Logger;
	private timeStart: number;


	/**
	 * Logger Utility Class
	 * @param {string} _fileName
	 */
	constructor(_fileName?: string) {
		super();
		const fileName = _fileName || 'log.txt';
		this.logStream = fs.createWriteStream(fileName);//, {flags: 'a'});
		const hrTime = process.hrtime();
		const logTime = Math.floor((hrTime[0] * 1000000 + hrTime[1] / 1000));
		this.timeStart = logTime;
		this.logEntry('[BEGIN]\n');
	}

	static get instance() {
		return this._instance || (this._instance = new this());
	}

	private logEntry(...args: any) {
		const hrTime = process.hrtime();
		const logTime = Math.floor((hrTime[0] * 1000000 + hrTime[1] / 1000));
		this.logStream.write(`[${logTime - this.timeStart}] ${[args.join(' ')]}\n`);

	}

	static log(...args: any) {
		Logger.instance.emit('log', ...args);
		Logger.instance.emit('any', ...args);
		Logger.instance.logEntry(...args);
	}

	static error(...args: any) {
		Logger.instance.emit('error', ...args);
		Logger.instance.emit('any', ...args);
		Logger.instance.logEntry(...args);
	}

	static warn(...args: any) {
		Logger.instance.emit('warn', ...args);
		Logger.instance.emit('any', ...args);
		Logger.instance.logEntry(...args);
	}

	static info(...args: any) {
		Logger.instance.emit('info', ...args);
		Logger.instance.emit('any', ...args);
		Logger.instance.logEntry(...args);
	}

	static debug(...args: any) {
		Logger.instance.emit('debug', ...args);
		Logger.instance.emit('any', ...args);
		Logger.instance.logEntry(...args);
	}

	static silly(...args: any) {
		Logger.instance.emit('silly', ...args);
		Logger.instance.emit('any', ...args);
		Logger.instance.logEntry(...args);
	}

	static silent(...args: any) {
		//Logger.instance.emit('silly', ...args);
		Logger.instance.emit('any', ...args);
		Logger.instance.logEntry(...args);
	}

}