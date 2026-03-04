import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Globe } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function WebhookNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-cyan-500 ring-1 ring-cyan-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 bg-muted-foreground" />

            <div className="flex items-center gap-2 bg-cyan-500/10 px-3 py-2 border-b border-border/50">
                <Globe className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-semibold text-cyan-500 tracking-wider uppercase">
                    Webhook (API)
                </span>
            </div>

            <div className="p-3 bg-muted/20">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-500 uppercase">
                        {data?.webhookMethod || "POST"}
                    </span>
                    <span className="text-xs font-medium leading-relaxed truncate text-muted-foreground">
                        {data?.content || "https://api.exemplo.com"}
                    </span>
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 bg-cyan-500 border-background" />
        </div>
    );
}
