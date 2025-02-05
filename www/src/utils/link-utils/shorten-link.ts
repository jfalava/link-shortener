import { showToastWithTimeout } from "@/utils/toast-visibility";

interface HistoryEntry {
  key: string;
  originalUrl: string;
  shortUrl: string;
  created: string;
}

export async function handleShortenLink(
  input: HTMLInputElement,
  buttonText: HTMLElement,
  loadingSpinner: HTMLElement,
  submitLinkSection: HTMLElement,
  shortenedLinkSection: HTMLElement,
  shortenedLink: HTMLElement,
  toasts: {
    badInput: HTMLElement;
    emptyInput: HTMLElement;
    missingProtocol: HTMLElement;
  },
): Promise<void> {
  if (!input.value) {
    showToastWithTimeout(toasts.emptyInput, 5000);
    return;
  }

  const url = input.value.trim();
  buttonText.style.opacity = "0";
  loadingSpinner.style.opacity = "1";

  try {
    // check localStorage first
    const existingEntry = findExistingEntry(url);
    if (existingEntry) {
      updateUIWithExistingEntry(
        existingEntry,
        submitLinkSection,
        shortenedLinkSection,
        shortenedLink,
      );
      return;
    }

    // if url is not local, ping the api
    const result = await shortenUrlViaApi(url);
    const shortenedUrl = `http://127.0.0.1:8787/${result.key}`;

    updateUIWithNewEntry(
      submitLinkSection,
      shortenedLinkSection,
      shortenedLink,
      shortenedUrl,
    );

    saveToHistory({
      key: result.key,
      originalUrl: url,
      shortUrl: shortenedUrl,
      created: new Date().toISOString(),
    });
  } catch (error) {
    showToastWithTimeout(toasts.badInput, 5000);
  } finally {
    buttonText.style.opacity = "1";
    loadingSpinner.style.opacity = "0";
  }
}

async function shortenUrlViaApi(url: string): Promise<{ key: string }> {
  const response = await fetch("http://127.0.0.1:8787/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("Missing protocol");
    }
    throw new Error("Failed to shorten URL");
  }

  return response.json();
}

function findExistingEntry(url: string): HistoryEntry | undefined {
  const history = getHistory();
  return history.find((entry) => entry.originalUrl === url);
}

function updateUIWithExistingEntry(
  entry: HistoryEntry,
  submitLinkSection: HTMLElement,
  shortenedLinkSection: HTMLElement,
  shortenedLink: HTMLElement,
): void {
  submitLinkSection.classList.remove("visible");
  submitLinkSection.classList.add("invisible");
  shortenedLinkSection.classList.remove("invisible");
  shortenedLinkSection.classList.add("visible");
  shortenedLink.textContent = entry.shortUrl;
}

function updateUIWithNewEntry(
  submitLinkSection: HTMLElement,
  shortenedLinkSection: HTMLElement,
  shortenedLink: HTMLElement,
  shortenedUrl: string,
): void {
  submitLinkSection.classList.remove("visible");
  submitLinkSection.classList.add("invisible");
  shortenedLinkSection.classList.remove("invisible");
  shortenedLinkSection.classList.add("visible");
  shortenedLink.textContent = shortenedUrl;
}

function saveToHistory(entry: HistoryEntry): void {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem("shortenHistory", JSON.stringify(history));
}

export function getHistory(): HistoryEntry[] {
  return JSON.parse(localStorage.getItem("shortenHistory") || "[]");
}
