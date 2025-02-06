interface HistoryEntry {
  key: string;
  originalUrl: string;
  shortUrl: string;
  created: string;
}

export function saveToHistory(entry: HistoryEntry): void {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem("shortenHistory", JSON.stringify(history));
}

export function getHistory(): HistoryEntry[] {
  return JSON.parse(localStorage.getItem("shortenHistory") || "[]");
}

export function deleteHistoryEntry(key: string): void {
  const history = getHistory();
  const updatedHistory = history.filter((entry) => entry.key !== key);
  localStorage.setItem("shortenHistory", JSON.stringify(updatedHistory));
}

export function findExistingEntry(url: string): HistoryEntry | undefined {
  const history = getHistory();
  return history.find((entry) => entry.originalUrl === url);
}
