export function inputFocus(inputId: string): void {
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "k") {
      // disable browser ctrl+k bind
      event.preventDefault();

      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        (inputElement as HTMLInputElement).focus();
      }
    }
  });
}
