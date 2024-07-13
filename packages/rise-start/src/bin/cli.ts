#!/usr/bin/env node
import { Command } from 'commander'

import { devAction } from '../dev'
import { genAction } from '../gen'

const program = new Command()

program.name('rise-start').description('CLI toolkit for Rise Tools').version('0.0.0.alpha.0')

program
  .command('dev')
  .description('Start the dev server')
  .option('-ws', 'Websocket server')
  .option('-p, --port [port]', 'Port for dev server', Number, 3500)
  .option('-m, --host [host]', 'dev server host, can be localhost, lan, tunnel', 'lan')
  .action(devAction)

program.command('gen').description('Build the models.ts').action(genAction)

program.parse()
