#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dedent from 'dedent'
import gradient from 'gradient-string'
import inquirer from 'inquirer'
import { $, cd, chalk, fs, spinner } from 'zx'

import { downloadAndExtractTemplate, formatTargetDir, isNodeError } from './utils.js'

const WELCOME_TO_RISE_ASCII =
  "__          __  _                            _          _____  _            _ \r\n\\ \\        / / | |                          | |        |  __ \\(_)          | |\r\n \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___  | |_ ___   | |__) |_ ___  ___  | |\r\n  \\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\ | __/ _ \\  |  _  /| / __|/ _ \\ | |\r\n   \\  /\\  /  __/ | (_| (_) | | | | | |  __/ | || (_) | | | \\ \\| \\__ \\  __/ |_|\r\n    \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|  \\__\\___/  |_|  \\_\\_|___/\\___| (_)"

async function createRise() {
  const { projectName, installDeps } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project Name',
      default: 'rise-project',
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Would you like to install dependencies ?',
      default: true,
    },
    // {
    //   type: 'list',
    //   name: 'template',
    //   message: 'Choose a template',
    //   choices: [
    //     { name: 'React Navigation', value: '@rise-tools/template-react-navigation' },
    //   ],
    // },
  ])

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
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Target directory is not empty. Would you like to remove it and proceed?',
      },
    ])
    if (!overwrite) {
      console.error(dedent`
        ${chalk.red.bold('🚨 There was an error setting up new Rise project:')}
        ${chalk.red(`The directory "${root}" already exists. Exiting...`)}
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

    console.log(chalk.bold(`📦 Using ${chalk.bold.cyan('npm')} to install packages.`))

    await spinner(chalk.bold(`🔧 Installing dependencies in ${projectName}`), () => $`npm install`)
  }

  console.log(riseGradient(WELCOME_TO_RISE_ASCII))

  console.log(
    [
      '',
      chalk.bold.green(`✅ The project has been successfully created !`),
      '',
      'To run your project, navigate to the directory and run the following commands',
      chalk.cyan(`cd ${projectName}`),
      ...(installDeps ? [chalk.cyan('npm install')] : []),
      chalk.cyan(`npm dev`),
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

const riseGradient = gradient('fd5811', '#fd26b5')
