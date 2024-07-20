#!/usr/bin/env node

import path from 'node:path'

import { ExitPromptError } from '@inquirer/core'
import { confirm, input } from '@inquirer/prompts'
import { bold, debug, error, highlight, link, logo, prompt, text } from '@rise-tools/cli'
import dedent from 'dedent'
// @ts-ignore
import { $, cd, fs, minimist, spinner } from 'zx'

import { downloadAndExtractTemplate, formatTargetDir, isNodeError } from './utils'

type Options = {
  verbose: boolean
  install: boolean
  help: boolean
  yes: boolean
}

const DEFAULT_PROJECT_NAME = 'rise-project'

async function createRise(opts: Options) {
  console.log(logo())

  let projectName = DEFAULT_PROJECT_NAME
  if (!opts.yes) {
    projectName = await input({
      message: 'Project Name',
      default: DEFAULT_PROJECT_NAME,
      theme: prompt,
    })
  }

  const template = '@rise-tools/template-blank-playground'

  // tbd: provide a bit more comprehensive name sanitisation
  const targetDir = formatTargetDir(projectName)

  const root = path.join(process.cwd(), targetDir)

  try {
    await fs.mkdir(root)
  } catch (e) {
    if (!isNodeError(e) || e.code !== 'EEXIST') {
      throw e
    }

    if (!opts.yes) {
      const overwrite = await confirm({
        message: 'Target directory is not empty. Would you like to remove it and proceed?',
        theme: prompt,
      })

      if (!overwrite) {
        console.error(dedent`
          ${debug(`The directory "${root}" already exists. Exiting...`)}
        `)
        return
      }
    }

    await fs.rm(root, { recursive: true, force: true })
    await fs.mkdir(root)
  }

  await downloadAndExtractTemplate(root, template)
  await copyAdditionalTemplateFiles(root)

  const { dependencies, devDependencies, type, scripts, overrides } = await fs.readJSON(
    path.join(root, 'package.json'),
    'utf-8'
  )
  await fs.writeJSON(
    path.join(root, 'package.json'),
    {
      name: projectName,
      private: true,
      type,
      dependencies,
      devDependencies,
      scripts,
      overrides,
    },
    {
      spaces: 2,
    }
  )

  if (opts.install) {
    // tbd: offer an option to choose the package manager via options
    // maybe this is something we can share with the Community CLI?
    cd(root)

    console.log(text(`📦 Using ${highlight('npm')} to install packages`))

    await spinner(
      text(`🔧 Installing dependencies in ${highlight(projectName)}`),
      () => $({ quiet: !opts.verbose })`npm install`
    )
  }

  console.log()

  console.log(dedent`
    ${bold(`✔ The project has been successfully created!`)}

    ${text('To run your project, navigate to the directory and run the following commands:')}
    ${highlight(`cd ${projectName}`)}
  `)

  if (!opts.install) {
    console.log(highlight('npm install'))
  }

  console.log(highlight('npm run dev'))

  console.log()

  console.log(dedent`
    ${bold('📱 For fast and easy prototyping check out Rise Playground App!')}
    ${highlight('iOS')}     ${link('https://apps.apple.com/us/app/rise-playground/id6499588861')}
    ${highlight('Android')} ${link('https://play.google.com/store/apps/details?id=com.xplatlabs.rise')}
  `)
}

async function copyAdditionalTemplateFiles(root: string) {
  await $`cp ${path.join(__dirname, '../_gitignore')} ${path.join(root, '.gitignore')}`
}

const opts = minimist<Options>(process.argv.slice(2), {
  boolean: ['verbose', 'install', 'help', 'yes'],
  default: {
    verbose: false,
    install: true,
    help: false,
    yes: false,
  },
  alias: {
    v: 'verbose',
    h: 'help',
    y: 'yes',
  },
})

if (opts.help) {
  console.log(dedent`
    ${bold('Info')}
      Creates a new Rise project

    ${bold('Usage')}
      ${debug('$')} npx create-rise [options]

    Options
      --no-install         Skip installing npm packages
      -v, --verbose        Print additional logs
      -h, --help           Usage info
      -y, --yes            Use the default options for creating a project
  `)
  process.exit(0)
}

createRise(opts).catch((e) => {
  if (e instanceof ExitPromptError) {
    return
  }
  console.log(dedent`
    ${error('🚨 There was an error setting up new Rise project')}
    ${debug(e.stack)}

    If you believe this is a bug in Rise CLI, please open a new issue here:
    ${link('https://github.com/rise-tools/rise-tools/issues/new')}
  `)
  process.exit(1)
})
