import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Keyboard, Variable } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function InputNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-violet-500 ring-1 ring-violet-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada (Apenas 1 por cima) */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <Keyboard className="w-3 h-3 text-violet-500" />
                <span className="text-[10px] font-mono font-bold text-violet-500 tracking-widest uppercase">
                    INPUT
                </span>
            </div>

            <div className="p-3 bg-card pb-2">
                <div className="text-xs font-medium leading-relaxed truncate px-1 text-foreground/80">
                    {data?.content || "Escreva a pergunta..."}
                </div>
            </div>

            {/* Fundo do Card com o local de Variavel Alvo */}
            <div className="flex flex-col items-center p-3 bg-muted/10 border-t border-border/50 relative rounded-b-md">
                <div className="flex w-full items-center gap-2 border border-border/50 bg-card px-2 py-1.5 rounded-md text-muted-foreground justify-center shadow-sm">
                    <Variable className="w-3 h-3 text-violet-500/70" />
                    <span className="text-[10px] font-mono tracking-wider">{data?.variableName || "{{ variavel }}"}</span>
                </div>

                <Handle
                    type="source"
                    id="next"
                    position={Position.Bottom}
                    className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-violet-500"
                    style={{ bottom: '-4px' }}
                />
            </div>
        </div>
    );
}
