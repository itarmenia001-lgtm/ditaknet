import Image from "next/image";
import Link from "next/link";

const SIZES = {
  sm: 36,
  md: 52,
  lg: 72,
  hero: 112
} as const;

type BrandLogoProps = {
  brandName: string;
  href?: string;
  size?: keyof typeof SIZES;
  showName?: boolean;
  animated?: boolean;
  className?: string;
};

export function BrandLogo({
  brandName,
  href,
  size = "sm",
  showName = true,
  animated = false,
  className = ""
}: BrandLogoProps) {
  const px = SIZES[size];
  const image = (
    <Image
      src="/images/logo.png"
      alt={brandName}
      width={px}
      height={px}
      priority={size === "hero"}
      className={`brand-logo-img ${animated ? "brand-logo-img--animated" : ""}`}
    />
  );

  const inner = (
    <>
      {image}
      {showName ? <span className="brand-logo-text truncate text-lg font-bold">{brandName}</span> : null}
    </>
  );

  const wrapClass = `brand-logo ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={`${wrapClass} brand-logo-link`}>
        {inner}
      </Link>
    );
  }

  return <div className={wrapClass}>{inner}</div>;
}
