import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={clsx("container", styles.header)}>
        <img src="/img/RiseRemoteIcon.svg" className={styles.appIcon} />
        <div className={styles.headerContainer}>
          <Heading as="h1" className={styles.title}>
            {siteConfig.title}
          </Heading>
          <p className={styles.subtitle}>{siteConfig.tagline}</p>
          <div className={styles.installButtons}>
            <img
              src="/img/google-play-badge.png"
              alt="Install on Android App Store"
              className={styles.installBadge}
            />
            <img
              src="/img/ios-app-store-badge.svg"
              alt="Install on iOS App Store"
              className={styles.installBadge}
            />
            {/* <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Install App
          </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description="Mobile App with Customizable Remote Controls"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
