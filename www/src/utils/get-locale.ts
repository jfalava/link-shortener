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
  // is this being called from browser? if not, it will get called again client side
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    return DEFAULT_LOCALE;
  }

  const userLocale =
    navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE;

  try {
    const lowercaseLocale = new Intl.Locale(
      userLocale,
    ).language.toLowerCase() as keyof Locale;

    const validLocales = Object.keys(locale).map((key) =>
      key.toLowerCase(),
    ) as Array<keyof Locale>;

    return validLocales.includes(lowercaseLocale)
      ? lowercaseLocale
      : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
};
