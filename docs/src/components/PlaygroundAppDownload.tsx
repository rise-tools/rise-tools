import React from 'react'

import styles from './PlaygroundAppDownload.module.css'

function DLButton({ img, url }: { img: string; url: string }) {
  return (
    <a href={url} className={styles.dlButton}>
      <img src={img} />
    </a>
  )
}
export function PlaygroundAppDownload() {
  return (
    <div className={styles.dlButtons}>
      <DLButton
        img="/img/dl-appstore.png"
        url="https://apps.apple.com/us/app/rise-playground/id6499588861"
      />
      <DLButton
        img="/img/dl-googleplay.png"
        url="https://play.google.com/store/apps/details?id=com.xplatlabs.rise"
      />
    </div>
  )
}
