"use client";

import { cn } from "@/shared/utils/cn";

const variants = {
  primary: "bg-brand-500 hover:bg-brand-600 text-white border-2 border-black disabled:bg-surface-3 disabled:text-text-muted",
  secondary: "bg-white text-black border-2 border-black disabled:opacity-50",
  outline: "bg-white text-black border-2 border-black disabled:opacity-50",
  ghost: "bg-transparent text-black border-2 border-transparent hover:border-black disabled:opacity-50",
  danger: "bg-red-500 text-white border-2 border-black disabled:bg-surface-3 disabled:text-text-muted",
  success: "bg-green-500 text-white border-2 border-black disabled:bg-surface-3 disabled:text-text-muted",
};

const sizes = {
  sm: "h-7 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold rounded-none transition-all duration-100 ease-in-out cursor-pointer",
        "shadow-[4px_4px_0px_#000000]",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000000]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000000] disabled:active:translate-x-0 disabled:active:translate-y-0",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="material-symbols-outlined text-[18px]">{iconRight}</span>
      )}
    </button>
  );
}
