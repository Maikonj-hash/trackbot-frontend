import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function DelayNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-slate-400 ring-1 ring-slate-400" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 bg-muted-foreground" />

            <div className="flex items-center gap-2 bg-slate-400/10 px-3 py-2 border-b border-border/50">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Aguardar (Delay)
                </span>
            </div>

            <div className="p-3 bg-muted/20 text-center">
                <div className="text-sm font-mono font-medium leading-relaxed px-1">
                    {data?.delayMs ? `${data.delayMs} milissegundos` : "3000 milissegundos"}
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 bg-slate-400 border-background" />
        </div>
    );
}
