import 'server-only';

const dictionaries = {
  'pt-BR': () => import('@/dictionaries/pt-BR.json').then((m) => m.default),
  'en-US': () => import('@/dictionaries/en-US.json').then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale => locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
