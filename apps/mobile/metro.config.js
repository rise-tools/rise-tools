// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config')}
 */
const { getDefaultConfig } = require('@expo/metro-config')
const path = require('path')
const exclusionList = require('metro-config/src/defaults/exclusionList')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..')

const config = getDefaultConfig(projectRoot, {
  isCSSEnabled: true,
})

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

config.resolver.blockList = exclusionList([/example\/.*/])

config.transformer = { ...config.transformer, unstable_allowRequireContext: true }
config.transformer.minifierPath = require.resolve('metro-minify-terser')

// add nice web support with optimizing compiler + CSS extraction
const { withTamagui } = require('@tamagui/metro-plugin')
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './src/tamagui/config.ts',
  outputCSS: './tamagui-web.css',
})
