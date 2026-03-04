import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function DelayNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-52 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-slate-400 ring-1 ring-slate-400" : "hover:border-foreground/30"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground" />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">
                    DELAY
                </span>
            </div>

            <div className="p-3 bg-card text-center">
                <div className="text-[11px] font-mono font-medium leading-relaxed px-1 text-foreground/80 bg-muted/30 border border-border/50 rounded-md py-1">
                    {data?.delayMs ? `${data.delayMs} ms` : "3000 ms"}
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-slate-400" />
        </div>
    );
}
