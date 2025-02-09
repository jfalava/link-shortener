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
      <div class="p-4 border border-bwhite dark:border-bblack rounded-xl bg-white dark:bg-black">
        <div class="flex justify-between items-center">
          <div class="flex-1 overflow-hidden">
            <div class="flex items-center pb-1">
              <div class="pr-1 select-none cursor-pointer copy-button" data-string="${entry.shortUrl}" title="${localizedClickToCopy[locale]}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></g></svg>
              </div>
              <a href="${entry.shortUrl}" target="_blank" class="text-blue-500 no-underline block hover:underline">
                ${entry.shortUrl}
              </a>
            </div>
            <div>
              <div class="flex items-center">
                <div class="pr-1 select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></g></svg>
                </div>
                <div class="text-sm overflow-hidden text-ellipsis whitespace-nowrap select-none text-mono">
                  ${entry.originalUrl}
                </div>
              </div>
            </div>
          </div>
          <div class="text-xs ml-2 whitespace-nowrap select-none">
            ${new Date(entry.created).toLocaleDateString()}
          </div>
          <button
            class="ml-2 text-red-600 cursor-pointer bg-none border-none p-0 hover:text-red-500"
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
