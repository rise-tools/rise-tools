import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import {
  Atom,
  Braces,
  Joystick,
  PartyPopper,
  QrCode,
  Server,
  Link as LinkIcon,
  Vibrate,
  SmartphoneCharging,
  Compass,
  ClipboardPen,
  Drama,
} from "lucide-react";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      {/* <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Tutorial
          </Link>
        </div>
      </div> */}
    </header>
  );
}

const tools = [
  {
    name: "Rise React",
    url: "/docs/core",
    description: "lolllll",
    icon: Atom,
  },
  {
    name: "JS Server",
    url: "/docs/server-js",
    description: "lolllll",
    icon: Server,
  },
  {
    name: "Playground",
    url: "/docs/playground",
    description: "lolllll",
    icon: SmartphoneCharging,
  },
  {
    name: "Server API",
    url: "/docs/server-spec",
    description: "lolllll",
    icon: Braces,
  },
  {
    name: "Tamagui",
    url: "/docs/kit/tamagui",
    description: "lolllll",
    icon: Joystick,
  },
  {
    name: "Toast",
    url: "/docs/kit/toast",
    description: "lolllll",
    icon: PartyPopper,
  },
  {
    name: "Linking",
    url: "/docs/kit/linking",
    description: "lolllll",
    icon: LinkIcon,
  },
  {
    name: "Haptics",
    url: "/docs/kit/haptics",
    description: "lolllll",
    icon: Vibrate,
  },
  {
    name: "QR Code",
    url: "/docs/kit/qrcode",
    description: "lolllll",
    icon: QrCode,
  },
  {
    name: "Navigation",
    url: "/docs/guides/navigation",
    description: "lolllll",
    icon: Compass,
  },
  {
    name: "Forms",
    url: "/docs/kit/forms",
    description: "lolllll",
    icon: ClipboardPen,
  },
  {
    name: "Icons",
    url: "/docs/kit/lucide-icons",
    description: "lolllll",
    icon: Drama,
  },
];

function MeetTheTools() {
  return (
    <section className={styles.toolsSection}>
      <h2>Meet The Tools</h2>
      <div className={styles.toolsList}>
        {tools.map((tool) => {
          return (
            <a className={styles.tool} href={tool.url}>
              <h4>{tool.name}</h4>
              <tool.icon className={styles.toolIcon} size={64} />
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
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
        <Link
          className="button button--secondary button--lg"
          to="/docs/getting-started"
        >
          Get Started
        </Link>
      </div>
      <main className={styles.main}>
        <MeetTheTools />
      </main>
    </Layout>
  );
}
