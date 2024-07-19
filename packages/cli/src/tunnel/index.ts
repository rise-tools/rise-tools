import { path } from 'zx'

import { CONFIG_DIR, CONFIG_FILE } from './constants.js'
import { createProject, readConfig, updateProject, writeConfig } from './utils.js'

export async function getTunnelUrl(): Promise<string> {
  return 'https://example-tunnel-url.com'
}

export const CONFIG_PATH = path.join(process.cwd(), CONFIG_DIR, CONFIG_FILE)

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
