const toastTimeouts = new Map();

export function hideAllToasts() {
  const toasts = ["empty-input", "bad-input", "missing-protocol"]
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null);

  toasts.forEach((toast) => {
    toast.classList.add("invisible");
    toast.classList.remove("slide-in-out");
    const existingTimeout = toastTimeouts.get(toast);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
  });
}

export function showToastWithTimeout(
  toastElement: HTMLElement,
  duration: number,
) {
  hideAllToasts();

  toastElement.classList.remove("slide-in-out");
  toastElement.classList.remove("invisible");

  void toastElement.offsetWidth;

  toastElement.classList.add("slide-in-out");

  const existingTimeout = toastTimeouts.get(toastElement);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const newTimeout = setTimeout(() => {
    toastElement.classList.add("invisible");
    toastElement.classList.remove("slide-in-out");
  }, duration);

  toastTimeouts.set(toastElement, newTimeout);
}
