# StageLinqJS  - A Robust Implementation of StageLinq Library

## Description
This branch implements the methods demonstrated previously in the StageLinq Listener branch.
Rather than searching out devices via discovery, we are able to have devices initiate connections to the library. As demonstrated, this approach:
* Greatly reduces complexity. 

* Speeds up the connection & initialization process (almost every sleep() call has been eliminated without and affect thus far).

* Handles disconnection and reconnection of devices gracefully and simply.

* Allows connections from devices we couldn't use previously (i.e. x1800/x1850 mixers).

## Notes on Terminilogy

An effort has been made to standardize the syntax used in the library, and to be consitent with the syntax Denon uses (when they have, in fact, been consistent themselves).

### Physical & Network
| Syntax | Description | Example |
| --- | --- | --- |
| Unit | A discrete physical player, controller, or mixer | SC600, PRIME4, X1850 |
| Device | A unique StageLinq network entity, represented by a DeviceId | _See DeviceId_
| Service | An instance of a particular Service endpoint | StateMap, FileTransfer, BeatInfo |
| DeviceId | The GUID representing a StageLinq Device. | 12345678-1234-1234-1234-123456789ABC |

### Software & States
| Syntax | Description | Example |
| --- | --- | --- |
| Deck (1..4) | A singular music-playing instance on a Unit | An SC5000 has 2 Decks, A PRIME4 has 4 Decks |
| Layer (A..B) | For switching between two Decks on a Unit | Layer A is Deck 1, Layer B is Deck 2 |
| Track | A music file loaded on a Deck | |
| Song | Sometimes used interchangabley with Track in some State names | |




## Implementing Selected Services
We can choose which services to implement by including them in the `StageLinqOptions` parameter passed to Stagelinq on initialization. 
```ts 
const stageLinqOptions: StageLinqOptions = {
  downloadDbSources: true,
  actingAs: ActingAsDevice.StageLinqJS,
  services: [
    Services.StateMap,
    Services.BeatInfo,
    Services.FileTransfer,
  ],
}
```

## Starting StageLinq

The main StageLinq class is now a Static Class:
```ts
StageLinq.options = stageLinqOptions;

await StageLinq.connect();
await StageLinq.disconnect();
```


## Discovery
Discovery emits a number of messages which may be helpful when debugging.

```ts
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
```

`updatedDiscoveryDevice` is emitted when a Device is broadcasting a new Directory port, which is indicative of a reset. The Device should automatically reconnect without any action required from the user.

Discovery offers a few methods for getting ConnectionInfos for Devices on the network:
```ts
/**
 * Get ConnectionInfo
 * @param {DeviceId} deviceId 
 * @returns {ConnectionInfo}
 */
public getConnectionInfo(deviceId: DeviceId): ConnectionInfo {
    return this.peers.get(deviceId.string);
}

/**
 * Get list of devices
 * @returns {string[]} An array of DeviceId strings
 */
public getDeviceList(): string[] {
    return [...this.peers.keys()]
}

/**
 * Get array of device ConnectionInfos
 * @returns {ConnectionInfo[]} An array of ConnectionInfos
 */
public getDevices(): ConnectionInfo[] {
    return [...this.peers.values()]
}
```



## StateMap


```ts
StateMap.emitter.on('newDevice', (service: StateMapDevice) => {
    console.log(`[STATEMAP] Subscribing to States on ${service.deviceId.string}`);
    service.subscribe();
});

StateMap.emitter.on('stateMessage', async (data: StateData) => {
    console.log(`[STATEMAP] ${data.deviceId.string} ${data.name} => ${JSON.stringify(data.json)}`);
  });
```

### Using NowPlaying-type updates from StageLinq.status

```ts
async function deckIsMaster(data: StateData) {
  if (data.json.state) {
    const deck = parseInt(data.name.substring(12, 13))
    await sleep(250);
    const track = stageLinq.status.getTrack(data.deviceId, deck)
    console.log(`Now Playing: `, track)
  }
}

async function songLoaded(data: StateData) {
  if (data.json.state) {
    const deck = parseInt(data.name.substring(12, 13))
    await sleep(250);
    const track = stageLinq.status.getTrack(data.deviceId, deck)
    console.log(`Track Loaded: `, track)
    if (stageLinq.fileTransfer && stageLinq.options.downloadDbSources) {
      const trackInfo = await getTrackInfo(stageLinq, track.source.name, track.source.location, track.TrackNetworkPath);
      console.log('Track DB Info: ', trackInfo)
      downloadFile(stageLinq, track.source.name, track.source.location, track.source.path, Path.resolve(os.tmpdir()));
    }
  }
}

StateMap.emitter,on('newDevice', async (service: StateMapDevice) => {
  console.log(`[STATEMAP] Subscribing to States on ${service.deviceId.string}`);

  const info = StageLinq.devices.device(service.deviceId).info
  for (let i = 1; i <= info.unit.decks; i++) {
    service.addListener(`/Engine/Deck${i}/DeckIsMaster`, deckIsMaster);
    service.addListener(`/Engine/Deck${i}/Track/SongLoaded`, songLoaded);
  }
  service.subscribe();
});
```

## FileTransfer & Sources

```ts
FileTransfer.emitter.on('fileTransferProgress', (source, file, txid, progress) => {
  console.log(`[FILETRANSFER] ${source.name} id:{${txid}} Reading ${file}: ${progressBar(10, progress.bytesDownloaded, progress.total)} (${Math.ceil(progress.percentComplete)}%)`);
});

FileTransfer.emitter.on('fileTransferComplete', (source, file, txid) => {
  console.log(`[FILETRANSFER] Complete ${source.name} id:{${txid}} ${file}`);
});

StageLing.sources.on('newSource', (source: Source) => {
  console.log(`[FILETRANSFER] Source Available: (${source.name})`);
});

StageLing.sources.on('sourceRemoved', (sourceName: string, deviceId: DeviceId) => {
  console.log(`[FILETRANSFER] Source Removed: ${sourceName} on ${deviceId.string}`);
});

StageLing.sources.on('dbDownloaded', (source: Source) => {
  console.log(`[FILETRANSFER] Database Downloaded: (${source.name})`);
});
```

## BeatInfo

```ts
const beatOptions = {
  // Resolution for triggering callback
  //    0 = every message WARNING, it's a lot!
  //    1 = every beat 
  //    4 = every 4 beats 
  //    .25 = every 1/4 beat
  everyNBeats: 1,
}

//  User callback function. 
//  Will be triggered everytime a player's beat counter crosses the resolution threshold
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


BeatInfo.emitter.on('newBeatInfoDevice', async (beatInfo: BeatInfo) => {
  console.log(`[BEATINFO] New Device ${beatInfo.deviceId.string}`)

  if (beatMethod.useCallback) {
    beatInfo.startBeatInfo(beatOptions, beatCallback);
  }

  if (beatMethod.useEvent) {
    beatInfo.startBeatInfo(beatOptions);
    BeatInfo.emitter.on('beatMsg', (bd) => {
      if (bd.message) {
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

```


## Additional Notes on the Listener Method

* The Directory service is the only one which is *required* as it is the initial connection endpoint for remote devices.

* Only tokens of a specific structure seem to work, otherwise devices won't initiate a connection. One requirement *seems* to be that they start with `0xFFFFFFFFFFFF`, but some more research into this is needed.