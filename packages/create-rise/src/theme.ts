import { type Theme } from '@inquirer/core'
import type { PartialDeep } from '@inquirer/type'
import gradient from 'gradient-string'
import { chalk } from 'zx'

type PromptConfig = {
  theme?: PartialDeep<Theme>
}

const hexColors = {
  highlight: '#FD48C1',
  error: '#D22B2B',
}

export const colors = {
  base: (string: string) => string,
  baseBold: (string: string) => chalk.bold(string),
  highlight: (string: string) => chalk.hex(hexColors.highlight)(string),
  error: (string: string) => chalk.hex(hexColors.error)(string),
  errorBold: (string: string) => chalk.hex(hexColors.error).bold(string),
  riseGradient: (string: string) => gradient('fd5811', '#fd26b5')(string),
} as const

export function styledPrompt<T extends { message: string; default?: string | boolean }>(
  prompt: T
): T & PromptConfig {
  return {
    ...prompt,
    theme: {
      prefix: colors.base('>'),
      style: {
        answer: colors.highlight,
        message: colors.base,
        defaultAnswer: colors.highlight,
        error: colors.error,
      },
    },
  }
}
