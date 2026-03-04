import { Position, NodeProps, Node } from "@xyflow/react";
import { ListOrdered } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function OptionsNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    // Blindagem Cirúrgica: Garantir que sempre haja um array, mesmo que vazio
    const rawOptions = Array.isArray(data?.options) ? data.options : [];
    const menuOptions = rawOptions.length > 0 ? rawOptions : ["Sim", "Não"];

    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader
                icon={ListOrdered}
                label="OPTIONS MENU"
                color="blue"
                badge={data.useNativeButtons ? "ELITE" : undefined}
            />

            <div className="p-3 bg-card pb-1">
                <div className="text-xs font-medium leading-relaxed truncate px-1 text-foreground/80">
                    {data?.content || "Escolha uma das opções:"}
                </div>
            </div>

            <div className="flex flex-col gap-1.5 p-3 bg-card pb-4 relative max-h-[300px] overflow-y-auto custom-scrollbar">
                {menuOptions.map((opt, index) => (
                    <div key={`${index}-${opt}`} className="relative w-full">
                        <div className="text-[11px] font-medium text-foreground py-1.5 px-3 bg-muted/20 border border-border/40 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] truncate flex items-center gap-2 group hover:border-blue-500/30 hover:bg-muted/40 transition-colors">
                            <span className="text-[9px] font-mono text-muted-foreground/50 pr-2 border-r border-border/50 flex-shrink-0">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{opt || "Nova Opção"}</span>
                        </div>

                        <NodeHandle
                            type="source"
                            position={Position.Right}
                            id={`option_${index}`}
                            style={{ top: '50%', right: '-4px' }}
                            color="blue"
                        />
                    </div>
                ))}
            </div>

            <div className="h-4 bg-muted/10 border-t border-border/50 relative w-full rounded-b-md flex items-center justify-center">
                <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-tighter">Fallback Path</span>
                <NodeHandle
                    type="source"
                    id="fallback"
                    position={Position.Bottom}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ bottom: '-4px' }}
                    color="muted"
                />
            </div>
        </NodeContainer>
    );
}
