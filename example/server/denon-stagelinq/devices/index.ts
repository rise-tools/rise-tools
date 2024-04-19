import { EventEmitter } from 'events';
import { Logger } from '../LogEmitter';
import { Service } from '../services';
import { ConnectionInfo, DeviceId, Units } from '../types';
import { sleep } from '../utils';
import { StageLinq } from '../StageLinq';


function isStageLinqDevice(info: ConnectionInfo): boolean {
	return !!Units[info.software.name]
}

function isMixer(info: ConnectionInfo): boolean {
	return Units[info.software.name]?.type === "MIXER"
}

function portHasChanged(incoming: ConnectionInfo, current: ConnectionInfo): boolean {
	return incoming.port !== current?.port
}

export declare interface Devices {
	on(event: 'newDevice', listener: (device: Device) => void): this;
	on(event: 'newService', listener: (device: Device, service: InstanceType<typeof Service>) => void): this;
}

export class Devices extends EventEmitter {
	#devices: Map<string, Device> = new Map();


	constructor() {
		super()
		this.initListeners()
	}

	private async initListeners() {
		// while (!StageLinq && !StageLinq.discovery) {
		//   await sleep(100);
		// }
		await sleep(250);
		StageLinq.discovery.addListener('discoveryDevice', (info: ConnectionInfo) => this.deviceListener(info))
		while (!StageLinq.directory) {
			await sleep(250);
		}
		StageLinq.directory.addListener('newService', (service) => this.serviceListener(service))
	}

	private serviceListener(service: InstanceType<typeof Service>) {
		this.addService(service.deviceId, service)
		service.addListener('closingService', (service) => this.deleteService(service.deviceId, service.name))
	}

	private deviceListener(info: ConnectionInfo) {
		const currentDevice = this.#devices.get(info.deviceId.string)

		if ((!this.#devices.has(info.deviceId.string) || portHasChanged(info, currentDevice?.info))
			&& isStageLinqDevice(info)
			&& !isMixer(info)
		) {

			Logger.debug(`Setting New Device! ${info.deviceId.string} ${info.software.name}`)
			const device = new Device(info)
			this.#devices.set(info.deviceId.string, device)
			this.emit('newDevice', device)
		}
	}



	/**
	 *
	 * @param {DeviceId} deviceId
	 * @returns {Promise<Device>}
	 */
	async getDevice(deviceId: DeviceId): Promise<Device> {
		while (!this.hasDevice(deviceId)) {
			await sleep(150);
		}
		return this.#devices.get(deviceId.string)
	}

	/**
	 *
	 * @param {DeviceId} deviceId
	 * @returns {Device}
	 */
	device(deviceId: DeviceId): Device {
		return this.#devices.get(deviceId.string)
	}

	/**
	 *
	 * @param {DeviceId} deviceId
	 * @returns {boolean}
	 */
	hasDevice(deviceId: DeviceId): boolean {
		return this.#devices.has(deviceId.string)
	}

	/**
	 * Get an array of all current Service Instances
	 * @returns {Promise<InstanceType<typeof Service>[]>}
	 */
	async getDeviceServices(): Promise<InstanceType<typeof Service>[]> {
		return [...this.#devices.values()].flatMap(device => device.getServices())
	}

	/**
	 *
	 * @param {DeviceId} deviceId
	 * @param {Service} service
	 */
	private addService(deviceId: DeviceId, service: InstanceType<typeof Service>) {
		const device = this.device(deviceId)
		device.addService(service)
	}

	/**
	 *
	 * @param {DeviceId} deviceId
	 * @param {string} serviceName
	 */
	private deleteService(deviceId: DeviceId, serviceName: string) {
		const device = this.device(deviceId);
		device.deleteService(serviceName)
	}



}

export class Device {
	readonly deviceId: DeviceId;
	info: ConnectionInfo;
	#services: Map<string, InstanceType<typeof Service>> = new Map();

	/**
	 * @constructor
	 * @param {connectionInfo} info
	 */
	constructor(info: ConnectionInfo) {
		this.deviceId = info.deviceId;
		this.info = info;
	}

	/**
	 * Get # of decks on this device
	 * @returns {number}
	 */
	deckCount(): number {
		return this.info.unit.decks
	}

	/**
	 * Get a service instance by name
	 * @param {string} serviceName
	 * @returns {InstanceType<typeof Service>}
	 */
	service(serviceName: string): InstanceType<typeof Service> {
		return this.#services.get(serviceName)
	}

	/**
	 * Check if Device has Service
	 * @param {string} serviceName
	 * @returns {boolean}
	 */
	hasService(serviceName: string): boolean {
		return this.#services.has(serviceName)
	}

	/**
	 * Get an Array of names of all current Services on this Device
	 * @returns {string[]}
	 */
	getServiceNames(): string[] {
		return [...this.#services.keys()]
	}

	/**
	 * Get an Array of all current Services on this Device
	 * @returns {InstanceType<typeof Service>[]}
	 */
	getServices(): InstanceType<typeof Service>[] {
		return [...this.#services.values()]
	}

	/**
	 * Add an instantiated Service
	 * @param {Service} service
	 */

	addService(service: InstanceType<typeof Service>) {
		this.#services.set(service.name, service)
	}

	/**
	 * Remove a service
	 * @param {string} serviceName
	 */
	deleteService(serviceName: string) {
		this.#services.delete(serviceName)
	}
}