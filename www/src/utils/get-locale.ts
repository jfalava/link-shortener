export type Locale = {
  en: string;
  es: string;
};

export const locale: Locale = {
  en: "English",
  es: "Spanish",
};

export type RequiredLocales = Record<keyof Locale, string>;

const DEFAULT_LOCALE = "en";

export const getLocale = (): keyof Locale => {
  const userLocale =
    navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE;

  // locale to lowercase, handle cases like "pt-BR", "es-419", "en-US-u-va-posix"
  const lowercaseLocale = new Intl.Locale(
    userLocale,
  ).language.toLowerCase() as keyof Locale;

  // dynamic fetch of locale keys as array
  const validLocales = Object.keys(locale).map((key) =>
    key.toLowerCase(),
  ) as Array<keyof Locale>;

  // is lowercased userLocale supported? if not, default to DEFAULT_LOCALE
  return validLocales.includes(lowercaseLocale)
    ? lowercaseLocale
    : DEFAULT_LOCALE;
};
