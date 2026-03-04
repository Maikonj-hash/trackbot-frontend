import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Keyboard, Variable } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function InputNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-violet-500 ring-1 ring-violet-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada (Apenas 1 por cima) */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 border-2 bg-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-violet-500/10 px-3 py-2 border-b border-border/50">
                <Keyboard className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-semibold text-violet-500 tracking-wider uppercase">
                    Aguardar Input Livre
                </span>
            </div>

            <div className="p-3 bg-muted/20 space-y-1 pb-1">
                <div className="text-sm font-medium leading-relaxed truncate px-1">
                    {data?.content || "Escreva a pergunta..."}
                </div>
            </div>

            {/* Fundo do Card com o local de Variavel Alvo */}
            <div className="flex justify-between items-center p-3 bg-card border-t border-border/50 relative">
                <div className="flex w-full items-center gap-2 border border-border/50 bg-background px-2 py-1 rounded-sm text-muted-foreground justify-center">
                    <Variable className="w-3 h-3" />
                    <span className="text-xs font-mono">{data?.variableName || "{{ variavel }}"}</span>
                </div>

                <Handle
                    type="source"
                    id="next"
                    position={Position.Bottom}
                    className="w-3 h-3 border-2 bg-violet-500 border-background relative transform-none left-0 bottom-[-16px]"
                />
            </div>
        </div>
    );
}
