import { spawn } from 'node:child_process'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'

import bs58 from 'bs58'
import findUp from 'find-up'
import internalIp from 'internal-ip'
import qr from 'qrcode-terminal'
import * as uuid from 'uuid'

import { fs } from './zx'

export async function getHost() {
  return internalIp.v4()
}

export async function generateQRCode(url: string) {
  return new Promise((resolve) => qr.generate(url, { small: true }, resolve))
}

export async function getConnectionInfo(path: string) {
  const packageJsonPath = await findUp('package.json')
  if (!packageJsonPath) {
    throw new Error('Could not find package.json. Are you in a project directory?')
  }

  const { name } = await fs.readJSON(packageJsonPath)
  return {
    label: name,
    id: name,
    path,
  }
}

export function getConnectionURL(
  connection: Awaited<ReturnType<typeof getConnectionInfo>>,
  host: string
) {
  const connectionInfo = bs58.encode(
    Buffer.from(
      JSON.stringify({
        ...connection,
        host,
      })
    )
  )
  return `rise://connect?connectInfo=${connectionInfo}`
}

export function clearTerminal() {
  process.stdout.write('\x1Bc')
}

export async function getProjectKey(): Promise<string> {
  const configDir = path.join(process.cwd(), '.rise')
  const configPath = path.join(configDir, 'projectKey')

  await fs.mkdirp(configDir)

  if (!(await fs.exists(configPath))) {
    const projectKey = uuid.v4()
    await fs.writeFile(configPath, projectKey, { encoding: 'utf-8' })
    return projectKey
  }
  return await fs.readFile(configPath, { encoding: 'utf-8' })
}

export async function startTunnel({ port, projectKey }: { port: number; projectKey: string }) {
  const session = spawn(
    'ssh',
    [
      '-o',
      'StrictHostKeyChecking no',
      '-p',
      '2222',
      '-R',
      `${projectKey}:80:localhost:${port}`,
      'proxy.rise.tools',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  )

  const timeoutPromise = setTimeout(5000).then(() => {
    throw new Error('timeout')
  })

  const sessionPromise = new Promise<string>((resolve) => {
    session.stdout.on('data', (data: Buffer) => {
      const match = data.toString().match(/(?:http:\/\/)([^\s]+)/)
      if (match) {
        resolve(match[1]!)
      }
    })
  })

  return Promise.race([sessionPromise, timeoutPromise])
}
