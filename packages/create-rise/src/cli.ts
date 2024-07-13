#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

import inquirer from 'inquirer'

const cwd = process.cwd()

const defaultProjectName = 'rise-project'

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

  const renameFiles: Record<string, string | undefined> = {
    _gitignore: '.gitignore',
  }

  const template = 'template-react-navigation'
  const templateDir = path.join(__dirname, `../${template}`)

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'))

  pkg.name = targetDir === '.' ? path.basename(path.resolve()) : targetDir

  write('package.json', JSON.stringify(pkg, null, 2) + '\n')

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  console.log('Done')

  if (projectName !== '.') console.info('cd', projectName)
  console.info('npm install')
  console.info('npm start')

  function write(file: string, content?: string) {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  function copy(src: string, dest: string) {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      copyDir(src, dest)
    } else {
      fs.copyFileSync(src, dest)
    }
  }

  function copyDir(srcDir: string, destDir: string) {
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file)
      const destFile = path.resolve(destDir, file)
      copy(srcFile, destFile)
    }
  }

  function isEmpty(path: string) {
    try {
      const files = fs.readdirSync(path)
      return files.length === 0 || (files.length === 1 && files[0] === '.git')
    } catch (e) {
      return true
    }
  }

  function emptyDir(dir: string) {
    if (!fs.existsSync(dir)) {
      return
    }
    for (const file of fs.readdirSync(dir)) {
      if (file === '.git') {
        continue
      }
      fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
    }
  }
  function formatTargetDir(targetDir: string | undefined) {
    return targetDir?.trim().replace(/\/+$/g, '')
  }
}

prompt().catch((e) => {
  console.log(e.message)
})
