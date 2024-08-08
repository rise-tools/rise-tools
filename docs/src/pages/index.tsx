import Link from '@docusaurus/Link'
import type {} from '@docusaurus/theme-classic'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import CopyButton from '@theme/CodeBlock/CopyButton'
import Layout from '@theme/Layout'
import {
  ArrowRight,
  Atom,
  Braces,
  ClipboardPen,
  Compass,
  Drama,
  Joystick,
  Link as LinkIcon,
  PartyPopper,
  QrCode,
  Server,
  SmartphoneCharging,
  Vibrate,
} from 'lucide-react'
import React, { ReactNode } from 'react'

import { PlaygroundAppDownload } from '../components/PlaygroundAppDownload'

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-secondary/15 via-background/90 to-background -mt-[var(--ifm-navbar-height)]">
      <div className="flex max-lg:text-center max-md:pt-40 max-lg:flex-col-reverse gap-6 mx-auto md:min-h-[90vh] items-center justify-center max-w-7xl px-4">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-6xl font-semibold rise-hero-text max-md:text-4xl font-poppins">
            Server Defined Rendering for React Native
          </h1>
          <h2 className="text-2xl font-medium text-gray-300 max-md:text-xl">
            The Server, Kit, and Playground. Or bring your own.
          </h2>

          <div className="flex items-center gap-4 max-lg:justify-center ">
            <Link
              className="flex items-center text-sm rise-button shrink-0 hover:rise-button-outline"
              to="/docs/getting-started"
            >
              Get Started
            </Link>
            <Link
              className="flex items-center gap-2 text-sm transition-all rise-button-outlined shrink-0"
              to="/docs/intro"
            >
              <div>Introduction</div>
              <ArrowRight size={20} />
            </Link>
          </div>

          <code className="inline-flex items-center gap-4 px-3 py-1">
            npm create rise@latest
            <div className="tooltip">
              <CopyButton
                code="npm create rise@latest"
                className="relative flex items-center justify-center p-2 transition-all border border-transparent border-solid rounded-md hover:border-white/40 hover:bg-white/10 bg-white/5 opacity-70 hover:opacity-100"
              />
              <span className="w-40 h-8 -ml-20 text-sm font-medium max-sm:hidden tooltip-text rise-button font-inter">
                Copy to clipboard
              </span>
            </div>
          </code>
        </div>
        <div className="relative flex items-center justify-center">
          <img src="/img/logo.svg" className="w-52 md:w-72 lg:w-80" />
          <img
            src="/img/logo.svg"
            className="blur-2xl opacity-70 absolute animate-[spin_2s_linear_infinite] w-52 md:w-72 lg:w-80"
          />
        </div>
      </div>
    </section>
  )
}

const tools = [
  {
    name: 'Rise React',
    url: '/docs/core',
    description:
      'A core tool for building React applications with advanced features and optimizations.',
    icon: Atom,
    color: '#FFD700',
  },
  {
    name: 'JS Server',
    url: '/docs/server-js',
    description: 'Server-side JavaScript functionalities and configurations.',
    icon: Server,
    color: '#1E90FF',
  },
  {
    name: 'Playground',
    url: '/docs/playground',
    description: 'Interactive environment for testing and experimenting with code.',
    icon: SmartphoneCharging,
    color: '#32CD32',
  },
  {
    name: 'Server API',
    url: '/docs/server-spec',
    description: 'API specifications and documentation for server-side interactions.',
    icon: Braces,
    color: '#FF6347',
  },
  {
    name: 'Tamagui',
    url: '/docs/kit/tamagui',
    description: 'Design system and UI kit for rapid prototyping and development.',
    icon: Joystick,
    color: '#FF69B4',
  },
  {
    name: 'Toast',
    url: '/docs/kit/tamagui-toast',
    description: 'Toast notifications for user feedback and alerts.',
    icon: PartyPopper,
    color: '#FFC0CB',
  },
  {
    name: 'Linking',
    url: '/docs/kit/linking',
    description: 'Linking and navigation utilities for enhanced user experience.',
    icon: LinkIcon,
    color: '#8A2BE2',
  },
  {
    name: 'Haptics',
    url: '/docs/kit/haptics',
    description: 'Haptic feedback features to enhance the tactile experience.',
    icon: Vibrate,
    color: '#00FA9A',
  },
  {
    name: 'QR Code',
    url: '/docs/kit/qrcode',
    description: 'QR code generation and scanning functionalities.',
    icon: QrCode,
    color: '#FF4500',
  },
  {
    name: 'Navigation',
    url: '/docs/guides/navigation',
    description: 'Guides and best practices for implementing navigation in applications.',
    icon: Compass,
    color: '#6A5ACD',
  },
  {
    name: 'Forms',
    url: '/docs/kit/forms',
    description: 'Components and utilities for form handling and validation.',
    icon: ClipboardPen,
    color: '#20B2AA',
  },
  {
    name: 'Icons',
    url: '/docs/kit/lucide-icons',
    description: 'Collection of icons for use in your projects.',
    icon: Drama,
    color: '#DC143C',
  },
]

function Section({
  children,
  title,
  subTitle,
  className,
}: {
  children: ReactNode
  title?: string
  subTitle?: string
  className?: string
}) {
  return (
    <section className={'py-10 bg-background text-center ' + className}>
      <div className="rise-gradient-text lg:text-5xl text-3xl font-semibold font-poppins !leading-normal max-w-4xl text-center">
        {title}
      </div>
      {subTitle && (
        <p className="text-lg font-medium text-center text-gray-300 md:text-xl">{subTitle}</p>
      )}
      <div className="px-4 py-8 mx-auto space-y-10 md:px-8 md:py-12 max-w-7xl">{children}</div>
    </section>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <HeroSection />

      <Section title="Meet The Tools">
        <div className={'grid gap-4 md:gap-10 sm:grid-cols-2 md:grid-cols-4'}>
          {tools.map((tool) => {
            return (
              <a
                className="items-start gap-4 p-4 text-left text-white rounded-lg hover:no-underline md:space-y-3 bg-background/40 max-md:flex "
                key={tool.name}
                href={tool.url}
              >
                <div
                  className="inline-flex items-center justify-center p-2 border-solid rounded-md max-sm:mt-2"
                  style={{
                    borderColor: tool.color,
                    color: tool.color,
                    backgroundColor: `${tool.color}50`,
                  }}
                >
                  <tool.icon size={20} />
                </div>
                <div>
                  <div className="text-lg font-semibold leading-loose text-gray-200 font-poppins">
                    {tool.name}
                  </div>
                  <div className="font-medium leading-5 text-gray-500 break-words text-wrap">
                    {tool.description}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </Section>

      <main className={'bg-gradient-to-tl from-background from-30% to-black'}>
        <Section title="Forms and UI" subTitle="Defined on your server" className="bg-black ">
          <img src="/img/forms-ui.png" className="md:w-[60vw]" />
        </Section>

        <Section title="Playground App" subTitle="Jump-Start Your Dev">
          <PlaygroundAppDownload />
          <img src="/img/playground-app.png" className="mx-auto" />
        </Section>

        <Section title="Local Actions. Remote Events. Dynamic Routes." className="bg-black">
          <img src="/img/actions-events-routes.png" />
        </Section>
      </main>
    </Layout>
  )
}
