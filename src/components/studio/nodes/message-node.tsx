import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { MessageSquareText } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function MessageNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-emerald-500 ring-1 ring-emerald-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada por cima */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <MessageSquareText className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-widest uppercase">
                    SEND MESSAGE
                </span>
            </div>

            <div className="p-3 bg-card">
                <div className="text-xs font-medium leading-relaxed truncate px-1 text-foreground/80">
                    {data?.content || "Escreva a mensagem..."}
                </div>
            </div>

            {/* Saída por Baixo */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-emerald-500"
            />
        </div>
    );
}
