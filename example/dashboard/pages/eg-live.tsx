import { AutoSizeEGPreview } from "src/EGPreview";
import { FullscreenablePage } from "src/FullscreenablePage";
import { LiveURL } from "src/urls";

export default function EGLivePage() {
  return (
    <FullscreenablePage
      corner={
        null
        // <QRCode value="https://github.com/ericvicenti/react-native-templates" />
      }
    >
      <AutoSizeEGPreview url={LiveURL} />
    </FullscreenablePage>
  );
}
