import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Split } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function ConditionNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const variable = data?.conditionVariable || "{{variável}}";

    let operatorSymbol = "=";
    switch (data?.conditionOperator) {
        case "EQUALS": operatorSymbol = "="; break;
        case "NOT_EQUALS": operatorSymbol = "!="; break;
        case "CONTAINS": operatorSymbol = "contém"; break;
        case "IS_EMPTY": operatorSymbol = "vazio"; break;
        case "IS_NOT_EMPTY": operatorSymbol = "preenchido"; break;
    }

    const val = data?.conditionValue !== undefined && data?.conditionValue !== "" ? `'${data.conditionValue}'` : "'valor'";

    const displayText = data?.conditionOperator === "IS_EMPTY" || data?.conditionOperator === "IS_NOT_EMPTY"
        ? `Se ${variable} é ${operatorSymbol}`
        : `Se ${variable} ${operatorSymbol} ${val}`;

    return (
        <div className={clsx(
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-amber-500 ring-1 ring-amber-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada (Apenas 1 por cima) */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <Split className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-mono font-bold text-amber-500 tracking-widest uppercase">
                    CONDITION
                </span>
            </div>

            <div className="p-3 bg-card space-y-2">
                <div className="text-[11px] font-medium text-foreground/80 py-1.5 px-2 bg-muted/30 border border-border/50 rounded-md text-center truncate">
                    {displayText}
                </div>
            </div>

            {/* Portas Lógicas de Referência Industrial */}
            <div className="flex w-full border-t border-border/50 bg-muted/5 rounded-b-md">
                {/* Porta True */}
                <div className="flex-1 flex flex-col items-center justify-center py-2 border-r border-border/50 relative group hover:bg-emerald-500/5 transition-colors">
                    <span className="text-[9px] font-mono tracking-widest text-emerald-600/80 dark:text-emerald-500/80 uppercase">True</span>
                    <Handle
                        type="source"
                        id="true"
                        position={Position.Bottom}
                        className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-emerald-500"
                        style={{ bottom: '-4px' }}
                    />
                </div>

                {/* Porta False */}
                <div className="flex-1 flex flex-col items-center justify-center py-2 relative group hover:bg-red-500/5 transition-colors">
                    <span className="text-[9px] font-mono tracking-widest text-red-600/80 dark:text-red-500/80 uppercase">False</span>
                    <Handle
                        type="source"
                        id="false"
                        position={Position.Bottom}
                        className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-red-500"
                        style={{ bottom: '-4px' }}
                    />
                </div>
            </div>
        </div>
    );
}
