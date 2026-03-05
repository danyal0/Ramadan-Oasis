import Link from "next/link";
import { ReactNode } from "react";

type SiteFrameProps = {
  children: ReactNode;
};

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-10 md:pt-10">
      <header className="mb-12 flex items-center justify-between text-sm text-[var(--muted)]">
        <p className="tracking-[0.08em]">OumNur.com</p>
        <nav className="flex items-center gap-5">
          <Link className="hover:text-[var(--ink)] transition-colors duration-700" href="/">
            Home
          </Link>
          <Link className="hover:text-[var(--ink)] transition-colors duration-700" href="/ramadan-oasis">
            Ramadan Oasis
          </Link>
          <Link className="hover:text-[var(--ink)] transition-colors duration-700" href="/resources">
            Resources
          </Link>
          <Link className="hover:text-[var(--ink)] transition-colors duration-700" href="/login">
            Login
          </Link>
        </nav>
      </header>
      {children}
      <footer className="mt-20 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
        <p>Antonia Alberte — Relational Intelligence Advisor</p>
      </footer>
    </div>
  );
}
