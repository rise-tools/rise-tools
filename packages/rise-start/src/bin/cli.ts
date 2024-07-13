#!/usr/bin/env node
import { Command } from 'commander'

import { devServerAction } from '../dev'

const program = new Command()

program.name('rise-start').description('CLI toolkit for Rise Tools').version('0.0.0.alpha.0')

program
  .command('dev')
  .description('Start the dev server')
  .option('-ws', 'Websocket server')
  .option('-p, --port [port]', 'Port for dev server', Number, 3500)
  .option('-m, --host [host]', 'dev server host, can be localhost, lan, tunnel', 'lan')
  .action(devServerAction)

program.parse()
