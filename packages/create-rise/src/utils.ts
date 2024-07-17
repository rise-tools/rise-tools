import { promises as Stream, Readable } from 'node:stream'

import * as tar from 'tar'
import { $, spinner } from 'zx'

export function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, '')
}

export async function downloadAndExtractTemplate(root: string, packageName: string) {
  const tarball = (await $`npm view ${packageName} dist.tarball`).stdout

  const response = await spinner('Downloading template', () => fetch(tarball))
  if (!response.ok || !response.body) {
    throw new Error('Failed to fetch the code for example from ${tarball}.')
  }

  await Stream.pipeline([
    // @ts-expect-error see https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542
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
