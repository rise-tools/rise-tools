import { readFile, writeFile } from 'fs-extra'
import { join } from 'path'

export type DBFile = {
  title: string
  durationInSeconds: number
  completeTime: number
  videoName: string
  filePath: string
  fileSha256: string
  width: number
  height: number
  audioFile: string | null
  egFramesFile: string
  importerVersion: number
}

export type DBState = {
  files: DBFile[]
}

export function getDbPath(mediaDir: string) {
  return join(mediaDir, 'index.json')
}

const initState: DBState = {
  files: [],
}

export async function readDb(outputDir: string): Promise<DBState> {
  const dbPath = join(outputDir, 'index.json')
  let dbState = initState
  try {
    const rawFile = await readFile(dbPath, 'utf8')
    const jsonFile = JSON.parse(rawFile)
    dbState = jsonFile
  } catch (e) {
    // console.warn('Failed to read db file', e)
  }
  return dbState
}

export async function updateDb(outputDir: string, updater: (state: DBState) => DBState) {
  const dbPath = join(outputDir, 'index.json')
  const prevState = await readDb(outputDir)
  const newState = updater(prevState)
  await writeFile(dbPath, JSON.stringify(newState, null, 2))
}
