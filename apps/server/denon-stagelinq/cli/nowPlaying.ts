import { ActingAsDevice, StageLinqOptions, Services, DeviceId } from '../types';
import { StateData, StateMap } from '../services';
import { sleep } from '../utils/sleep';
import { StageLinq } from '../StageLinq';
import * as fs from 'fs';
import * as os from 'os';
import * as Path from 'path';


async function main() {

	const stageLinqOptions: StageLinqOptions = {
		downloadDbSources: true,
		actingAs: ActingAsDevice.NowPlaying,
		services: [
			Services.StateMap,
			Services.FileTransfer,
		],
	}

	//const stageLinq = new StageLinq(stageLinqOptions);
	StageLinq.options = stageLinqOptions

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
			console.log(`Downloaded ${path}`)
		} catch (e) {
			console.error(`Could not download ${path}`);
			console.error(e)
		}
	}

	async function deckIsMaster(data: StateData) {
		if (data.json.state) {
			const deck = parseInt(data.name.substring(12, 13))
			await sleep(250);
			const track = StageLinq.status.getTrack(data.deviceId, deck)

			if (StageLinq.options.downloadDbSources) {
				downloadFile(track.source.name, track.source.location, track.source.path, Path.resolve(os.tmpdir()));
			}

			console.log(`Now Playing: `, track) //Or however you consume it
		}
	}


	StateMap.emitter.on('newDevice', async (service: StateMap) => {

		for (let i = 1; i <= service.device.deckCount(); i++) {
			service.addListener(`/Engine/Deck${i}/DeckIsMaster`, deckIsMaster);
		}

		service.subscribe();
	});

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