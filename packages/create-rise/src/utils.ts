import { promises as Stream, Readable } from 'node:stream'

import tar from 'tar'

export function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, '')
}

export const renameFiles: Record<string, string> = {
  _gitignore: '.gitignore',
}

/**
 * Inspired by Expo
 * https://github.com/expo/expo/blob/main/packages/create-expo/src/Examples.ts#L90
 */
export async function downloadAndExtractTemplate(root: string, name: string) {
  // tbd: We should have separate repository with examples to download less and list them dynamically
  const response = await fetch('https://codeload.github.com/rise-tools/rise-tools/tar.gz/master')
  if (!response.ok || !response.body) {
    throw new Error(
      'Failed to fetch the examples code from https://github.com/rise-tools/rise-tools'
    )
  }

  await Stream.pipeline([
    // @ts-expect-error see https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542
    Readable.fromWeb(response.body),
    tar.extract(
      {
        cwd: root,
        // tbd: We should specify `fileTransformer` to automatically replace projectName in all relevant
        // files with the one specified by the user
        strip: 2,
      },
      [`rise-tools/templates/${name}`]
    ),
  ])
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return (error as NodeJS.ErrnoException).code !== undefined
}
