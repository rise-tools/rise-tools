#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

import { Command } from 'commander'

import { ejectAction } from '../eject'
import { startAction } from '../start'

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))

const program = new Command()

program.name('rise').description(pkg.description).version(pkg.version)

program
  .command('start')
  .description('Start the dev server')
  .option('--prod', 'Start in production mode')
  .option('--root [root]', 'Root directory of project', process.cwd())
  .option('-p, --port [port]', 'Port for server', Number, 3500)
  .option('-m, --host [host]', 'Server host type; can be localhost, lan, tunnel', 'lan')
  .action(startAction)

program
  .command('eject')
  .description('Eject from Rise Start and generate models.ts')
  .action(ejectAction)

program.parse()
