import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Globe } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function WebhookNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-cyan-500 ring-1 ring-cyan-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground" />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <Globe className="w-3 h-3 text-cyan-500" />
                <span className="text-[10px] font-mono font-bold text-cyan-500 tracking-widest uppercase">
                    WEBHOOK API
                </span>
            </div>

            <div className="p-3 bg-card">
                <div className="flex items-center gap-2 bg-muted/20 border border-border/50 rounded p-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 uppercase tracking-widest border border-cyan-500/20">
                        {data?.webhookMethod || "POST"}
                    </span>
                    <span className="text-[10px] font-medium leading-relaxed truncate text-foreground/80">
                        {data?.content || "https://api.exemplo.com"}
                    </span>
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-cyan-500" />
        </div>
    );
}
