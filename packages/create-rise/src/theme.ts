import gradient from 'gradient-string'
import { chalk } from 'zx'

const hexColors = {
  highlight: '#FD48C1',
  error: '#D22B2B',
}

export const text = (string: string) => string
export const debug = (string: string) => chalk.grey(string)
export const bold = (string: string) => chalk.bold(string)
export const highlight = (string: string) => chalk.hex(hexColors.highlight)(string)
export const error = (string: string) => chalk.hex(hexColors.error)(string)
export const riseGradient = (string: string) => gradient('fd5811', '#fd26b5')(string)

export const prompt = {
  prefix: text('>'),
  style: {
    answer: highlight,
    defaultAnswer: debug,
    error,
  },
}
