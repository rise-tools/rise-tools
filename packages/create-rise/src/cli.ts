#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'

import inquirer from 'inquirer'

import { downloadAndExtractTemplate, formatTargetDir, isNodeError } from './utils'

async function prompt() {
  const { projectName, template } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project Name',
      default: 'rise-project',
    },
    {
      type: 'list',
      name: 'template',
      choices: [
        { name: 'React Navigation', value: 'react-navigation' },
        { name: 'Base', value: 'base' },
      ],
    },
  ])

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
      console.error(`The directory "${root}" already exists. Exiting...`)
      return
    }
    await fs.rm(root, { recursive: true, force: true })
  }

  // tbd: offer selection and ask users which template they want
  await downloadAndExtractTemplate(root, template)

  // tbd: copy and rename remaining files
  // tbd: modify `package.json` to only include "dependencies", "devDependencies" and "scripts"

  console.log('Done')

  if (projectName !== '.') console.info('cd', projectName)

  // tbd: offer an option to choose the package manager

  // tbd: replace with actual commands
  console.info('npm install')
  console.info('npm start')
}

prompt().catch((e) => {
  console.log(e.message)
  process.exit(1)
})
