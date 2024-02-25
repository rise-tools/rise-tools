import { strict as assert } from 'assert';
import { ReadContext, WriteContext } from '../utils';
import { Service } from './Service';
import type { ServiceMessage, DeviceId } from '../types';
import { EventEmitter } from 'events';


type BeatCallback = (n: BeatData) => void;

type BeatOptions = {
	everyNBeats: number,
}

interface deckBeatData {
	beat: number;
	totalBeats: number;
	BPM: number;
	samples?: number;
}

export interface BeatData {
	service: BeatInfo;
	deviceId: DeviceId;
	clock: bigint;
	deckCount: number;
	deck: deckBeatData[];
}

export declare interface BeatInfo {
	on(event: 'beatMessage', listener: (message: ServiceMessage<BeatData>) => void): this;
}

export class BeatInfo extends Service<BeatData> {
	public readonly name = "BeatInfo";
	static #instances: Map<string, BeatInfo> = new Map()
	static readonly emitter: EventEmitter = new EventEmitter();

	#userBeatCallback: BeatCallback = null;
	#userBeatOptions: BeatOptions = null;
	#currentBeatData: BeatData = null;
	protected isBufferedService: boolean = true;

	/**
	 * BeatInfo Service Class
	 * @constructor
	 * @param {DeviceId} [deviceId] 
	 */

	constructor(deviceId: DeviceId) {
		super(deviceId)
		BeatInfo.#instances.set(this.deviceId.string, this)
		this.addListener('connection', () => this.instanceListener('newDevice', this));
		this.addListener('beatMessage', (data: BeatData) => this.instanceListener('beatMessage', data));
		this.addListener(`data`, (ctx: ReadContext) => this.parseData(ctx));
		this.addListener(`message`, (message: ServiceMessage<BeatData>) => this.messageHandler(message));
	}

	protected instanceListener(eventName: string, ...args: any) {
		BeatInfo.emitter.emit(eventName, ...args)
	}

	static getInstances(): string[] {
		return [...BeatInfo.#instances.keys()]
	}

	deleteDevice(deviceId: DeviceId) {
		BeatInfo.#instances.delete(deviceId.string)
	}
	/**
	 * Get current BeatData
	 * @returns {BeatData}
	 */
	getBeatData(): BeatData {
		return this.#currentBeatData;
	}

	/**
	 * Start BeatInfo
	 * @param {BeatOptions} options 
	 * @param {BeatCallback} [beatCB] Optional User callback
	 */
	public startBeatInfo(options: BeatOptions, beatCB?: BeatCallback) {
		if (beatCB) {
			this.#userBeatCallback = beatCB;
		}
		this.#userBeatOptions = options;
		this.sendBeatInfoRequest();
	}

	/**
	 * Send Subscribe to BeatInfo message to Device
	 * @param {Socket} socket 
	 */
	private async sendBeatInfoRequest() {
		const ctx = new WriteContext();
		ctx.write(new Uint8Array([0x0, 0x0, 0x0, 0x4, 0x0, 0x0, 0x0, 0x0]))
		await this.write(ctx);
	}

	private parseData(ctx: ReadContext): ServiceMessage<BeatData> {
		assert(ctx.sizeLeft() > 72);
		let id = ctx.readUInt32()
		const clock = ctx.readUInt64();
		const deckCount = ctx.readUInt32();
		let deck: deckBeatData[] = [];
		for (let i = 0; i < deckCount; i++) {
			let deckData: deckBeatData = {
				beat: ctx.readFloat64(),
				totalBeats: ctx.readFloat64(),
				BPM: ctx.readFloat64(),
			}
			deck.push(deckData);
		}
		for (let i = 0; i < deckCount; i++) {
			deck[i].samples = ctx.readFloat64();
		}
		assert(ctx.isEOF())
		const message = {
			id: id,
			message: {
				service: this,
				deviceId: this.deviceId,
				clock: clock,
				deckCount: deckCount,
				deck: deck,
			}
		}
		this.emit(`message`, message);
		return message
	}

	private messageHandler(data: ServiceMessage<BeatData>): void {

		function resCheck(res: number, prevBeat: number, currentBeat: number): boolean {
			if (res === 0) {
				return true
			}
			return (Math.floor(currentBeat / res) - Math.floor(prevBeat / res) >= 1)
				|| (Math.floor(prevBeat / res) - Math.floor(currentBeat / res) >= 1)
		}

		if (!data || !data.message) {
			return
		}

		if (!this.#currentBeatData) {
			this.#currentBeatData = data.message;
			if (this.listenerCount('beatMessage')) {
				this.emit('beatMessage', data.message);
			}
			if (this.#userBeatCallback) {
				this.#userBeatCallback(data.message);
			}

		}

		let hasUpdated = false;

		for (let i = 0; i < data.message.deckCount; i++) {
			if (resCheck(
				this.#userBeatOptions.everyNBeats,
				this.#currentBeatData.deck[i].beat,
				data.message.deck[i].beat)) {
				hasUpdated = true;
			}
		}

		if (hasUpdated) {
			if (this.listenerCount('beatMessage')) {
				this.emit('beatMessage', data);
			}
			if (this.#userBeatCallback) {
				this.#userBeatCallback(data.message);
			}
		}
		this.#currentBeatData = data.message;
	}

}