import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Headset } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function HandoverNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-rose-500 ring-1 ring-rose-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground" />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <Headset className="w-3 h-3 text-rose-500" />
                <span className="text-[10px] font-mono font-bold text-rose-500 tracking-widest uppercase">
                    HUMAN HANDOVER
                </span>
            </div>

            <div className="p-3 bg-card text-center">
                <div className="text-[10px] font-medium text-foreground py-1.5 px-2 border border-border/50 bg-muted/20 rounded-md text-center">
                    Transferir para: {data?.content || "Qualquer Atendente"}
                </div>
            </div>

            {/* Não tem Handle de Saída padrão, pois a automação Para e o humano assume. */}
        </div>
    );
}
