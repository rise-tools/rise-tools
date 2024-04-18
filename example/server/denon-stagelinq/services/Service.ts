import { EventEmitter } from 'events';
import { strict as assert } from 'assert';
import { Logger } from '../LogEmitter';
import { ServiceMessage, DeviceId } from '../types';
import { Device } from '../devices';
import { ReadContext, WriteContext } from '../utils';
import { Server, Socket, AddressInfo, createServer as CreateServer } from 'net';
import { StageLinq } from '../StageLinq';


const MESSAGE_TIMEOUT = 3000; // in ms


export abstract class Service<T> extends EventEmitter {
	public readonly name: string = "Service";
	public readonly device: Device;
	public deviceId: DeviceId = null;
	public socket: Socket = null;

	protected isBufferedService: boolean = true;
	protected timeout: NodeJS.Timer;
	private messageBuffer: Buffer = null;
	private server: Server = null;

	/**
	 * Service Abstract Class
	 * @param {DeviceId} [deviceId]
	 */
	constructor(deviceId?: DeviceId) {
		super();
		this.deviceId = deviceId || null;
		this.device = (deviceId ? StageLinq.devices.device(deviceId) : null);
	}

	get serverInfo(): AddressInfo {
		return this.server.address() as AddressInfo
	}

	/**
	 * Creates a new Server for Service
	 * @returns {Server}
	 */
	private async startServer(): Promise<Server> {
		return await new Promise((resolve, reject) => {

			const server = CreateServer((socket) => {
				Logger.debug(`[${this.name}] connection from ${socket.remoteAddress}:${socket.remotePort}`)

				clearTimeout(this.timeout);
				this.socket = socket;
				if (this.name !== "Directory") this.emit('connection', this.name, this.deviceId)

				socket.on('error', (err) => reject(err));
				socket.on('data', async (data) => await this.dataHandler(data, socket));

			}).listen(0, '0.0.0.0', () => {
				this.server = server;
				Logger.silly(`opened ${this.name} server on ${this.serverInfo.port}`);
				if (this.deviceId) {
					Logger.silly(`started timer for ${this.name} for ${this.deviceId.string}`)
					this.timeout = setTimeout(this.closeService, 8000, this);
				};
				resolve(server);
			});
		});
	}

	/**
	 * Start Service Listener
	 * @returns {Promise<AddressInfo>}
	 */
	async start(): Promise<AddressInfo> {
		const server = await this.startServer();
		return server.address() as AddressInfo;
	}

	/**
	 * Close Server
	 */
	async stop() {
		assert(this.server);
		try {
			this.server.close();
		} catch (e) {
			Logger.error('Error closing server', e);
		}
	}

	private async subMessageTest(buff: Buffer): Promise<boolean> {
		try {
			const msg = buff.readInt32BE();
			const deviceId = buff.slice(4);
			if (msg === 0 && deviceId.length === 16) {
				return true
			} else {
				return false
			}
		} catch {
			return false
		}
	}


	private concantenateBuffer(data: Buffer): ReadContext {
		let buffer: Buffer = null;
		if (this.messageBuffer && this.messageBuffer.length > 0) {
			buffer = Buffer.concat([this.messageBuffer, data]);
		} else {
			buffer = data;
		}
		this.messageBuffer = null
		const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
		return new ReadContext(arrayBuffer, false)
	}

	/**
	 * Handle incoming Data from Server Socket
	 * @param {Buffer} data
	 * @param {Socket} socket
	 */
	private async dataHandler(data: Buffer, socket: Socket) {

		const ctx = this.concantenateBuffer(data);

		if (!this.isBufferedService) {
			this.emit(`data`, new ReadContext(ctx.readRemainingAsNewArrayBuffer(), false), socket)
		};

		if (await this.subMessageTest(ctx.peek(20))) {
			const messageId = ctx.readUInt32();
			const token = ctx.read(16) // DeviceID
			if (!this.deviceId) {
				const deviceId = new DeviceId(token);
				Logger.silent(`${this.name} adding DeviceId: ${deviceId.string}`)
				this.deviceId = deviceId
			}
			const serviceName = ctx.readNetworkStringUTF16();
			ctx.seek(2);
			Logger.silent(`${messageId} request to ${serviceName} from ${this.deviceId.string}`);
			if (this.device) {
				StageLinq.devices.emit('newService', this.device, this)
			}
			this.emit('newDevice', this);
		}

		try {
			while (ctx.isEOF() === false) {
				if (ctx.sizeLeft() < 4) {
					this.messageBuffer = ctx.readRemainingAsNewBuffer();
					break;
				}

				const length = ctx.readUInt32();
				if (length <= ctx.sizeLeft()) {
					const message = ctx.read(length);
					const data = message.buffer.slice(message.byteOffset, message.byteOffset + length);
					this.emit(`data`, new ReadContext(data, false), socket)
				} else {
					ctx.seek(-4); // Rewind 4 bytes to include the length again
					this.messageBuffer = ctx.readRemainingAsNewBuffer();
					break;
				}
			}
		} catch (err) {
			Logger.error(this.name, this.deviceId.string, err);
		}
	}

	/**
	 * Wait for a message from the wire
	 * @param {string} eventMessage
	 * @param {number} messageId
	 * @returns {Promise<T>}
	 */
	protected async waitForMessage(eventMessage: string, messageId: number): Promise<T> {
		return await new Promise((resolve, reject) => {
			const listener = (message: ServiceMessage<T>) => {
				if (message.id === messageId) {
					this.removeListener(eventMessage, listener);
					resolve(message.message);
				}
			};
			this.addListener(eventMessage, listener);
			setTimeout(() => {
				reject(new Error(`Failed to receive message '${messageId}' on time`));
			}, MESSAGE_TIMEOUT);
		});
	}

	/**
	 * Write a Context message to the socket
	 * @param {WriteContext} ctx
	 * @returns {Promise<boolean>} true if data written
	 */
	protected async write(ctx: WriteContext): Promise<boolean> {
		assert(ctx.isLittleEndian() === false);
		const buf = ctx.getBuffer();
		const written = await this.socket.write(buf);
		return await written;
	}

	/**
	 * Write a length-prefixed Context message to the socket
	 * @param {WriteContext} ctx
	 * @returns {Promise<boolean>} true if data written
	 */
	protected async writeWithLength(ctx: WriteContext): Promise<boolean> {
		assert(ctx.isLittleEndian() === false);
		const newCtx = new WriteContext({ size: ctx.tell() + 4, autoGrow: false });
		newCtx.writeUInt32(ctx.tell());
		newCtx.write(ctx.getBuffer());
		assert(newCtx.isEOF());
		return await this.write(newCtx);
	}

	//
	/**
	 * Callback for server timeout timer
	 * Runs if device doesn't conect to service server
	 * @param {DeviceId} deviceId
	 * @param {string} serviceName
	 * @param {Server} server
	 * @param {StageLinq} parent
	 * @param {ServiceHandler} handler
	 */
	protected async closeService(service: Service<T>) {
		Logger.info(`closing ${service.name} server for ${service.deviceId.string} due to timeout`);
		service.emit('closingService', service)
		service.server.close();
	}

	protected abstract instanceListener(eventName: string, ...args: any): void
}
