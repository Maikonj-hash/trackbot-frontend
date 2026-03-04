import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { CircleStop } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function EndNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-[200px] flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-red-500 ring-1 ring-red-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 bg-muted-foreground" />

            <div className="flex items-center justify-center gap-2 bg-red-500/10 px-3 py-3">
                <CircleStop className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-red-500 tracking-wider uppercase">
                    Fim do Fluxo
                </span>
            </div>
        </div>
    );
}
