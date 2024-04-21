import { AutoSizeEGPreview } from 'src/EGPreview'
import { FullscreenablePage } from 'src/FullscreenablePage'
import { QRCode } from 'src/QRCode'

export default function EGPreviewPage() {
  return (
    <FullscreenablePage
      corner={
        null
        // <QRCode value="https://github.com/ericvicenti/react-native-templates" />
      }
    >
      <AutoSizeEGPreview url={'ws://localhost:3888'} />
    </FullscreenablePage>
  )
}
