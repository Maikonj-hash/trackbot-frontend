import { Position, NodeProps, Node } from "@xyflow/react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { PlayCircle } from "lucide-react";
import { NodeHeader } from "./base/node-header";
import { NodeContainer } from "./base/node-container";
import { NodeHandle } from "./base/node-handle";

export function StartNode({ id, data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer
            selected={selected}
            color="emerald"
        >
            <NodeHeader 
                icon={PlayCircle} 
                label={data.label || "START PROCESS"} 
                color="emerald" 
                onLabelChange={(newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })}
            />
            <div className="flex items-center gap-2 px-3 py-1.5 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">Entry Point</span>
            </div>

            <NodeHandle type="source" position={Position.Bottom} color="foreground" />
        </NodeContainer>
    );
}
