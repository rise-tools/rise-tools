import { version } from '../package.json';
import { DeviceId } from './DeviceId';
//import * as Services from '../services'

export interface DiscoveryMessageOptions {
	name: string;
	version: string;
	source: string;
	deviceId: DeviceId;
	port?: number
};

export interface StageLinqOptions {
	maxRetries?: number;
	actingAs?: DiscoveryMessageOptions;
	downloadDbSources?: boolean;
	services?: Services[];
	connectToMixer?: boolean
}

export enum Services {
	StateMap = "StateMap",
	FileTransfer = "FileTransfer",
	BeatInfo = "BeatInfo",
	Broadcast = "Broadcast",
	TimeSynchronization = "TimeSynchronization",
	Directory = "Directory",
}

const Tokens = {
	SoundSwitch: new Uint8Array([82, 253, 252, 7, 33, 130, 101, 79, 22, 63, 95, 15, 154, 98, 29, 114]),
	Sc6000_1: new Uint8Array([130, 139, 235, 2, 218, 31, 78, 104, 166, 175, 176, 177, 103, 234, 240, 162]),
	Sc6000_2: new Uint8Array([38, 210, 56, 103, 28, 214, 78, 63, 128, 161, 17, 130, 106, 196, 17, 32]),
	Resolume: new Uint8Array([136, 250, 32, 153, 172, 122, 79, 63, 188, 22, 169, 149, 219, 218, 42, 66]),
	Listen: new Uint8Array([255, 255, 255, 255, 255, 255, 74, 28, 155, 186, 136, 180, 190, 25, 163, 209])
}

export const ActingAsDevice: { [name: string]: DiscoveryMessageOptions } = {

	StageLinqJS: {
		name: 'stagelinqjs',
		version: version,
		source: 'SLJS',
		deviceId: new DeviceId(Tokens.Listen)
	},

	NowPlaying: {
		name: 'nowplaying',
		version: '2.2.0',
		source: 'np2',
		deviceId: new DeviceId(Tokens.Listen)
	},

	Sc6000_1: {
		name: 'sc6000',
		version: '2.3.1',
		source: 'JP13',
		deviceId: new DeviceId(Tokens.Sc6000_1)
	},

	Sc6000_2: {
		name: 'sc6000',
		version: '2.3.1',
		source: 'JP13',
		deviceId: new DeviceId(Tokens.Sc6000_2)
	},

	Resolume: {
		name: 'resolume',
		version: '10.0.0',
		source: 'res',
		deviceId: new DeviceId(Tokens.Resolume)
	}

}