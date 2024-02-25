import { EventEmitter } from 'events';
import { StageLinq } from '../StageLinq';
import { StateData, StateMap } from '../services';
import { Track, DeviceId } from '../types';


export class Status extends EventEmitter {
	private tracks: Map<string, Track> = new Map();

	/**
	 * Status EndPoint Class
	 */

	/**
	 * Get Track Info from Status
	 * @param {DeviceId} deviceId DeviceId of the player
	 * @param {deck} deck Deck (layer) number
	 * @returns {TrackData}
	 */
	getTrack(deviceId: DeviceId, deck: number): Track {
		return this.tracks.get(`{${deviceId.string}},${deck}`);
	}

	/**
	 * Add a Deck for Status to monitor
	 * @param {StateMap} service // Instance of StateMap Service
	 * @param {number} deck Deck (layer) number
	 */
	async addDeck(service: StateMap, deck: number) {
		let track = new Track(`/Engine/Deck${deck}/Track/`)
		this.tracks.set(`{${service.deviceId.string}},${deck}`, track)
		for (let item of Object.keys(track)) {
			service.addListener(`${track.prefix}${item}`, data => this.listener(data, this))
		}
	}

	async addDecks(service: StateMap) {
		for (let i = 1; i <= StageLinq.devices.device(service.deviceId).deckCount(); i++) {
			this.addDeck(service, i);
		}
	}

	private listener(data: StateData, status: Status) {
		const deck = parseInt(data.name.substring(12, 13))
		const property = data.name.split('/').pop()
		const value = this.getTypedValue(data);
		const track = status.tracks.get(`{${data.deviceId.string}},${deck}`)
		this.tracks.set(`{${data.deviceId.string}},${deck}`, Object.assign(track, { [property]: value }));
	}

	private getTypedValue(data: StateData): boolean | string | number {
		if (data.json.state) {
			return data.json.state as boolean
		}
		if (data.json.string) {
			return data.json.string as string
		}
		if (data.json.value) {
			return data.json.value as number
		}
	}
}