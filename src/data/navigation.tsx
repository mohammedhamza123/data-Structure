import type { ReactNode } from "react";

export type NavItem = {
  path: string;
  label: string;
  description: string;
  icon: ReactNode;
  badge?: string;
  available: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

const iconClass = "w-5 h-5";

export const navSections: NavSection[] = [
  {
    title: "البداية",
    items: [
      {
        path: "/",
        label: "الرئيسية",
        description: "نظرة عامة على المنصة",
        available: true,
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5 12 3l9 6.5" />
            <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
            <path d="M9 21v-6h6v6" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "هياكل البيانات",
    items: [
      {
        path: "/linked-list",
        label: "القوائم المرتبطة",
        description: "إضافة، حذف، بحث، وعكس",
        available: true,
        badge: "تفاعلي",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="9" width="6" height="6" rx="1.5" />
            <rect x="16" y="9" width="6" height="6" rx="1.5" />
            <path d="M8 12h8" />
            <path d="m13 9 3 3-3 3" />
          </svg>
        ),
      },
      {
        path: "/stack",
        label: "المكدس (Stack)",
        description: "LIFO · push / pop / peek",
        available: true,
        badge: "تفاعلي",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="14" width="16" height="5" rx="1.5" />
            <rect x="4" y="8" width="16" height="5" rx="1.5" />
            <path d="M9 4h6" />
          </svg>
        ),
      },
      {
        path: "/queue",
        label: "الطابور (Queue)",
        description: "FIFO · خطي ودائري",
        available: true,
        badge: "تفاعلي",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="9" width="4" height="6" rx="1" />
            <rect x="10" y="9" width="4" height="6" rx="1" />
            <rect x="17" y="9" width="4" height="6" rx="1" />
          </svg>
        ),
      },
      {
        path: "/trees",
        label: "الأشجار الثنائية",
        description: "BST، الكومة، و Heap Sort",
        available: true,
        badge: "تفاعلي",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="4" r="2" />
            <circle cx="5" cy="13" r="2" />
            <circle cx="19" cy="13" r="2" />
            <circle cx="9" cy="20" r="2" />
            <circle cx="15" cy="20" r="2" />
            <path d="m10.5 5.5-3.8 5.8M13.5 5.5l3.8 5.8M6.4 14.6 7.8 18M17.6 14.6 16.2 18" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "الخوارزميات",
    items: [
      {
        path: "/sorting",
        label: "خوارزميات الترتيب",
        description: "Bubble, Quick, Merge...",
        available: true,
        badge: "تفاعلي",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18h4V8H4zM10 18h4V4h-4zM16 18h4v-7h-4z" />
          </svg>
        ),
      },
      {
        path: "/recursion",
        label: "الاستدعاء الذاتي",
        description: "جميع حالات Recursion",
        available: true,
        badge: "تفاعلي",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9a5 5 0 0 1 5-5h7" />
            <path d="m13 1 3 3-3 3" />
            <path d="M20 15a5 5 0 0 1-5 5H8" />
            <path d="m11 23-3-3 3-3" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "التحليل",
    items: [
      {
        path: "/complexity",
        label: "التعقيد الزمني",
        description: "تحليل Big-O تفاعلي",
        available: true,
        badge: "Big-O",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M3 15c4 0 4-8 8-8s4 5 9-3" />
          </svg>
        ),
      },
    ],
  },
];

export const allNavItems = navSections.flatMap((s) => s.items);
