#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

import inquirer from 'inquirer'

import { emptyDir, formatTargetDir, isEmpty, write } from './utils'

const cwd = process.cwd()

const defaultProjectName = 'rise-project'

export const renameFiles: Record<string, string> = {
  _gitignore: '.gitignore',
}

async function prompt() {
  let targetDir = ''
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project Name',
      default: defaultProjectName,
    },
    {
      type: 'list',
      when(ans) {
        targetDir = formatTargetDir(ans.projectName)!
        return fs.existsSync(targetDir) || !isEmpty(targetDir)
      },
      name: 'overwrite',
      message: 'Target directory is not empty. Please choose how to proceed:',
      choices: [
        {
          name: 'Remove existing files and continue',
          value: 'yes',
        },
        {
          name: 'Cancel operation',
          value: 'no',
        },
        {
          name: 'Ignore files and continue',
          value: 'ignore',
        },
      ],
    },
  ])

  const { projectName, overwrite } = answers
  const root = path.join(cwd, projectName)

  if (overwrite === 'yes') {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  const template = 'template-react-navigation'
  const templateDir = path.join(__dirname, `../${template}`)

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'))

  pkg.name = targetDir === '.' ? path.basename(path.resolve()) : targetDir

  write(root, templateDir, 'package.json', JSON.stringify(pkg, null, 2) + '\n')

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(root, templateDir, file)
  }

  console.log('Done')

  if (projectName !== '.') console.info('cd', projectName)
  console.info('npm install')
  console.info('npm start')
}

prompt().catch((e) => {
  console.log(e.message)
})
