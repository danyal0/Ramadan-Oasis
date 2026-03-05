import Link from "next/link";
import { ReactNode } from "react";

type SiteFrameProps = {
  children: ReactNode;
};

export function SiteFrame({ children }: SiteFrameProps) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/offerings", label: "Offerings" },
    { href: "/ramadan-oasis", label: "Ramadan Oasis" },
    { href: "/community", label: "Community" },
    { href: "/recordings", label: "Recordings" },
    { href: "/resources", label: "Resources" },
    { href: "/login", label: "Login" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-10 md:pt-10">
      <header className="mb-12 text-sm text-[var(--muted)]">
        <div className="flex items-center justify-between gap-4">
          <p className="tracking-[0.08em]">OumNur.com</p>
          <nav className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} className="transition-colors duration-700 hover:text-[var(--ink)]" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 text-xs md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center transition-colors duration-700 hover:text-[var(--ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="mt-20 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
        <p>Antonia Alberte — Relational Intelligence Advisor</p>
        <p className="mt-1">Copyright 2026 OumNur. All rights reserved.</p>
      </footer>
    </div>
  );
}
