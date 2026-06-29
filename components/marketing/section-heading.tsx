import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-bold text-[var(--foreground)] md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-[var(--muted)]">{description}</p> : null}
      {children}
    </div>
  );
}
