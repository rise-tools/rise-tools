import { fetch, fs } from 'zx'

import { CONFIG_DIR, CONFIG_PATH, RISE_CLOUD_URL } from './constants.js'
import { Config } from './types.js'

export async function readConfig(): Promise<Config | null> {
  try {
    return await fs.readJson(CONFIG_PATH, 'utf-8')
  } catch (error) {
    return null
  }
}

export async function writeConfig(config: Config): Promise<void> {
  await fs.mkdir(CONFIG_DIR, { recursive: true })
  await fs.writeJson(CONFIG_PATH, config)
}

export async function createProject(tunnelUrl: string): Promise<Config> {
  const response = await fetch(`${RISE_CLOUD_URL}/projects`, {
    method: 'POST',
    body: JSON.stringify({ url: tunnelUrl }),
    headers: { 'Content-Type': 'application/json' },
  })
  return response.json()
}

export async function updateProject(
  projectId: string,
  secret: string,
  tunnelUrl: string
): Promise<void> {
  await fetch(`${RISE_CLOUD_URL}/projects/${projectId}`, {
    method: 'POST',
    body: JSON.stringify({ url: tunnelUrl }),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
  })
}
