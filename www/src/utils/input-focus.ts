export function inputFocus(inputId: string): void {
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "k") {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        (inputElement as HTMLInputElement).focus();
      }
    }
  });
}
