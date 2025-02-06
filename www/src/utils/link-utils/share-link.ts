import { locale, type RequiredLocales } from "@/utils/get-locale";
import { localizedShareLink } from "@/i18n/utils/share-link.i18n";

export const handleShare = async () => {
  const shareButton = document.querySelector("#share-button");
  if (!shareButton) return;

  shareButton.addEventListener("click", async () => {
    const textToShare = document.querySelector("#shortened-link")?.textContent;
    if (!textToShare) return;

    if (!navigator.share) {
      console.warn("Web Share API not supported");
      return;
    }

    try {
      await navigator.share({
        title: localizedShareLink[locale as unknown as keyof RequiredLocales],
        text: textToShare,
        url: textToShare,
      });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to share text: ", err);
      }
    }
  });
};
