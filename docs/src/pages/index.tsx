import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
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

function HomepageHeader() {
  return (
    <header
      className={
        'bg-no-repeat bg-center bg-hero-image sm:bg-[length:1340px_150px] sm:h-[150px] bg-[length:1072px_120px] h-[120px] md:bg-[length:1605px_190px] md:h-[190px] lg:bg-[length:3216px_360px] lg:h-[360px] overflow-hidden'
      }
    ></header>
  )
}

const tools = [
  {
    name: 'Rise React',
    url: '/docs/core',
    description: 'lolllll',
    icon: Atom,
  },
  {
    name: 'JS Server',
    url: '/docs/server-js',
    description: 'lolllll',
    icon: Server,
  },
  {
    name: 'Playground',
    url: '/docs/playground',
    description: 'lolllll',
    icon: SmartphoneCharging,
  },
  {
    name: 'Server API',
    url: '/docs/server-spec',
    description: 'lolllll',
    icon: Braces,
  },
  {
    name: 'Tamagui',
    url: '/docs/kit/tamagui',
    description: 'lolllll',
    icon: Joystick,
  },
  {
    name: 'Toast',
    url: '/docs/kit/tamagui-toast',
    description: 'lolllll',
    icon: PartyPopper,
  },
  {
    name: 'Linking',
    url: '/docs/kit/linking',
    description: 'lolllll',
    icon: LinkIcon,
  },
  {
    name: 'Haptics',
    url: '/docs/kit/haptics',
    description: 'lolllll',
    icon: Vibrate,
  },
  {
    name: 'QR Code',
    url: '/docs/kit/qrcode',
    description: 'lolllll',
    icon: QrCode,
  },
  {
    name: 'Navigation',
    url: '/docs/guides/navigation',
    description: 'lolllll',
    icon: Compass,
  },
  {
    name: 'Forms',
    url: '/docs/kit/forms',
    description: 'lolllll',
    icon: ClipboardPen,
  },
  {
    name: 'Icons',
    url: '/docs/kit/lucide-icons',
    description: 'lolllll',
    icon: Drama,
  },
]

function Section({ children, alt = false }: { children: ReactNode; alt?: boolean }) {
  return (
    <section className={`${alt ? 'bg-black' : ''}`}>
      <div className="lg:container w-100  md:px-8 px-4 md:py-12 py-8 space-y-10 mx-auto">
        {children}
      </div>
    </section>
  )
}

function SectionContent({
  title,
  text,
  graphic,
  footer,
}: {
  title: string
  text: string
  graphic: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="space-y-8">
      <h2 className="flex center rise-gradient-text font-extrabold lg:text-7xl md:text-5xl text-4xl text-center">
        {title}
      </h2>
      <p>{text}</p>
      <div>
        <div className={'flex flex-col center drop-shadow-md rounded-2xl overflow-hidden'}>
          {graphic}
        </div>
      </div>
      {footer && <div>{footer}</div>}
    </div>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />

      <main className={'bg-gradient-to-tl from-background from-30% to-black'}>
        <div className={'flex center p-5 gap-5 md:mt-10 mt-5'}>
          <Link className="rise-button shrink-0" to="/docs/getting-started">
            Get Started
          </Link>
          <Link className="rise-button-outlined flex items-center gap-2 shrink-0" to="/docs/intro">
            <div>Introduction</div>
            <ArrowRight className="w-6 h-6 " />
          </Link>
        </div>
        <Section>
          <SectionContent
            title="Forms and UI, defined on your server"
            text=""
            graphic={<img src="/img/forms-ui.png" />}
          />
        </Section>
        <section className="bg-white px-10 py-8">
          <h2 className="lg:text-6xl md:text-4xl text-3xl font-extrabold text-black text-center">
            Any Framework.
          </h2>
          <h2 className="lg:text-6xl md:text-4xl text-3xl font-extrabold text-black text-center">
            Any Server.
          </h2>
          <h2 className="lg:text-6xl md:text-4xl text-3xl font-extrabold text-black text-center">
            Ready Today.
          </h2>
        </section>

        <Section alt>
          <SectionContent
            title="Local Actions. Remote Events. Dynamic Routes."
            text=""
            graphic={<img src="/img/actions-events-routes.png" />}
          />
        </Section>
        <Section>
          <SectionContent
            title="Playground App: Jump-Start Your Dev"
            text=""
            graphic={<img src="/img/playground-app.png" />}
            footer={<PlaygroundAppDownload />}
          />
        </Section>
        <Section alt>
          <h2 className={'rise-gradient-text lg:text-6xl md:text-4xl text-3xl font-extrabold'}>
            Meet The Tools
          </h2>
          <div className={'grid gap-10 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}>
            {tools.map((tool) => {
              return (
                <a
                  className={'flex flex-col items-center  hover:no-underline text-white'}
                  key={tool.name}
                  href={tool.url}
                >
                  <h4>{tool.name}</h4>
                  <tool.icon size={64} />
                </a>
              )
            })}
          </div>
        </Section>
      </main>
    </Layout>
  )
}
