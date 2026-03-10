import { LucideIcon, Undo2 } from "lucide-react";
import { clsx } from "clsx";

interface NodeHeaderProps {
    icon?: LucideIcon;
    label: string;
    color?: string;
    badge?: string;
    allowBack?: boolean;
}

const textColorMap: Record<string, string> = {
    emerald: "text-blue-600",
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

const badgeColorMap: Record<string, string> = {
    emerald: "bg-blue-600/10 text-blue-600 border-blue-600/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    pink: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

export function NodeHeader({ icon: Icon, label, color = "foreground", badge, allowBack }: NodeHeaderProps) {
    const textColorClass = textColorMap[color] || textColorMap.foreground;
    const badgeClass = badgeColorMap[color] || badgeColorMap.blue;

    return (
        <div className="flex items-center justify-between bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md w-full">
            <div className="flex items-center gap-2 overflow-hidden">
                {Icon && <Icon className={clsx("w-3 h-3", textColorClass)} />}
                <span className={clsx("text-[10px] font-mono font-bold tracking-widest uppercase truncate", textColorClass)}>
                    {label || "UNTITLED BLOCK"}
                </span>
            </div>
            
            <div className="flex items-center gap-1.5">
                {allowBack && (
                    <div className="flex items-center px-1 rounded bg-blue-500/10 border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)]" title="Voltar (Undo) Habilitado">
                        <Undo2 className="w-2.5 h-2.5 text-blue-500" />
                    </div>
                )}
                {badge && (
                    <span className={clsx("text-[8px] font-bold px-1.5 py-0.5 rounded-sm border", badgeClass)}>
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}
