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
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-fuchsia-500 ring-1 ring-fuchsia-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground" />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <Variable className="w-3 h-3 text-fuchsia-500" />
                <span className="text-[10px] font-mono font-bold text-fuchsia-500 tracking-widest uppercase">
                    SET VARIABLE
                </span>
            </div>

            <div className="p-3 bg-card">
                <div className="flex items-center gap-2 text-[11px] bg-muted/20 border border-border/50 rounded py-1.5 px-2">
                    <span className="font-mono text-fuchsia-500 font-bold tracking-wider">{data?.variableName || "score"}</span>
                    <span className="text-muted-foreground font-mono">{actionSymbol}</span>
                    <span className="font-mono text-foreground tracking-wider">{data?.variableValue || "0"}</span>
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-fuchsia-500" />
        </div>
    );
}
