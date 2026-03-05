import { ReactNode } from "react";

type PageSectionProps = {
  id?: string;
  label?: string;
  title: string;
  children: ReactNode;
};

export function PageSection({ id, label, title, children }: PageSectionProps) {
  return (
    <section
      id={id}
      className="fade-in rounded-[1.75rem] border border-[var(--border)] bg-[color:var(--surface)]/85 p-7 shadow-[0_1px_1px_rgba(0,0,0,0.03)] backdrop-blur-sm md:p-10"
    >
      <header className="mb-6 space-y-2 md:mb-8">
        {label ? <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p> : null}
        <h2 className="font-serif-display text-3xl leading-[1.22] tracking-[0.01em] md:text-4xl">{title}</h2>
      </header>
      <div className="space-y-5 text-[1.03rem] leading-[1.95] text-[var(--ink)]/90 md:text-[1.08rem]">{children}</div>
    </section>
  );
}
