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
        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; background-color: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-family: sans-serif;">
            <div style="flex: 1; overflow: hidden; text-overflow: ellipsis;">
              <a href="${entry.shortUrl}" target="_blank" 
                 style="color: #3b82f6; text-decoration: none; display: block;"
                 onmouseover="this.style.textDecoration='underline'"
                 onmouseout="this.style.textDecoration='none'">
                ${entry.shortUrl}
              </a>
              <div style="font-size: 0.875rem; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${entry.originalUrl}
              </div>
            </div>
            <div style="font-size: 0.75rem; color: #000; margin-left: 0.5rem; white-space: nowrap;">
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
              <svg xmlns="http://www.w3.org/2000/svg" height="20" width="auto" viewBox="0 0 20 20" fill="currentColor">
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
