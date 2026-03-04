import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Headset } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function HandoverNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-rose-500 ring-1 ring-rose-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 bg-muted-foreground" />

            <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-2 border-b border-border/50">
                <Headset className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-semibold text-rose-500 tracking-wider uppercase">
                    Atendimento Humano
                </span>
            </div>

            <div className="p-3 bg-muted/20 text-center">
                <div className="text-xs font-medium text-foreground py-1 px-2 border border-rose-500/20 bg-rose-500/5 rounded-md text-center">
                    Transferir para: {data?.content || "Qualquer Atendente"}
                </div>
            </div>

            {/* Não tem Handle de Saída padrão, pois a automação Para e o humano assume. */}
        </div>
    );
}
