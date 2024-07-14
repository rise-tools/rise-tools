import React from 'react'

function DLButton({ img, url }: { img: string; url: string }) {
  return (
    <a href={url} className={'flex w-46 h-12 overflow-hidden'}>
      <img src={img} />
    </a>
  )
}
export function PlaygroundAppDownload() {
  return (
    <div className={'flex w-100 gap-3 center'}>
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
