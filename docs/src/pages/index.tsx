import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import {
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

import test from '../../assets/forms-ui.png'
import { PlaygroundAppDownload } from '../components/PlaygroundAppDownload'
import styles from './index.module.css'

function HomepageHeader() {
  return <header className={clsx('hero hero--primary', styles.heroBanner)}></header>
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
    <section className={clsx(styles.section, alt && styles.sectionAlt)}>
      <div>{children}</div>
    </section>
  )
}

function SectionContent({
  title,
  text,
  graphic,
}: {
  title: string
  text: string
  graphic: ReactNode
}) {
  return (
    <div className={styles.sectionContent}>
      <h2>{title}</h2>
      <p>{text}</p>
      <div className={styles.sectionGraphic}>{graphic}</div>
    </div>
  )
}

function Interstitial({ children }: { children: ReactNode }) {
  return <section className={styles.interstitial}>{children}</section>
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <div className={styles.heroCta}>
        <Link className="button button--secondary button--lg" to="/docs/intro">
          Introduction
        </Link>
        <Link className="button button--secondary button--lg" to="/docs/getting-started">
          Get Started
        </Link>
      </div>
      <main className={styles.main}>
        <Section>
          <SectionContent
            title="Forms and UI, defined on your server"
            text=""
            graphic={<img src="/img/forms-ui.png" />}
          />
        </Section>
        <Interstitial>
          <h2>Any Framework.</h2>
          <h2>Any Server.</h2>
          <h2>Ready Today.</h2>
        </Interstitial>
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
            graphic={
              <>
                <img src="/img/playground-app.png" />
                <PlaygroundAppDownload />
              </>
            }
          />
        </Section>
        <Section alt>
          <h2 className={styles.sectionTitle}>Meet The Tools</h2>
          <div className={styles.toolsList}>
            {tools.map((tool) => {
              return (
                <a className={styles.tool} href={tool.url}>
                  <h4>{tool.name}</h4>
                  <tool.icon className={styles.toolIcon} size={64} />
                </a>
              )
            })}
          </div>
        </Section>
      </main>
    </Layout>
  )
}
