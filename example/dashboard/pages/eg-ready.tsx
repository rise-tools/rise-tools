import { AutoSizeEGPreview } from "src/EGPreview";
import { FullscreenablePage } from "src/FullscreenablePage";
import { ReadyURL } from "src/urls";

export default function EGPreviewPage() {
  return (
    <FullscreenablePage
      corner={
        null
        // <QRCode value="https://github.com/ericvicenti/react-native-templates" />
      }
    >
      <AutoSizeEGPreview url={ReadyURL} />
    </FullscreenablePage>
  );
}
