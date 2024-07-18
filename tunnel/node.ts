import axios from 'axios'
import path from 'path'
import { fs } from 'zx'

interface Config {
  projectId: string
  secret: string
}

const CONFIG_DIR = '.rise'
const CONFIG_FILE = 'cloud'
const CONFIG_PATH = path.join(process.cwd(), CONFIG_DIR, CONFIG_FILE)
const RISE_CLOUD_URL = 'https://tunnel.rise.tools'

async function readConfig(): Promise<Config | null> {
  return fs.readJsonSync(CONFIG_PATH)
}

async function writeConfig(config: Config): Promise<void> {
  fs.writeJsonSync(CONFIG_PATH, config)
}

async function getTunnelUrl(): Promise<string> {
  return 'https://example-tunnel-url.com'
}

async function createProject(tunnelUrl: string): Promise<Config> {
  const response = await axios.post(`${RISE_CLOUD_URL}/projects`, { url: tunnelUrl })
  return response.data
}

async function updateProject(projectId: string, secret: string, tunnelUrl: string): Promise<void> {
  await axios.post(
    `${RISE_CLOUD_URL}/projects/${projectId}`,
    { url: tunnelUrl },
    { headers: { Authorization: `Bearer ${secret}` } }
  )
}

async function main() {
  try {
    const config = await readConfig()
    const tunnelUrl = await getTunnelUrl()

    if (!config) {
      console.log('No config found. Creating a new project...')
      const newConfig = await createProject(tunnelUrl)
      await writeConfig(newConfig)
      console.log('New project created and config saved.')
    } else {
      console.log('Updating existing project...')
      await updateProject(config.projectId, config.secret, tunnelUrl)
      console.log('Project updated successfully.')
    }

    console.log('Tunnel URL:', tunnelUrl)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

main()
