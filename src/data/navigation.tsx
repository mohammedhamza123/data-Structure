import type { ReactNode } from "react";
import { useLang } from "../i18n";

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

export function useNavSections(): NavSection[] {
  const { t } = useLang();
  return [
  {
    title: t("البداية", "Start"),
    items: [
      {
        path: "/",
        label: t("الرئيسية", "Home"),
        description: t("نظرة عامة على المنصة", "Overview of the platform"),
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
    title: t("هياكل البيانات", "Data Structures"),
    items: [
      {
        path: "/matrices",
        label: t("المصفوفات", "Arrays & Matrices"),
        description: t("1D و 2D · عكس، جمع صفوف، قطر", "1D & 2D · reverse, row sums, diagonal"),
        available: true,
        badge: t("تفاعلي", "Interactive"),
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        path: "/linked-list",
        label: t("القوائم المرتبطة", "Linked Lists"),
        description: t("إضافة، حذف، بحث, وعكس", "Insert, delete, search, reverse"),
        available: true,
        badge: t("تفاعلي", "Interactive"),
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
        label: t("المكدس (Stack)", "Stack"),
        description: "LIFO · push / pop / peek",
        available: true,
        badge: t("تفاعلي", "Interactive"),
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
        label: t("الطابور (Queue)", "Queue"),
        description: t("FIFO · خطي ودائري", "FIFO · linear & circular"),
        available: true,
        badge: t("تفاعلي", "Interactive"),
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
        label: t("الأشجار الثنائية", "Binary Trees"),
        description: t("BST، الكومة، و Heap Sort", "BST, Heap & Heap Sort"),
        available: true,
        badge: t("تفاعلي", "Interactive"),
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
    title: t("الخوارزميات", "Algorithms"),
    items: [
      {
        path: "/sorting",
        label: t("خوارزميات الترتيب", "Sorting Algorithms"),
        description: "Bubble, Quick, Merge...",
        available: true,
        badge: t("تفاعلي", "Interactive"),
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18h4V8H4zM10 18h4V4h-4zM16 18h4v-7h-4z" />
          </svg>
        ),
      },
      {
        path: "/binary-search",
        label: t("البحث الثنائي", "Binary Search"),
        description: t("بحث لوغاريتمي على مصفوفة مرتّبة", "Logarithmic search on a sorted array"),
        available: true,
        badge: t("تفاعلي", "Interactive"),
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
            <path d="M8 11h6" />
          </svg>
        ),
      },
      {
        path: "/recursion",
        label: t("الاستدعاء الذاتي", "Recursion"),
        description: t("جميع حالات Recursion", "All recursion cases"),
        available: true,
        badge: t("تفاعلي", "Interactive"),
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
    title: t("أساسيات C++", "C++ Basics"),
    items: [
      {
        path: "/cpp/pointers",
        label: t("المؤشرات", "Pointers"),
        description: t("& و * و nullptr · تمرير بالمؤشر", "& and * and nullptr · pass by pointer"),
        available: true,
        badge: "C++",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
      {
        path: "/cpp/struct",
        label: t("struct", "struct"),
        description: t("تجميع البيانات · . و ->", "Group data · . and ->"),
        available: true,
        badge: "C++",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 3v18" />
          </svg>
        ),
      },
      {
        path: "/cpp/functions",
        label: t("الدوال", "Functions"),
        description: t("تعريف · تمرير · void · scope", "Define · pass · void · scope"),
        available: true,
        badge: "C++",
        icon: (
          <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h6l2 3h8" />
            <path d="M4 17h6l2-3h8" />
          </svg>
        ),
      },
    ],
  },
  {
    title: t("التحليل", "Analysis"),
    items: [
      {
        path: "/complexity",
        label: t("التعقيد الزمني", "Time Complexity"),
        description: t("تحليل Big-O تفاعلي", "Interactive Big-O analysis"),
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
}
