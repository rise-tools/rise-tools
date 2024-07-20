import { promises as Stream, Readable } from 'node:stream'

import { text } from '@rise-tools/cli'
import * as tar from 'tar'
// @ts-ignore
import { $, spinner } from 'zx'

export function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, '')
}

export async function downloadAndExtractTemplate(root: string, packageName: string) {
  const response = await spinner(text('Downloading template'), async () => {
    const tarball = (await $({ quiet: true })`npm view ${packageName} dist.tarball`).stdout
    return fetch(tarball)
  })
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch the code for example from ${response.url}.`)
  }

  await Stream.pipeline([
    Readable.fromWeb(response.body),
    tar.extract(
      {
        cwd: root,
        // tbd: in the future, we should specify `fileTransformer` to automatically replace
        // projectName in all relevant files with the one specified by the user
        strip: 1,
      },
      ['package']
    ),
  ])
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return (error as NodeJS.ErrnoException).code !== undefined
}
