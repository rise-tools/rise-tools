import { ActingAsDevice, StageLinqOptions, Services, DeviceId } from '../types';
import { StateData, StateMap, BeatData, BeatInfo, FileTransfer, Broadcast } from '../services';
import { Source } from '../Sources'
import { sleep } from '../utils/sleep';
import { StageLinq } from '../StageLinq';
import { Logger } from '../LogEmitter';
import * as fs from 'fs';
import * as os from 'os';
import * as Path from 'path';

require('console-stamp')(console, {
	format: ':date(HH:MM:ss) :label',
});

function progressBar(size: number, bytes: number, total: number): string {
	const progress = Math.ceil((bytes / total) * 10)
	let progressArrary = new Array<string>(size);
	progressArrary.fill(' ');
	if (progress) {
		for (let i = 0; i < progress; i++) {
			progressArrary[i] = '|'
		}
	}
	return `[${progressArrary.join('')}]`
}

// async function getTrackInfo(sourceName: string, deviceId: DeviceId, trackName: string) {
//   while (!StageLinq.sources.hasSourceAndDB(sourceName, deviceId)) {
//     await sleep(1000);
//   }
//   try {
//     const source = StageLinq.sources.getSource(sourceName, deviceId);
//     const connection = source.getDatabase().connection;
//     const result = await connection.getTrackInfo(trackName);
//     connection.close();
//     return result;
//   } catch (e) {
//     console.error(e);
//   }
// }

async function downloadFile(sourceName: string, deviceId: DeviceId, path: string, dest?: string) {
	while (!StageLinq.sources.hasSource(sourceName, deviceId)) {
		await sleep(250)
	}
	try {
		const source = StageLinq.sources.getSource(sourceName, deviceId);
		const data = await StageLinq.sources.downloadFile(source, path);
		if (dest && data) {
			const filePath = `${dest}/${path.split('/').pop()}`
			fs.writeFileSync(filePath, Buffer.from(data));
		}
	} catch (e) {
		console.error(`Could not download ${path}`);
		console.error(e)
	}
}


async function main() {

	console.log('Starting CLI');

	const stageLinqOptions: StageLinqOptions = {
		downloadDbSources: true,
		actingAs: ActingAsDevice.StageLinqJS,
		services: [
			Services.StateMap,
			Services.FileTransfer,
			Services.BeatInfo,
			Services.Broadcast,
		],
	}

	StageLinq.options = stageLinqOptions;

	StageLinq.logger.on('error', (...args: any) => {
		console.error(...args);
	});
	StageLinq.logger.on('warn', (...args: any) => {
		console.warn(...args);
		args.push("\n");
	});
	StageLinq.logger.on('info', (...args: any) => {
		console.info(...args);
		args.push("\n");
	});
	StageLinq.logger.on('log', (...args: any) => {
		console.log(...args);
		args.push("\n");
	});
	// StageLinq.logger.on('debug', (...args: any) => {
	//   console.debug(...args);
	//   args.push("\n");
	// });
	//Note: Silly is very verbose!
	// stageLinq.logger.on('silly', (...args: any) => {
	//   console.debug(...args);
	// });


	StageLinq.discovery.on('listening', () => {
		console.log(`[DISCOVERY] Listening`)
	});

	StageLinq.discovery.on('announcing', (info) => {
		console.log(`[DISCOVERY] Broadcasting Announce ${info.deviceId.string} Port ${info.port} ${info.source} ${info.software.name}:${info.software.version}`)
	});

	StageLinq.discovery.on('newDiscoveryDevice', (info) => {
		console.log(`[DISCOVERY] New Device ${info.deviceId.string} ${info.source} ${info.software.name} ${info.software.version}`)
	});

	StageLinq.discovery.on('updatedDiscoveryDevice', (info) => {
		console.log(`[DISCOVERY] Updated Device ${info.deviceId.string} Port:${info.port} ${info.source} ${info.software.name} ${info.software.version}`)
	});


	StageLinq.devices.on('newDevice', (device) => {
		console.log(`[DEVICES] New Device ${device.deviceId.string}`)
	});

	StageLinq.devices.on('newService', (device, service) => {
		console.log(`[DEVICES] New ${service.name} Service on ${device.deviceId.string} port ${service.serverInfo.port}`)
	});


	if (stageLinqOptions.services.includes(Services.Broadcast)) {

		Broadcast.emitter.on('message', async (deviceId: DeviceId, name: string, value) => {
			console.log(`[BROADCAST] ${deviceId.string} ${name}`, value);
			const db = StageLinq.sources.getDBByUuid(value.databaseUuid);
			if (db.length) {
				const connection = db[0].connection();
				const track = await connection.getTrackById(value.trackId);
				connection.close();
				console.log('[BROADCAST] Track Changed:', track);
			}
		})

	}


	if (stageLinqOptions.services.includes(Services.StateMap)) {

		async function deckIsMaster(data: StateData) {
			if (data.json.state) {
				const deck = parseInt(data.name.substring(12, 13));
				await sleep(250);
				const track = StageLinq.status.getTrack(data.deviceId, deck);
				console.log(`Now Playing: `, track);
				if (stageLinqOptions.services.includes(Services.FileTransfer) && StageLinq.options.downloadDbSources) {
					downloadFile(track.source.name, track.source.location, track.source.path, Path.resolve(os.tmpdir()));
				}
			}
		}


		StateMap.emitter.on('newDevice', async (service: StateMap) => {
			console.log(`[STATEMAP] Subscribing to States on ${service.deviceId.string}`);

			for (let i = 1; i <= service.device.deckCount(); i++) {
				service.addListener(`/Engine/Deck${i}/DeckIsMaster`, deckIsMaster);
			}

			service.subscribe();
		});

		StateMap.emitter.on('stateMessage', async (data: StateData) => {
			Logger.info(`[STATEMAP] ${data.deviceId.string} ${data.name} => ${JSON.stringify(data.json)}`);
		});

	}


	if (stageLinqOptions.services.includes(Services.FileTransfer)) {


		FileTransfer.emitter.on('fileTransferProgress', (source, file, txid, progress) => {
			Logger.debug(`[FILETRANSFER] ${source.name} id:{${txid}} Reading ${file}: ${progressBar(10, progress.bytesDownloaded, progress.total)} (${Math.ceil(progress.percentComplete)}%)`);
		});

		FileTransfer.emitter.on('fileTransferComplete', (source, file, txid) => {
			console.log(`[FILETRANSFER] Complete ${source.name} id:{${txid}} ${file}`);
		});

		StageLinq.sources.on('newSource', (source: Source) => {
			console.log(`[SOURCES] Source Available: (${source.name})`);
		});

		StageLinq.sources.on('dbDownloaded', (source: Source) => {
			console.log(`[SOURCES] Database Downloaded: (${source.name})`);
		});

		StageLinq.sources.on('sourceRemoved', (sourceName: string, deviceId: DeviceId) => {
			console.log(`[SOURCES] Source Removed: ${sourceName} on ${deviceId.string}`);
		});

	}


	if (stageLinqOptions.services.includes(Services.BeatInfo)) {

		/**
		 * Resolution for triggering callback
		 *    0 = every message WARNING, it's a lot!
		 *    1 = every beat
		 *    4 = every 4 beats
		 *    .25 = every 1/4 beat
		 */
		const beatOptions = {
			everyNBeats: 1,
		}

		/**
		 *  User callback function.
		 *  Will be triggered everytime a player's beat counter crosses the resolution threshold
		 * @param {BeatData} bd
		 */
		function beatCallback(bd: BeatData,) {
			let deckBeatString = ""
			for (let i = 0; i < bd.deckCount; i++) {
				deckBeatString += `Deck: ${i + 1} Beat: ${bd.deck[i].beat.toFixed(3)}/${bd.deck[i].totalBeats.toFixed(0)} `
			}
			console.log(`[BEATINFO] ${bd.deviceId.string} clock: ${bd.clock} ${deckBeatString}`);
		}

		////  callback is optional, BeatInfo messages can be consumed by:
		//      - user callback
		//      - event messages
		//      - reading the register
		const beatMethod = {
			useCallback: true,
			useEvent: false,
			useRegister: false,
		};

		BeatInfo.emitter.on('newDevice', async (beatInfo: BeatInfo) => {
			console.log(`[BEATINFO] New Device ${beatInfo.deviceId.string}`)

			if (beatMethod.useCallback) {
				beatInfo.startBeatInfo(beatOptions, beatCallback);
			}

			if (beatMethod.useEvent) {
				beatInfo.startBeatInfo(beatOptions);
				BeatInfo.emitter.on('beatMessage', (bd) => {

					if (bd) {
						beatCallback(bd);
					}
				});
			}

			if (beatMethod.useRegister) {
				beatInfo.startBeatInfo(beatOptions);

				function beatFunc(beatInfo: BeatInfo) {
					const beatData = beatInfo.getBeatData();
					if (beatData) beatCallback(beatData);
				}

				setTimeout(beatFunc, 4000, beatInfo)
			}

		})
	}


	/////////////////////////////////////////////////////////////////////////
	// CLI

	let returnCode = 0;
	try {
		process.on('SIGINT', async function () {
			console.info('... exiting');

			try {
				await StageLinq.disconnect();
			} catch (err: any) {
				const message = err.stack.toString();
				console.error(message);
			}
			process.exit(returnCode);
		});

		await StageLinq.connect();

		while (true) {
			await sleep(250);
		}

	} catch (err: any) {
		const message = err.stack.toString();
		console.error(message);
		returnCode = 1;
	}

	await StageLinq.disconnect();
	process.exit(returnCode);
}

main();
