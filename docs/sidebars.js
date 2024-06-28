/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  mainSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Playground',
      link: {
        type: 'doc',
        id: 'playground/index',
      },
      items: ['playground/actions', 'playground/navigation'],
    },
    'core',
    {
      type: 'category',
      label: '@rise-tools/server',
      link: {
        type: 'doc',
        id: 'server-js/index',
      },
      items: ['server-js/models', 'server-js/servers'],
    },
    {
      type: 'category',
      label: 'Kit Reference',
      link: {
        type: 'doc',
        id: 'kit/index',
      },
      items: [
        'kit/rise-kit',
        'kit/tamagui',
        'kit/forms',
        'kit/haptics',
        'kit/linking',
        'kit/lucide-icons',
        'kit/svg',
        'kit/qrcode',
        'kit/tamagui-toast',
        'kit/expo-router',
        'kit/react-navigation',
      ],
    },
    {
      type: 'category',
      label: 'Server API',
      link: {
        type: 'doc',
        id: 'server-spec/index',
      },
      items: ['server-spec/json-types', 'server-spec/http', 'server-spec/ws'],
    },
    'community',
    'contributors',
  ],

  guidesSidebar: [
    'guides/integration-examples',
    'guides/actions-events',
    'guides/custom-components',
    'guides/custom-models',
    'guides/navigation',
    'guides/error-handling',
    'guides/jsx-setup',
    'guides/refs',
    'guides/server-compatibility',
    'guides/use-cases',
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
}

export default sidebars
