import { getLocale, type Locale } from "@/utils/get-locale";
import { deleteHistoryEntry } from "@/utils/link-utils/link-history";
import { setupCopyButtons } from "@/utils/copy-string";

import {
  localizedDeleteHistory,
  localizedClickToCopy,
} from "@/i18n/components/LinkHistory.i18n";

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
              <div style="display: flex; align-items: center; padding-bottom: 4px;">
                <div style="color: #121212; padding-right: 0.25rem; user-select: none; cursor: pointer;" class="copy-button" data-string="${entry.shortUrl}" onmouseover="this.style.color='#424242'" onmouseout="this.style.color='#121212'" title="${localizedClickToCopy[locale]}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></g></svg>
                </div>
                <a href="${entry.shortUrl}" target="_blank" style="color: #3b82f6; text-decoration: none; display: block;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                  ${entry.shortUrl}
                </a>
              </div>
              <div>
                <div style="display: flex; align-items: center;">
                  <div style="color: #121212; padding-right: 0.25rem; user-select: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></g></svg>
                  </div>
                  <div style="font-size: 0.875rem; color: #121212; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; user-select: none;">
                    ${entry.originalUrl}
                  </div>
                </div>
              </div>
            </div>
            <div style="font-size: 0.75rem; color: #121212; margin-left: 0.5rem; white-space: nowrap; user-select: none;">
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

    setupCopyButtons();
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
