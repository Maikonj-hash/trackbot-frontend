import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function StartNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md border shadow-sm transition-all bg-card",
            selected ? "border-foreground ring-1 ring-foreground" : "border-border hover:border-foreground/50"
        )}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-foreground tracking-widest uppercase">
                START PROCESS
            </span>

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-foreground"
            />
        </div>
    );
}
