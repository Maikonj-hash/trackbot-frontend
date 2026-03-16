import { Position, NodeProps, Node } from "@xyflow/react";
import { Zap } from "lucide-react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";
import { useShallow } from 'zustand/react/shallow';

export function JumpNode({ id, data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const targetNode = useFlowStore(
        useShallow(s => s.nodes.find(n => n.id === data.targetStepId))
    );

    const targetLabel = targetNode?.data?.label || targetNode?.type || "Nenhum alvo";

    return (
        <NodeContainer selected={selected} color="rose">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader
                icon={Zap}
                label={data.label || "JUMP / SALTO"}
                color="rose"
                onLabelChange={(newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })}
            />

            <NodeBody className="text-left py-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground/60 uppercase font-mono tracking-widest">Target:</span>
                    <div className="px-2 py-1 bg-rose-500/5 border border-rose-500/20 rounded-md">
                        <span className="text-[11px] font-bold text-rose-400 uppercase truncate block">
                            {targetLabel}
                        </span>
                    </div>
                </div>
            </NodeBody>
        </NodeContainer>
    );
}
