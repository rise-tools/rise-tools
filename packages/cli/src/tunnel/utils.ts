import { fetch, fs, path } from 'zx'

export interface Config {
  projectId: string
  secret: string
}

export const CONFIG_DIR = '.rise'
export const CONFIG_FILE = 'cloud'
export const CONFIG_PATH = path.join(CONFIG_DIR, CONFIG_FILE)

export const RISE_CLOUD_URL = 'https://tunnel.rise.tools'

export const projectConfig = {
  async read(): Promise<Config | null> {
    try {
      return await fs.readJson(CONFIG_PATH, 'utf-8')
    } catch (error) {
      return null
    }
  },
  async write(config: Config): Promise<void> {
    await fs.mkdir(CONFIG_DIR, { recursive: true })
    await fs.writeJson(CONFIG_PATH, config)
  },
}

export const cloudProjectConfig = {
  async create(tunnelUrl: string): Promise<Config> {
    return await fetchProject('projects', { tunnelUrl })
  },
  async update(projectId: string, secret: string, tunnelUrl: string): Promise<void> {
    return await fetchProject(`projects/${projectId}`, { tunnelUrl, secret })
  },
}

type FetchProjectOptions = {
  tunnelUrl: string
  secret?: string
}

export async function fetchProject(
  url: string,
  { tunnelUrl, secret }: FetchProjectOptions
): Promise<any> {
  const response = await fetch(`${RISE_CLOUD_URL}/${url}`, {
    method: 'POST',
    body: JSON.stringify({ url: tunnelUrl }),
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
  })
  return response.json()
}
