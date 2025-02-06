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
          <div class="p-4 border border-solid border-bwhite dark:border-bblack rounded-xl bg-white dark:bg-black">
            <div class="flex justify-between items-center text-pretendard">
              <div class="flex-1 truncate">
                <a href="${entry.shortUrl}" target="_blank" class="text-blue-500 hover:underline block">
                  ${entry.shortUrl}
                </a>
                <div class="text-sm text-black dark:text-white truncate">
                  ${entry.originalUrl}
                </div>
              </div>
              <div class="text-xs text-black dark:text-white ml-2 whitespace-nowrap">
                ${new Date(entry.created).toLocaleDateString()}
              </div>
              <button
                class="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
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
