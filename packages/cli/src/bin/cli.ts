#!/usr/bin/env node
import { Command } from 'commander'

import { ejectAction } from '../eject'
import { startAction } from '../start'

const program = new Command()

program.name('rise').description('CLI toolkit for Rise Tools').version('0.0.0.alpha.0')

program
  .command('start')
  .description('Start the dev server')
  .option('-ws', 'Enable websocket server')
  .option('--prod', 'Start in production mode')
  .option('-p, --port [port]', 'Port for dev server', Number, 3500)
  .option('-m, --host [host]', 'Server host; can be localhost, lan, tunnel', 'lan')
  .action(startAction)

program
  .command('eject')
  .description('Eject from Rise Start and generate models.ts')
  .action(ejectAction)

program.parse()
