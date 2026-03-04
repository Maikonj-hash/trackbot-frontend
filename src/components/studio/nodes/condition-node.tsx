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
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-amber-500 ring-1 ring-amber-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada (Apenas 1 por cima) */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 border-2 bg-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-2 border-b border-border/50">
                <Split className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-500 tracking-wider uppercase">
                    Condição (Lógica)
                </span>
            </div>

            <div className="p-3 bg-muted/20 space-y-2">
                <div className="text-xs font-medium text-foreground py-1 px-2 bg-background border border-border rounded-md text-center">
                    {displayText}
                </div>
            </div>

            {/* Fundo do Card com as duas Saídas (True / False) */}
            <div className="flex justify-between items-center p-2 bg-card border-t border-border/50 relative px-4">
                <div className="flex items-center gap-1.5 flex-col relative top-1">
                    <span className="text-[10px] font-bold text-emerald-500">Verdadeiro</span>
                    <Handle
                        type="source"
                        id="true"
                        position={Position.Bottom}
                        className="w-3 h-3 border-2 bg-emerald-500 border-background relative transform-none left-0 bottom-[-6px]"
                    />
                </div>

                <div className="flex items-center gap-1.5 flex-col relative top-1">
                    <span className="text-[10px] font-bold text-red-500">Falso</span>
                    <Handle
                        type="source"
                        id="false"
                        position={Position.Bottom}
                        className="w-3 h-3 border-2 bg-red-500 border-background relative transform-none left-0 bottom-[-6px]"
                    />
                </div>
            </div>
        </div>
    );
}
