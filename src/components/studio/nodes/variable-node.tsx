import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Variable } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function VariableNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    let actionSymbol = "=";
    if (data?.variableAction === "INCREMENT") actionSymbol = "+=";
    if (data?.variableAction === "DECREMENT") actionSymbol = "-=";

    return (
        <div className={clsx(
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-fuchsia-500 ring-1 ring-fuchsia-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 bg-muted-foreground" />

            <div className="flex items-center gap-2 bg-fuchsia-500/10 px-3 py-2 border-b border-border/50">
                <Variable className="w-4 h-4 text-fuchsia-500" />
                <span className="text-xs font-semibold text-fuchsia-500 tracking-wider uppercase">
                    Definir Variável
                </span>
            </div>

            <div className="p-3 bg-muted/20">
                <div className="flex items-center gap-2 text-sm bg-background border border-border/50 rounded p-1.5 px-2">
                    <span className="font-mono text-fuchsia-500 font-bold">{data?.variableName || "score"}</span>
                    <span className="text-muted-foreground">{actionSymbol}</span>
                    <span className="font-mono text-foreground">{data?.variableValue || "0"}</span>
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 bg-fuchsia-500 border-background" />
        </div>
    );
}
