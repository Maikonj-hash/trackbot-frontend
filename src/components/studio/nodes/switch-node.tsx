import { Position, NodeProps, Node } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";

export function SwitchNode({ id, data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const rawBranches = Array.isArray(data?.switchBranches) ? data.switchBranches : [];

    return (
        <NodeContainer selected={selected} color="purple">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader
                icon={GitBranch}
                label={data.label || "SWITCH ROUTER"}
                color="purple"
                onLabelChange={(newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })}
            />

            <NodeBody className="pb-1">
                Eval: <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{data?.switchVariable || "???"}</span>
            </NodeBody>

            <div className="flex flex-col gap-1.5 p-3 bg-card pb-4 relative custom-scrollbar">
                {rawBranches.map((branch, index) => (
                    <div key={branch.id || index} className="relative w-full">
                        <div className="text-[11px] font-medium text-foreground py-1.5 px-3 bg-muted/20 border border-border/40 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-2 group hover:border-purple-500/30 hover:bg-muted/40 transition-colors">
                            <span className="text-[9px] font-mono text-muted-foreground/50 pr-2 border-r border-border/50 flex-shrink-0">
                                CASE
                            </span>
                            <span className="whitespace-pre-wrap break-words group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {branch.value || "Vazio"}
                            </span>
                        </div>

                        <NodeHandle
                            type="source"
                            position={Position.Right}
                            id={branch.id}
                            style={{ top: '50%', right: '-4px' }}
                            color="purple"
                        />
                    </div>
                ))}

                {rawBranches.length === 0 && (
                    <div className="text-[10px] text-muted-foreground italic text-center py-2 opacity-50">
                        Nenhuma rota definida
                    </div>
                )}
            </div>

            <div className="h-4 bg-muted/10 border-t border-border/50 relative w-full rounded-b-md flex items-center justify-center">
                <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-tighter">Default Fallback</span>
                <NodeHandle
                    type="source"
                    id="default"
                    position={Position.Bottom}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ bottom: '-4px' }}
                    color="muted"
                />
            </div>
        </NodeContainer>
    );
}
