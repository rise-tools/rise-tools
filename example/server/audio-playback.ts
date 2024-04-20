import { spawn } from 'child_process'

export type AudioPlayer = ReturnType<typeof playAudio>

export function playAudio(fullPath: string) {
  // SDL_AUDIODRIVER="alsa" AUDIODEV="hw:1,0" ffplay -autoexit eg-media/a029928608c961c20529d415196fd8689760f117bf4afaa96d97d547339e9828.mp3
  const audioPlayer = spawn(
    'ffplay',
    [
      '-autoexit',
      '-nodisp',
      //'eg-media/a029928608c961c20529d415196fd8689760f117bf4afaa96d97d547339e9828.mp3'
      fullPath,
    ],
    {
      env: {
        ...process.env,
        SDL_AUDIODRIVER: process.env.FFPLAY_SDL_AUDIODRIVER, // use 'alsa' on eclipse
        AUDIODEV: process.env.FFPLAY_AUDIODEV, // use 'hw:1,0' on eclipse
      },
    }
  )
  function stop() {
    audioPlayer.kill()
  }
  return { stop }
}
