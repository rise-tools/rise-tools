import { Discovery } from '../Discovery';
import { Logger } from '../LogEmitter';
import { ActingAsDevice, StageLinqOptions, DeviceId } from '../types';
import { Devices } from '../devices'
import { Sources } from '../Sources';
import { Service, Directory } from '../services';
import { Status } from '../status';


const DEFAULT_OPTIONS: StageLinqOptions = {
	actingAs: ActingAsDevice.StageLinqJS,
	downloadDbSources: true,
};

/**
 * Main StageLinq static class.
 */
export class StageLinq {
	static options: StageLinqOptions = DEFAULT_OPTIONS;
	static readonly logger: Logger = Logger.instance;
	static readonly discovery: Discovery = new Discovery();
	static readonly devices = new Devices();
	static readonly sources: Sources = new Sources();
	static readonly status: Status = new Status();
	static directory: Directory = null;


	/**
	 * Service Constructor Factory Function
	 * @param {Service<T>} Service
	 * @param {DeviceId} [deviceId]
	 * @returns {Promise<Service<T>>}
	 */
	static async startServiceListener<T extends InstanceType<typeof Service>>(ctor: {
		new(_deviceId?: DeviceId): T;
	}, deviceId?: DeviceId): Promise<T> {
		const service = new ctor(deviceId);

		await service.start();
		return service;
	}

	/**
	 * Connect to the StageLinq network.
	 */
	static async connect() {
		//  Initialize Discovery agent
		StageLinq.discovery.listen(StageLinq.options.actingAs);

		//Directory is required
		StageLinq.directory = await StageLinq.startServiceListener(Directory);

		//  Announce myself with Directory port
		await StageLinq.discovery.announce(StageLinq.directory.serverInfo.port);
	}

	/**
	 * Disconnect from the StageLinq network.
	 * Close all open Servers
	 */
	static async disconnect() {
		try {
			Logger.warn('disconnecting');
			await this.directory.stop();
			const services = await StageLinq.devices.getDeviceServices();
			for (const service of services) {
				console.log(`closing ${service.name} on ${service.deviceId.string}`);
				await service.stop()
			}
			await StageLinq.discovery.unannounce();
		} catch (e) {
			throw new Error(e);
		}
	}
}