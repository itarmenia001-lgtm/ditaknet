import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "amber" | "gray" | "red";

const toneClasses: Record<Tone, string> = {
  blue: "bg-[#e7f1fb] text-[#135b94]",
  green: "bg-[#e3f7ee] text-[#117a58]",
  amber: "bg-[#fff3d4] text-[#8a5b00]",
  gray: "bg-[#eef2f5] text-[#4b5c68]",
  red: "bg-[#fde8df] text-[#9a3412]"
};

export function Badge({
  tone = "gray",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
}) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", toneClasses[tone], className)}
      {...props}
    />
  );
}
