import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { useLang } from "../i18n";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t, lang, toggle, dir } = useLang();
  const mainPad = dir === "rtl" ? "lg:pr-72" : "lg:pl-72";

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 bg-aurora opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`relative ${mainPad}`}>
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-bg/70 px-4 py-3 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-slate-300 lg:hidden"
            aria-label="القائمة"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden items-center gap-2 text-sm text-slate-400 lg:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            {t("منصة تعليمية تفاعلية · إصدار تجريبي", "Interactive learning platform · Beta")}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              title={t("تبديل اللغة (L)", "Toggle language (L)")}
              aria-label={t("تبديل اللغة", "Toggle language")}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-slate-300 transition-colors hover:border-brand-500/50 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
              <span>{lang === "ar" ? "EN" : "ع"}</span>
            </button>

            <a
              href="https://github.com/mohammedhamza123/data-Structure"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-brand-500/50 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
              </svg>
              <span className="hidden sm:inline">{t("المصدر", "Source")}</span>
            </a>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
