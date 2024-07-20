import { path } from 'zx'

import { cloudProjectConfig, CONFIG_DIR, CONFIG_FILE, projectConfig } from './utils.js'

export async function getTunnelUrl(): Promise<string> {
  return 'https://example-tunnel-url.com'
}

export const CONFIG_PATH = path.join(process.cwd(), CONFIG_DIR, CONFIG_FILE)

export async function connectTunnel() {
  try {
    const config = await projectConfig.read()
    const tunnelUrl = await getTunnelUrl()

    if (!config) {
      console.log('No config found. Creating a new project...')
      const newConfig = await cloudProjectConfig.create(tunnelUrl)
      await projectConfig.write(newConfig)

      console.log('New project created and config saved.')
    } else {
      console.log('Updating existing project...')
      await cloudProjectConfig.update(config.projectId, config.secret, tunnelUrl)
      console.log('Project updated successfully.')
    }

    console.log('Tunnel URL:', tunnelUrl)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}
