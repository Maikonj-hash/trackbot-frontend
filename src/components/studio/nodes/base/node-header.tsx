import { LucideIcon, Undo2, Zap, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import { useState, useRef, useEffect } from "react";
import { useInlineRename } from "@/hooks/use-inline-rename";

interface NodeHeaderProps {
    icon?: LucideIcon;
    label: string;
    color?: string;
    badge?: string;
    allowBack?: boolean;
    skipEnabled?: boolean;
    onLabelChange?: (newLabel: string) => void;
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

export function NodeHeader({ icon: Icon, label, color = "foreground", badge, allowBack, skipEnabled, onLabelChange }: NodeHeaderProps) {
    const {
        isEditing,
        setIsEditing,
        tempLabel,
        setTempLabel,
        inputRef,
        handleSave,
        handleCancel
    } = useInlineRename({
        initialLabel: label,
        onSave: (newLabel) => onLabelChange?.(newLabel)
    });

    const textColorClass = textColorMap[color] || textColorMap.foreground;
    const badgeClass = badgeColorMap[color] || badgeColorMap.blue;

    return (
        <div className="flex items-center justify-between bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md w-full group/header">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
                {Icon && <Icon className={clsx("w-3 h-3 shrink-0", textColorClass)} />}
                
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        className="bg-background/50 border border-blue-500/50 rounded px-1 py-0 text-[10px] font-mono font-bold tracking-widest uppercase w-full outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                ) : (
                    <div 
                        className="flex items-center gap-1.5 cursor-text min-w-0 flex-1"
                        onClick={() => onLabelChange && setIsEditing(true)}
                    >
                        <span className={clsx("text-[10px] font-mono font-bold tracking-widest uppercase truncate", textColorClass)}>
                            {label || "UNTITLED BLOCK"}
                        </span>
                        {onLabelChange && (
                            <Edit2 className="w-2.5 h-2.5 text-muted-foreground/30 opacity-0 group-hover/header:opacity-100 transition-opacity shrink-0" />
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {allowBack && (
                    <div className="flex items-center px-1 rounded bg-blue-500/10 border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)]" title="Voltar (Undo) Habilitado">
                        <Undo2 className="w-2.5 h-2.5 text-blue-500" />
                    </div>
                )}
                {skipEnabled && (
                    <div className="flex items-center px-1 rounded bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]" title="Salto Inteligente (Skip) Habilitado">
                        <Zap className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500/20" />
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
