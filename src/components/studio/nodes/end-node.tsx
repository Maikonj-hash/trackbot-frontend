import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { CircleStop } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function EndNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-md border border-border/50 shadow-sm transition-all bg-card min-w-[140px] justify-center",
            selected ? "border-red-500 ring-1 ring-red-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground" />

            <CircleStop className="w-3 h-3 text-red-500" />
            <span className="text-[10px] font-mono font-bold text-red-500 tracking-widest uppercase mt-0.5">
                END PROCESS
            </span>
        </div>
    );
}
