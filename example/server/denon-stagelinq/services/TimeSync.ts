
import { Logger } from '../LogEmitter';
import { performance } from 'perf_hooks';
import { ReadContext, WriteContext } from '../utils';
import { ServiceMessage, DeviceId } from '../types';
import { } from '../devices'
import { Service } from './Service';
import { StageLinq } from '../StageLinq';


export interface TimeSyncData {
	msgs: bigint[],
	timestamp: bigint,
}

export class TimeSynchronization extends Service<TimeSyncData> {
	public readonly name = "TimeSynchronization"
	protected readonly isBufferedService: boolean = false;
	private localTime: bigint;
	private remoteTime: bigint;
	private avgTimeArray: bigint[] = [];

	/**
	 * TimeSynchronization Service Class
	 * @tag Experimental
	 * @constructor
	 * @param deviceId
	 */
	constructor(deviceId: DeviceId) {
		super(deviceId);
		this.addListener(`data`, (ctx: ReadContext) => this.parseData(ctx));
		this.addListener(`message`, (message: ServiceMessage<TimeSyncData>) => this.messageHandler(message));
	}

	public async sendTimeSyncRequest() {
		const ctx = new WriteContext();
		ctx.write(new Uint8Array([0x0, 0x0, 0x0, 0x0]));
		ctx.write(StageLinq.options.actingAs.deviceId.array);
		ctx.write(new Uint8Array([0x0]));
		ctx.writeFixedSizedString('TimeSynchronization');
		await this.write(ctx);
	}

	private timeSyncMsgHelper(msgId: number, msgs: bigint[]): Buffer {
		const getMessage = function (): Buffer {
			const ctx = new WriteContext();
			ctx.writeUInt32(msgId);
			while (msgs.length) {
				ctx.writeUInt64(msgs.shift())
			}
			return ctx.getBuffer()
		}
		const message = getMessage();

		const ctx = new WriteContext();
		ctx.writeUInt32(message.length);
		ctx.write(message);
		return ctx.getBuffer()
	}

	private getTimeStamp(): bigint {
		return (BigInt(Math.floor(performance.now())))
	}


	private sendTimeSyncQuery(localTime: bigint, remoteTime: bigint) {
		this.localTime = localTime;
		const buffMsg = this.timeSyncMsgHelper(1, [this.localTime]);
		const ctx = new WriteContext()
		ctx.write(buffMsg)
		this.remoteTime = remoteTime;
		this.write(ctx);
	};

	// private async sendTimeSyncReply(interval: bigint, timeReceived: bigint): Promise<void> {
	//     const buffMsg = this.timeSyncMsgHelper(2,[interval,timeReceived]);
	//     const ctx = new WriteContext()
	//     ctx.write(buffMsg)
	//     await this.write(ctx, this.socket);
	// };

	protected parseData(ctx: ReadContext): ServiceMessage<TimeSyncData> {
		const timestamp = this.getTimeStamp();
		const size = ctx.readUInt32();

		if (size === 0) {
			const deviceId = new DeviceId(ctx.read(16))
			const svcName = ctx.readNetworkStringUTF16();
			const svcPort = ctx.readUInt16();
			console.log(deviceId.string, svcName, svcPort)
		} else {
			const id = ctx.readUInt32();
			const msgs: bigint[] = []
			while (ctx.sizeLeft()) {
				msgs.push(ctx.readUInt64())
			};
			const message = {
				id: id,
				message: {
					msgs: msgs,
					timestamp: timestamp,
				}
			}
			this.emit(`message`, message);
			return message
		}
	}

	private timeAvg(time: bigint) {
		if (this.avgTimeArray.length > 100) {
			this.avgTimeArray.shift();
			this.avgTimeArray.push(time);
			const sum = this.avgTimeArray.reduce((a, b) => a + b, 0n);
			const avg = (sum / BigInt(this.avgTimeArray.length)) || 0n;
			Logger.silly(`${this.deviceId.string} Average time ${avg}`)
		} else {
			this.avgTimeArray.push(time);
		}
	}

	protected messageHandler(msg: ServiceMessage<TimeSyncData>): void {
		if (!msg?.message) {
			return
		}
		switch (msg.id) {
			case 1:
				this.sendTimeSyncQuery(msg.message.timestamp, msg.message.msgs.shift());
				break;
			case 2:
				Logger.silly(msg.message)
				//const localClock = msg.message.timestamp - msg.message.msgs[0]
				const remoteClock = msg.message.msgs[1] - this.remoteTime
				//Logger.silly(msg.deviceId.string, localClock, remoteClock, (localClock - remoteClock))
				this.timeAvg(remoteClock)
				break;
			default:
				break;
		}
	}

	protected instanceListener() { }
}
