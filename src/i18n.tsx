import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";

type I18nValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Pick the string matching the current language. */
  t: (ar: string, en: string) => string;
};

const STORAGE_KEY = "site-lang";

const I18nContext = createContext<I18nValue | null>(null);

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "ar";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" ? "en" : "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "ar" ? "en" : "ar")),
    []
  );

  // Keyboard shortcut: press "L" to toggle the language.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key !== "l" && e.key !== "L") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const t = useCallback(
    (ar: string, en: string) => (lang === "ar" ? ar : en),
    [lang]
  );

  const value = useMemo<I18nValue>(
    () => ({ lang, dir, setLang, toggle, t }),
    [lang, dir, setLang, toggle, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLang(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
