import makeGradient from 'gradient-string'
// @ts-ignore
import { chalk } from 'zx'

const hexColors = {
  highlight: '#FD48C1',
  error: '#D22B2B',
}

const RISE_ASCII =
  '\r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\r\n\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2557  \r\n\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D  \r\n\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\r\n\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\r\n                           \r\n'

export const text = (string: string) => string
export const debug = (string: string) => chalk.grey(string)
export const bold = (string: string) => chalk.bold(string)
export const highlight = (string: string) => gradient(string)
export const error = (string: string) => chalk.hex(hexColors.error)(string)
export const gradient = (string: string) => makeGradient('#FD5811', '#FD26b5')(string)
export const link = (string: string) => chalk.underline(string)

export const logo = () => gradient(RISE_ASCII)

export const prompt = {
  prefix: text('>'),
  style: {
    answer: highlight,
    defaultAnswer: debug,
    error,
  },
}
