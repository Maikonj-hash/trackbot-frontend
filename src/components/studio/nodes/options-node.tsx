import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { ListOrdered } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function OptionsNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    // Mock inicial caso a caixa seja arrastada e não tenha dados ainda
    const menuOptions = data?.options && data.options.length > 0
        ? data.options
        : ["Sim", "Não"];

    return (
        <div className={clsx(
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-blue-500 ring-1 ring-blue-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada (Topo) */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 border-2 bg-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-2 border-b border-border/50">
                <ListOrdered className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-500 tracking-wider uppercase">
                    Menu de Opções
                </span>
            </div>

            <div className="p-3 bg-muted/20 pb-0">
                <div className="text-sm font-medium leading-relaxed truncate px-1">
                    {data?.content || "Escolha uma das opções:"}
                </div>
            </div>

            {/* Renderizador de Saídas Múltiplas Dinâmicas */}
            <div className="flex flex-col gap-1 p-3 bg-muted/20 pb-4 relative">
                {menuOptions.map((opt, index) => (
                    <div key={index} className="relative w-full">
                        <div className="text-xs font-medium text-foreground py-1.5 px-3 bg-background border border-border rounded-md shadow-sm truncate flex justify-between items-center group">
                            <span className="truncate">{opt}</span>
                        </div>

                        {/* Aresta (Handle) Conectada Diretamente na Opção correspondente (Eixo Direito X) */}
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={`option_${index}`}
                            style={{ top: '50%', right: '-5px' }}
                            className="w-3 h-3 border-2 bg-blue-500 border-background"
                        />
                    </div>
                ))}
            </div>

            {/* Saída de Fallback caso o cara digite uma Opção inválida no Whats */}
            <div className="flex justify-between items-center p-2 bg-card border-t border-border/50 relative px-4">
                <div className="flex items-center gap-1.5 flex-col relative top-1 mx-auto">
                    <span className="text-[10px] font-bold text-muted-foreground">Erro / Outra Opção</span>
                    <Handle
                        type="source"
                        id="fallback"
                        position={Position.Bottom}
                        className="w-3 h-3 border-2 bg-muted-foreground border-background relative transform-none left-0 bottom-[-6px]"
                    />
                </div>
            </div>

        </div>
    );
}
