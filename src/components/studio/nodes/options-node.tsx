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
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-blue-500 ring-1 ring-blue-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada (Topo) */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground"
            />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <ListOrdered className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-mono font-bold text-blue-500 tracking-widest uppercase">
                    OPTIONS MENU
                </span>
            </div>

            <div className="p-3 bg-card pb-1">
                <div className="text-xs font-medium leading-relaxed truncate px-1 text-foreground/80">
                    {data?.content || "Escolha uma das opções:"}
                </div>
            </div>

            {/* Renderizador de Saídas Múltiplas Dinâmicas */}
            <div className="flex flex-col gap-1.5 p-3 bg-card pb-4 relative">
                {menuOptions.map((opt, index) => (
                    <div key={index} className="relative w-full">
                        <div className="text-[11px] font-medium text-foreground py-1.5 px-3 bg-muted/20 border border-border/40 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] truncate flex items-center gap-2 group hover:border-blue-500/30 hover:bg-muted/40 transition-colors">
                            <span className="text-[9px] font-mono text-muted-foreground/50 pr-2 border-r border-border/50 flex-shrink-0">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{opt}</span>
                        </div>

                        {/* Aresta (Handle) Conectada Diretamente na Opção correspondente (Eixo Direito X) */}
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={`option_${index}`}
                            style={{ top: '50%', right: '-4px' }}
                            className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-blue-500"
                        />
                    </div>
                ))}
            </div>

            {/* Saída de Fallback caso o cara digite uma Opção inválida no Whats */}
            <div className="h-3 bg-muted/10 border-t border-border/50 relative w-full rounded-b-md">
                <Handle
                    type="source"
                    id="fallback"
                    position={Position.Bottom}
                    className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground absolute left-1/2 -translate-x-1/2"
                    style={{ bottom: '-4px' }}
                />
            </div>
        </div>
    );
}
