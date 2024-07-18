#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { confirm, input } from '@inquirer/prompts'
import dedent from 'dedent'
import { $, cd, chalk, fs, minimist, spinner } from 'zx'

import { colors, styledPrompt } from './theme.js'
import { downloadAndExtractTemplate, formatTargetDir, isNodeError } from './utils.js'

type Args = {
  verbose?: boolean
}

const RISE_ASCII =
  '\r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\r\n\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2557  \r\n\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D  \r\n\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\r\n\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\r\n                           \r\n'

async function createRise() {
  const { verbose } = minimist<Args>(process.argv.slice(2))
  const { base, baseBold, highlight, error, errorBold, riseGradient } = colors

  const projectName = await input(
    styledPrompt({
      message: 'Project Name',
      default: 'rise-project',
    })
  )
  const installDeps = await confirm(
    styledPrompt({
      message: 'Would you like to install dependencies?',
      default: true,
    })
  )

  const template = '@rise-tools/template-react-navigation'

  // tbd: provide a bit more comprehensive name sanitisation
  const targetDir = formatTargetDir(projectName)

  const root = path.join(process.cwd(), targetDir)

  try {
    await fs.mkdir(root)
  } catch (e) {
    if (!isNodeError(e) || e.code !== 'EEXIST') {
      throw e
    }

    const overwrite = await confirm(
      styledPrompt({
        message: 'Target directory is not empty. Would you like to remove it and proceed?',
      })
    )

    if (!overwrite) {
      console.error(dedent`
        ${errorBold('🚨 There was an error setting up new Rise project:')}
        ${error(`The directory "${root}" already exists. Exiting...`)}
      `)
      return
    }
    await fs.rm(root, { recursive: true, force: true })
    await fs.mkdir(root)
  }

  await downloadAndExtractTemplate(root, template)
  await copyAdditionalTemplateFiles(root)

  const { dependencies, devDependencies, scripts, overrides } = await fs.readJSON(
    path.join(root, 'package.json'),
    'utf-8'
  )
  await fs.writeJSON(
    path.join(root, 'package.json'),
    {
      name: projectName,
      private: true,
      dependencies,
      devDependencies,
      scripts,
      overrides,
    },
    {
      spaces: 2,
    }
  )

  if (installDeps) {
    // tbd: offer an option to choose the package manager via options
    // maybe this is something we can share with the Community CLI?

    cd(root)

    console.log(base(`📦 Using ${highlight('npm')} to install packages.`))

    await spinner(
      base(`🔧 Installing dependencies in ${highlight(projectName)}`),
      () => $({ quiet: !verbose })`npm install`
    )
  }

  console.log(riseGradient(RISE_ASCII))

  console.log(
    [
      baseBold(`✅ The project has been successfully created !`),
      '',
      base('To run your project, navigate to the directory and run the following commands'),
      highlight(`cd ${projectName}`),
      ...(installDeps ? [highlight('npm install')] : []),
      highlight(`npm dev`),
    ].join('\n')
  )
}

async function copyAdditionalTemplateFiles(root: string) {
  const source = path.dirname(fileURLToPath(import.meta.url))

  await $`cp ${path.join(source, '../_gitignore')} ${path.join(root, '.gitignore')}`
}

createRise().catch((e) => {
  console.log(dedent`
    ${chalk.red.bold('🚨 There was an error setting up new Rise project.')}
    ${chalk.gray(e.stack)}

    If you believe this is a bug in Rise CLI, please open a new issue here:
    ${chalk.underline('https://github.com/rise-tools/rise-tools/issues/new')}
  `)
  process.exit(1)
})
