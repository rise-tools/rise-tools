import { DeviceId } from "../DeviceId";

interface ITrackData {
	source: {
		name: string;
		location: DeviceId;
		path: string;
	}
	ArtistName: string;
	Bleep: boolean;
	CuePosition: number;
	CurrentBPM: number;
	CurrentKeyIndex: number;
	CurrentLoopInPosition: number;
	CurrentLoopOutPosition: number;
	CurrentLoopSizeInBeats: number;
	KeyLock: boolean;
	LoopEnableState: boolean;
	Loop: {
		QuickLoop1: boolean;
		QuickLoop2: boolean;
		QuickLoop3: boolean;
		QuickLoop4: boolean;
		QuickLoop5: boolean;
		QuickLoop6: boolean;
		QuickLoop7: boolean;
		QuickLoop8: boolean;
	},
	PlayPauseLEDState: boolean;
	SampleRate: number;
	SongAnalyzed: boolean;
	SongLoaded: boolean;
	SongName: string;
	SoundSwitchGUID: string;
	TrackBytes: number;
	TrackData: boolean;
	TrackLength: number;
	TrackName: string;
	TrackNetworkPath: string;
	TrackURI: string;
	TrackWasPlayed: boolean;
}

export class Track implements Partial<ITrackData> {
	#prefix: string;
	#source: {
		name: string;
		location: DeviceId;
		path: string;
	} = null;

	ArtistName: string = ""
	CurrentBPM: number = 0;
	SampleRate: number = 0;
	SongAnalyzed: boolean = false;
	SongLoaded: boolean = false;
	SongName: string = "";
	SoundSwitchGUID: string = "";
	TrackBytes: number = 0;
	TrackLength: number = 0;
	TrackName: string = "";
	TrackNetworkPath: string = "";
	TrackURI: string = "";

	/**
	 * Track Type Class
	 * @constructor
	 * @param {string} prefix State prefix that should proceed the property
	 */
	constructor(prefix: string) {
		this.#prefix = prefix;
	}

	/**
	 * Get State Prefix
	 */
	get prefix() {
		return this.#prefix;
	}

	get source() {
		if (this.TrackNetworkPath) {
			const split = this.TrackNetworkPath.substring(6).split('/')
			const deviceId = new DeviceId(split.shift());
			const sourceName = split.shift();
			const path = `/${sourceName}/${split.join('/')}`
			this.#source = {
				name: sourceName,
				location: deviceId,
				path: path,
			}
		}
		return this.#source
	}
}



export interface TrackDBEntry {
	id: number,
	playOrder: number,
	length: number,
	bpm: number,
	year: number,
	path: string,
	filename: string,
	bitrate: number,
	bpmAnalyzed: number,
	albumArtId: number,
	fileBytes: number,
	title: string,
	artist: string,
	album: string,
	genre: string,
	comment: string,
	label: string,
	composer: string,
	remixer: string,
	key: number,
	rating: number,
	albumArt: string,
	timeLastPlayed: string,
	isPlayed: boolean,
	fileType: string,
	isAnalyzed: boolean,
	dateCreated: string,
	dateAdded: string,
	isAvailable: boolean,
	isMetadataOfPackedTrackChanged: boolean,
	isPerfomanceDataOfPackedTrackChanged: boolean,
	playedIndicator: number,
	isMetadataImported: boolean,
	pdbImportKey: number,
	streamingSource: string,
	uri: string,
	isBeatGridLocked: boolean,
	originDatabaseUuid: string,
	originTrackId: number,
	trackData: Buffer,
	overviewWaveFormData: Buffer,
	beatData: Buffer,
	quickCues: Buffer,
	loops: Buffer,
	thirdPartySourceId: number,
	streamingFlags: number,
	explicitLyrics: boolean,
	activeOnLoadLoops: number
}