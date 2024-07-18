import makeGradient from 'gradient-string'
import { chalk } from 'zx'

const hexColors = {
  highlight: '#FD48C1',
  error: '#D22B2B',
}

export const text = (string: string) => string
export const debug = (string: string) => chalk.grey(string)
export const bold = (string: string) => chalk.bold(string)
export const highlight = (string: string) => gradient(string)
export const error = (string: string) => chalk.hex(hexColors.error)(string)
export const gradient = (string: string) => makeGradient('#FD5811', '#FD26b5')(string)

export const prompt = {
  prefix: text('>'),
  style: {
    answer: highlight,
    defaultAnswer: debug,
    error,
  },
}
