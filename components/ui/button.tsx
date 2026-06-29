import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--brand)] text-white shadow-sm hover:bg-[var(--brand-dark)]",
  secondary: "bg-[var(--accent)] text-white shadow-sm hover:bg-[#12845f]",
  outline: "border border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--brand)] hover:text-[var(--brand)]",
  ghost: "text-[var(--muted)] hover:bg-[#eaf2f5] hover:text-[var(--foreground)]",
  danger: "bg-[var(--danger)] text-white hover:bg-[#9a3412]"
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={buttonClassName({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClassName({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
