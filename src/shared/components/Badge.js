"use client";

import { cn } from "@/shared/utils/cn";

const variants = {
  default: "bg-[#F5F5F5] text-black border-2 border-black",
  primary: "bg-[#E56A4A] text-black border-2 border-black",
  success: "bg-[#10B981] text-black border-2 border-black",
  warning: "bg-[#FBBF24] text-black border-2 border-black",
  error: "bg-[#DC2626] text-white border-2 border-black",
  info: "bg-[#3B82F6] text-white border-2 border-black",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  icon,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-none font-bold shadow-[2px_2px_0px_#000000]",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-yellow-500",
            variant === "error" && "bg-red-500",
            variant === "info" && "bg-blue-500",
            variant === "primary" && "bg-brand-500",
            variant === "default" && "bg-gray-500"
          )}
        />
      )}
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </span>
  );
}
