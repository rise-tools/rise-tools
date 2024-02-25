import { EventEmitter } from 'events';
import { ReadContext } from '../utils';
import { ServiceMessage, DeviceId } from '../types';
import { Service } from './Service';
import { StageLinq } from '../StageLinq';

export type BroadcastMessage = {
	databaseUuid: string;
	trackId?: number | string;
	listId?: number | string;
	sessionId?: number | string;
};

export interface BroadcastData {
	[key: string]: any;
}

export class Broadcast extends Service<BroadcastData> {
	public readonly name = 'Broadcast';
	protected readonly isBufferedService: boolean = false;
	static readonly emitter: EventEmitter = new EventEmitter();

	/**
	 * Broadcast Service Class
	 * @tag Experimental
	 * @param {DeviceId} deviceId
	 */
	constructor(deviceId: DeviceId) {
		super(deviceId);
		this.addListener(`data`, (ctx: ReadContext) => this.parseData(ctx));
		this.addListener(`message`, (message: ServiceMessage<BroadcastData>) => this.messageHandler(message));
	}

	private parseData(ctx: ReadContext): ServiceMessage<BroadcastData> {
		const length = ctx.readUInt32();
		if (!length && ctx.sizeLeft()) {
			const message = {
				id: length,
				message: {
					deviceId: new DeviceId(ctx.read(16)),
					name: ctx.readNetworkStringUTF16(),
					port: ctx.readUInt16(),
					sizeLeft: ctx.sizeLeft(),
				},
			};
			this.emit(`message`, message);
			return message;
		} else {
			const message = {
				id: length,
				message: {
					json: ctx.getString(length),
					sizeLeft: ctx.sizeLeft(),
				},
			};
			this.emit(`message`, message);
			return message;
		}
	}

	private messageHandler(data: ServiceMessage<BroadcastData>): void {
		if (data?.id === 0) {
			StageLinq.devices.emit('newService', this.device, this);
		}

		if (data?.message?.json) {
			const msg = JSON.parse(data.message.json.replace(/\./g, ''));
			const key = Object.keys(msg).shift();
			const value = Object.values(msg).shift() as BroadcastMessage;
			Broadcast.emitter.emit('message', this.deviceId, key, value);
			if (Broadcast.emitter.listenerCount(value.databaseUuid)) {
				Broadcast.emitter.emit(value.databaseUuid, key, value);
			}
		}
	}

	protected instanceListener(eventName: string, ...args: any) {
		Broadcast.emitter.emit(eventName, ...args);
	}
}
