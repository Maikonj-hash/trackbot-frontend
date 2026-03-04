import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface NodeHeaderProps {
    icon?: LucideIcon; // Tornar opcional para evitar crash
    label: string;
    color?: string;
}

const textColorMap: Record<string, string> = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    red: "text-red-500",
    violet: "text-violet-500",
    slate: "text-slate-400",
    pink: "text-pink-500",
    cyan: "text-cyan-500",
    fuchsia: "text-fuchsia-500",
    rose: "text-rose-500",
    foreground: "text-foreground",
};

export function NodeHeader({ icon: Icon, label, color = "foreground" }: NodeHeaderProps) {
    const textColorClass = textColorMap[color] || textColorMap.foreground;

    return (
        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
            {Icon && <Icon className={clsx("w-3 h-3", textColorClass)} />}
            <span className={clsx("text-[10px] font-mono font-bold tracking-widest uppercase truncate", textColorClass)}>
                {label || "UNTITLED BLOCK"}
            </span>
        </div>
    );
}
