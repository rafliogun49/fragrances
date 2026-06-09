import { createContext, useContext, useState } from 'react';
import type { Lang } from './personas';

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextValue>({ lang: 'id', setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('hmns_lang') as Lang | null) ?? 'id'
  );

  function setLang(l: Lang) {
    localStorage.setItem('hmns_lang', l);
    setLangState(l);
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
