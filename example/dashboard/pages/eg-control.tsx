import { AutoSizeEGPreview } from "src/EGPreview";
import { FullscreenablePage } from "src/FullscreenablePage";
import { LiveURL, ReadyURL } from "src/urls";

export default function EGControlPage() {
  return (
    <FullscreenablePage>
      <AutoSizeEGPreview label="Live" url={LiveURL} />
      <AutoSizeEGPreview label="Ready" url={ReadyURL} />
    </FullscreenablePage>
  );
}
