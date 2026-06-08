import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavSections } from "../data/navigation";
import { useLang } from "../i18n";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: Props) {
  const { t, dir } = useLang();
  const navSections = useNavSections();
  const side = dir === "rtl" ? "right-0 border-l" : "left-0 border-r";
  const closedShift = dir === "rtl" ? "translate-x-full" : "-translate-x-full";
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 ${side} z-40 flex w-72 flex-col border-border bg-bg-soft/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : `${closedShift} lg:translate-x-0`
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 glow-brand">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="2.5" />
              <circle cx="18" cy="6" r="2.5" />
              <circle cx="12" cy="18" r="2.5" />
              <path d="M7.5 7.5 11 15M16.5 7.5 13 15M8.5 6h7" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold text-white">{t("خوارزميات", "Algorithms")}</div>
            <div className="text-xs text-slate-400">{t("هياكل البيانات التفاعلية", "Interactive Data Structures")}</div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.available ? item.path : "#"}
                    onClick={(e) => {
                      if (!item.available) e.preventDefault();
                      else onClose();
                    }}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                        !item.available
                          ? "cursor-not-allowed opacity-50"
                          : isActive
                            ? "bg-brand-500/15 text-white"
                            : "text-slate-300 hover:bg-surface hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && item.available && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute right-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-400 to-accent-400"
                          />
                        )}
                        <span className={isActive && item.available ? "text-brand-300" : "text-slate-400 group-hover:text-brand-300"}>
                          {item.icon}
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className="block text-[11px] text-slate-500">{item.description}</span>
                        </span>
                        {item.badge && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              item.available
                                ? "bg-accent-500/15 text-accent-400"
                                : "bg-surface-2 text-slate-500"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-6 py-4 text-center text-[11px] text-slate-500">
          <div>{t("صُمّم بشغف لتعليم الخوارزميات", "Crafted with passion to teach algorithms")}</div>
          <div className="mt-1">
            {t("تطوير", "Developed by")}{" "}
            <a
              href="https://github.com/mohammedhamza123"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-300 transition-colors hover:text-brand-200"
            >
              mohammed_hamza
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
