#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import inquirer from 'inquirer'
import { $, cd, fs, spinner } from 'zx'

import { downloadAndExtractTemplate, formatTargetDir, isNodeError } from './utils.js'

async function prompt() {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project Name',
      default: 'rise-project',
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
      console.error(`The directory "${root}" already exists. Exiting...`)
      return
    }
    await fs.rm(root, { recursive: true, force: true })
    await fs.mkdir(root)
  }

  await downloadAndExtractTemplate(root, template)
  await copyAdditionalTemplateFiles(root)

  const { dependencies, devDependencies, scripts } = await fs.readJSON(
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
    },
    {
      spaces: 2,
    }
  )

  if (projectName !== '.') cd(root)

  // tbd: offer an option to choose the package manager via options
  await spinner(
    `Installing dependencies in ${projectName}`,
    () => $`npm install --legacy-peer-deps`
  )

  console.log(
    `The project has been successfully created in ${projectName}. To start, run 'npm dev'`
  )
}

async function copyAdditionalTemplateFiles(root: string) {
  const source = path.dirname(fileURLToPath(import.meta.url))

  await $`cp ${path.join(source, '_gitignore')} ${path.join(root, '.gitignore')}`
}

prompt().catch((e) => {
  console.log(e)
  process.exit(1)
})
