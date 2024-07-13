#!/usr/bin/env node
import { Command } from 'commander'

import { devAction } from '../dev'
import { ejectAction } from '../eject'

const program = new Command()

program.name('rise-start').description('CLI toolkit for Rise Tools').version('0.0.0.alpha.0')

program
  .command('dev')
  .description('Start the dev server')
  .option('-ws', 'Enable websocket server')
  .option('-p, --port [port]', 'Port for dev server', Number, 3500)
  .option('-m, --host [host]', 'dev server host, can be localhost, lan, tunnel', 'lan')
  .action(devAction)

program
  .command('eject')
  .description('Eject from Rise Start and generate models.ts')
  .action(ejectAction)

program.parse()
