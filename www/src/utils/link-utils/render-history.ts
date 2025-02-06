import { getLocale, type Locale } from "@/utils/get-locale";
import { deleteHistoryEntry } from "@/utils/link-utils/link-history";

import { localizedDeleteHistory } from "@/i18n/components/LinkHistory.i18n";

export function renderHistory(locale: keyof Locale) {
  const history = JSON.parse(localStorage.getItem("shortenHistory") || "[]");
  const historyList = document.getElementById("history-list");
  const historySection = document.getElementById("history-section");

  if (!historyList || !historySection) return;

  if (history.length > 0) {
    historySection.style.display = "block";
    interface HistoryEntry {
      key: string;
      shortUrl: string;
      originalUrl: string;
      created: string;
    }

    const history: HistoryEntry[] = JSON.parse(
      localStorage.getItem("shortenHistory") || "[]",
    );

    historyList.innerHTML = history
      .map(
        (entry: HistoryEntry) => `
        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; background-color: #e0e0e0;">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="flex: 1; overflow: hidden; text-overflow: ellipsis;">
      <div style="display: flex; align-items: center;">
        <div style="color: #121212; padding-right: 0.25rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M12.415 4.84a4.775 4.775 0 0 1 6.752 6.752l-.013.013l-2.264 2.265a4.776 4.776 0 0 1-7.201-.516a1 1 0 0 1 1.601-1.198a2.774 2.774 0 0 0 4.185.3l2.259-2.259a2.776 2.776 0 0 0-3.925-3.923L12.516 7.56a1 1 0 0 1-1.41-1.418l1.298-1.291zM8.818 9.032a4.775 4.775 0 0 1 5.492 1.614a1 1 0 0 1-1.601 1.198a2.775 2.775 0 0 0-4.185-.3l-2.258 2.259a2.775 2.775 0 0 0 3.923 3.924l1.285-1.285a1 1 0 1 1 1.414 1.414l-1.291 1.291l-.012.013a4.775 4.775 0 0 1-6.752-6.752l.012-.013L7.11 10.13a4.8 4.8 0 0 1 1.708-1.098" clip-rule="evenodd"/>
          </svg>
        </div>
        <a href="${entry.shortUrl}" target="_blank"
           style="color: #3b82f6; text-decoration: none; display: block;"
           onmouseover="this.style.textDecoration='underline'"
           onmouseout="this.style.textDecoration='none'">
          ${entry.shortUrl}
        </a>
      </div>
      <div>
        <div style="display: flex; align-items: center;">
          <div style="color: #121212; padding-right: 0.25rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 2048 2048">
              <path fill="currentColor" d="M1280 896H256V256h1024zm-128-512H384v384h768zm896 256v1024H896v-128h1024V768h-384v384H768v256l-128-128v-128H0V0h1536v640zm-640-512H128v896h1280zM464 1414l315 314l-319 318l-74-74l179-180H384q-80 0-149-30t-122-82t-83-122t-30-150h128q0 53 20 99t55 82t81 55t100 20h181l-175-176z"/>
            </svg>
          </div>
          <div style="font-size: 0.875rem; color: #121212; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${entry.originalUrl}
          </div>
        </div>
      </div>
    </div>
    <div style="font-size: 0.75rem; color: #121212; margin-left: 0.5rem; white-space: nowrap;">
      ${new Date(entry.created).toLocaleDateString()}
    </div>
    <button
      style="margin-left: 0.5rem; color: #ef4444; cursor: pointer; background: none; border: none; padding: 0;"
      onmouseover="this.style.color='#dc2626'"
      onmouseout="this.style.color='#ef4444'"
      onclick="deleteEntry('${entry.key}')"
      aria-label="${localizedDeleteHistory[locale]}"
      title="${localizedDeleteHistory[locale]}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</div>
      `,
      )
      .join("");
  } else {
    historySection.style.display = "none";
  }
}

export function deleteEntry(key: string) {
  deleteHistoryEntry(key);
  const locale = getLocale();
  renderHistory(locale);
}

document.addEventListener("DOMContentLoaded", () => {
  const locale = getLocale();
  renderHistory(locale);
});

window.addEventListener("storage", () => {
  const locale = getLocale();
  renderHistory(locale);
});
