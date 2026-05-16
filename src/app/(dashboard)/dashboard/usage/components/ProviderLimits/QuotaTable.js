"use client";

import { formatResetTime, calculatePercentage } from "./utils";

/**
 * Format reset time display (Today, 12:00 PM)
 */
function formatResetTimeDisplay(resetTime) {
  if (!resetTime) return null;
  
  try {
    const date = new Date(resetTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dayStr = "";
    if (date >= today && date < tomorrow) {
      dayStr = "Today";
    } else if (date >= tomorrow && date < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
      dayStr = "Tomorrow";
    } else {
      dayStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    
    const timeStr = date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
    
    return `${dayStr}, ${timeStr}`;
  } catch {
    return null;
  }
}

/**
 * Get color classes based on remaining percentage
 */
function getColorClasses(remainingPercentage) {
  if (remainingPercentage > 70) {
    return {
      text: "text-green-600",
      bg: "bg-green-500",
      bgLight: "bg-green-500/10",
      emoji: "🟢"
    };
  }
  
  if (remainingPercentage >= 30) {
    return {
      text: "text-yellow-600",
      bg: "bg-yellow-500",
      bgLight: "bg-yellow-500/10",
      emoji: "🟡"
    };
  }
  
  // 0-29% including 0% (out of quota) - show red
  return {
    text: "text-red-600",
    bg: "bg-red-500",
    bgLight: "bg-red-500/10",
    emoji: "🔴"
  };
}

/**
 * Quota Table Component - Table-based display for quota data
 */
export default function QuotaTable({ quotas = [], compact = false }) {
  if (!quotas || quotas.length === 0) {
    return null;
  }

  const cellPad = compact ? "py-1 px-1.5" : "py-2 px-3";
  const nameText = compact ? "text-[11px]" : "text-sm";
  const resetPrimary = compact ? "text-[11px]" : "text-sm";
  const resetSecondary = compact ? "text-[10px] leading-tight" : "text-xs";

  return (
    <div className="overflow-x-auto border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <table className="w-full table-fixed text-left">
        <tbody>
          {quotas.map((quota, index) => {
            const remaining = quota.remainingPercentage !== undefined
              ? Math.round(quota.remainingPercentage)
              : calculatePercentage(quota.used, quota.total);
            
            const colors = getColorClasses(remaining);
            const countdown = formatResetTime(quota.resetAt);
            const resetDisplay = formatResetTimeDisplay(quota.resetAt);

            return (
              <tr 
                key={index}
                className="hover:bg-[#F5F5F5] transition-colors"
              >
                {/* Model Name with Status Emoji */}
                <td className={`${cellPad} w-[30%] border-2 border-black bg-white`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] shrink-0">{colors.emoji}</span>
                    <span className={`${nameText} font-medium text-text-primary truncate`}>
                      {quota.name}
                    </span>
                  </div>
                </td>

                {/* Limit (Progress + Numbers) */}
                <td className={`${cellPad} w-[45%] border-2 border-black bg-white`}>
                  <div className={compact ? "space-y-1" : "space-y-1.5"}>
                    {/* Progress bar - always show with border for visibility */}
                    <div className={`${compact ? "h-1" : "h-1.5"} overflow-hidden border border-black ${colors.bgLight} ${
                      remaining === 0 ? 'border-black' : 'border-black'
                    }`}>
                      <div
                        className={`h-full transition-all duration-300 ${colors.bg}`}
                        style={{ width: `${Math.min(remaining, 100)}%` }}
                      />
                    </div>
                    
                    {/* Numbers */}
                    <div className={`flex items-center justify-between ${compact ? "text-[10px]" : "text-xs"}`}>
                      <span className="text-text-muted">
                        {quota.used.toLocaleString()} / {quota.total > 0 ? quota.total.toLocaleString() : "∞"}
                      </span>
                      <span className={`font-medium ${colors.text}`}>
                        {remaining}%
                      </span>
                    </div>
                  </div>
                </td>

                {/* Reset Time */}
                <td className={`${cellPad} w-[25%] border-2 border-black bg-white`}>
                  {countdown !== "-" || resetDisplay ? (
                    compact ? (
                      <div
                        className={`${resetPrimary} text-text-primary font-medium truncate`}
                        title={resetDisplay || ""}
                      >
                        {countdown !== "-" ? `in ${countdown}` : resetDisplay}
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {countdown !== "-" && (
                          <div className={`${resetPrimary} text-text-primary font-medium`}>
                            in {countdown}
                          </div>
                        )}
                        {resetDisplay && (
                          <div className={`${resetSecondary} text-text-muted`}>
                            {resetDisplay}
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className={`${resetPrimary} text-text-muted italic`}>N/A</div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
