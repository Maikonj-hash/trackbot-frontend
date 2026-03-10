import { ReactNode } from "react";
import { clsx } from "clsx";

interface NodeContainerProps {
    children: ReactNode;
    selected?: boolean;
    color?: string;
    className?: string;
}

const colorMap: Record<string, string> = {
    emerald: "border-blue-600 ring-blue-600",
    blue: "border-blue-500 ring-blue-500",
    red: "border-red-500 ring-red-500",
    violet: "border-violet-500 ring-violet-500",
    slate: "border-slate-400 ring-slate-400",
    pink: "border-pink-500 ring-pink-500",
    cyan: "border-cyan-500 ring-cyan-500",
    fuchsia: "border-fuchsia-500 ring-fuchsia-500",
    rose: "border-rose-500 ring-rose-500",
    foreground: "border-foreground ring-foreground",
};

export function NodeContainer({ children, selected, color = "foreground", className }: NodeContainerProps) {
    const activeColorClass = colorMap[color] || colorMap.foreground;

    return (
        <div className={clsx(
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? `${activeColorClass} ring-1` : "hover:border-foreground/30",
            className
        )}>
            {children}
        </div>
    );
}
