import { Handle, HandleProps, Position } from "@xyflow/react";
import { clsx } from "clsx";

interface NodeHandleProps extends HandleProps {
    color?: string;
}

const handleColorMap: Record<string, string> = {
    emerald: "bg-emerald-500 border-emerald-600",
    blue: "bg-blue-500 border-blue-600",
    red: "bg-red-500 border-red-600",
    violet: "bg-violet-500 border-violet-600",
    fuchsia: "bg-fuchsia-500 border-fuchsia-600",
    pink: "bg-pink-500 border-pink-600",
    cyan: "bg-cyan-500 border-cyan-600",
    rose: "bg-rose-500 border-rose-600",
    muted: "bg-muted-foreground/40 border-muted-foreground/50",
};

export function NodeHandle({ color = "muted", className, ...props }: NodeHandleProps) {
    const colorClass = handleColorMap[color] || handleColorMap.muted;

    return (
        <Handle
            {...props}
            className={clsx(
                "!w-1.5 !h-1.5 !border-[0.5px] !rounded-full transition-colors z-10",
                colorClass,
                className
            )}
        />
    );
}
