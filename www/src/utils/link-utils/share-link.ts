import { locale, type RequiredLocales } from "@/utils/get-locale";
import { localizedShareLink } from "@/i18n/utils/share-link.i18n";
import { showToastWithTimeout } from "@/utils/toast-visibility";

export const handleShare = async () => {
  const shareButton = document.querySelector("#share-button");
  if (!shareButton) return;

  shareButton.addEventListener("click", async () => {
    const textToShare = document.querySelector("#shortened-link")?.textContent;
    if (!textToShare) return;

    if (!navigator.share) {
      console.warn("Web Share API not supported");
      const shareUnavailableToast =
        document.getElementById("share-unavailable");
      if (shareUnavailableToast instanceof HTMLElement) {
        showToastWithTimeout(shareUnavailableToast, 3000);
      }
      return;
    }

    try {
      await navigator.share({
        title: localizedShareLink[locale as unknown as keyof RequiredLocales],
        text: localizedShareLink[locale as unknown as keyof RequiredLocales],
        url: textToShare,
      });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to share text: ", err);
      }
    }
  });
};
