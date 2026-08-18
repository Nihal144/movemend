"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const TABS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "/",
    label: "Today",
    icon: <path d="M4 11 L12 4 L20 11 V20 H4 Z" />,
  },
  {
    href: "/saved",
    label: "Saved",
    icon: <path d="M7 4 H17 V20 L12 16 L7 20 Z" />,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: <path d="M6 20 V12 M12 20 V6 M18 20 V15" />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M4 19 a5 5 0 0 1 10 0 M15 19 a4.5 4.5 0 0 1 5 0" />
      </>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 border-t border-hairline bg-canvas/85 backdrop-blur-md">
      <ul className="mx-auto flex w-full max-w-md items-center justify-around px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
                className={`grid size-12 place-items-center rounded-2xl transition ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6 fill-none stroke-current"
                  strokeWidth={active ? 2.4 : 1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {tab.icon}
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
