export const handleCopy = () => {
  const copyButton = document.querySelector("#copy-button");
  const okButton = document.querySelector("#ok-button");
  const shortenedLink = document.querySelector("#shortened-link");
  const copyButtonElement = document.querySelector("#copy-button-element");

  if (!copyButtonElement) return;

  copyButtonElement.addEventListener("click", async () => {
    const textToCopy = shortenedLink?.textContent;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);

      if (copyButton && okButton) {
        copyButton.classList.add("opacity-0", "inset-0");
        okButton.classList.remove("opacity-0");

        setTimeout(() => {
          copyButton.classList.remove("opacity-0", "inset-0");
          okButton.classList.add("opacity-0");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  });
};
