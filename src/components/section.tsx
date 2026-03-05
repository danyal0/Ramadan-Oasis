import { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="rounded-3xl border border-sand-200 bg-white/85 p-6 shadow-sm md:p-8">
      <header className="mb-6 space-y-2">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold text-sand-950 md:text-3xl">{title}</h2>
        {description ? <p className="max-w-3xl text-sand-700">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
