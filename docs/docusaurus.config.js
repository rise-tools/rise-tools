// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rise Tools',
  tagline: 'Server Defined Rendering for React Native',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://rise.tools',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rise-tools', // Usually your GitHub org/user name.
  projectName: 'rise-tools', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  plugins: [
    async function docusaurusTailwindPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'))
          postcssOptions.plugins.push(require('autoprefixer'))
          return postcssOptions
        },
      }
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/rise-tools/rise-tools/tree/main/docs',
        },
        blog: {
          showReadingTime: false,
          editUrl: 'https://github.com/rise-tools/rise-tools/tree/main/docs',
        },
        theme: {
          customCss: './src/css/site.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/rise-social-card.jpg',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Rise Tools',
        logo: {
          alt: 'Rise Tools Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'guidesSidebar',
            position: 'left',
            label: 'Guides',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/rise-tools/rise-tools',
            'aria-label': 'GitHub',
            className: 'header-github-link',
            position: 'right',
          },
          {
            href: 'https://twitter.com/risetools_',
            'aria-label': 'Twitter',
            className: 'header-twitter-link',
            position: 'right',
          },
          {
            href: 'https://discord.gg/vK3tBdA2nZ',
            'aria-label': 'Discord',
            className: 'header-discord-link',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Get Started',
                to: '/docs/getting-started',
              },
              {
                label: 'Guides',
                to: '/docs/guides/integration-examples',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/rise-tools/rise-tools/discussions',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/vK3tBdA2nZ',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/risetools_',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/rise-tools/rise-tools',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Rise Tools Core Team.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
}

export default config
