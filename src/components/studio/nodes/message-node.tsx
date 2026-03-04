import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { MessageSquareText } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function MessageNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-emerald-500 ring-1 ring-emerald-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada por cima */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 border-2 bg-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-2 border-b border-border/50">
                <MessageSquareText className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-500 tracking-wider uppercase">
                    Enviar Mensagem
                </span>
            </div>

            <div className="p-3 bg-muted/20">
                <div className="text-sm font-medium leading-relaxed truncate px-1">
                    {data?.content || "Escreva a mensagem..."}
                </div>
            </div>

            {/* Saída por Baixo */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 border-2 bg-emerald-500 border-background"
            />
        </div>
    );
}
