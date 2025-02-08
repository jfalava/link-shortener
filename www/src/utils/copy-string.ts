export function setupCopyButtons() {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".copy-button");

  const successSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"/></svg>
  `;
  const errorSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 16 16">
    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z"/>
    <path d="M7.5 5.5a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0v-3zM8 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </svg>
`;

  buttons.forEach((button) => {
    const originalContent = button.innerHTML;

    button.addEventListener("click", async () => {
      const string = button.getAttribute("data-string");
      if (!string) return;

      try {
        await navigator.clipboard.writeText(string);
        console.log(`Copied to clipboard: ${string}`);

        button.innerHTML = successSvg;

        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);

        button.innerHTML = errorSvg;

        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 2000);
      }
    });
  });
}
