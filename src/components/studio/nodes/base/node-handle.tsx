import { Handle, HandleProps, Position } from "@xyflow/react";
import { clsx } from "clsx";

interface NodeHandleProps extends HandleProps {
    color?: string;
}

const handleColorMap: Record<string, string> = {
    emerald: "border-emerald-500",
    blue: "border-blue-500",
    red: "border-red-500",
    violet: "border-violet-500",
    fuchsia: "border-fuchsia-500",
    pink: "border-pink-500",
    cyan: "border-cyan-500",
    rose: "border-rose-500",
    muted: "border-muted-foreground/30",
};

export function NodeHandle({ color = "muted", className, ...props }: NodeHandleProps) {
    const colorClass = handleColorMap[color] || handleColorMap.muted;

    return (
        <Handle
            {...props}
            className={clsx(
                "!w-2 !h-2 !bg-background !border-[1px] !rounded-[2px] transition-transform hover:scale-125 z-10",
                colorClass,
                className
            )}
        />
    );
}
