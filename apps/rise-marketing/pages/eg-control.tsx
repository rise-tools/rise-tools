import { AutoSizeEGPreview } from 'src/EGPreview'
import { FullscreenablePage } from 'src/FullscreenablePage'

export default function EGControlPage() {
  return (
    <FullscreenablePage>
      <AutoSizeEGPreview label="Live" url={'ws://localhost:3889'} />
      <AutoSizeEGPreview label="Ready" url={'ws://localhost:3888'} />
    </FullscreenablePage>
  )
}
