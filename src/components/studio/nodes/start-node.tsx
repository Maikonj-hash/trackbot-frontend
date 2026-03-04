import { Position, NodeProps, Node } from "@xyflow/react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHandle } from "./base/node-handle";

export function StartNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer
            selected={selected}
            color="foreground"
            className="flex-row items-center gap-2 px-4 py-2 w-auto"
        >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-foreground tracking-widest uppercase">
                START PROCESS
            </span>

            <NodeHandle type="source" position={Position.Bottom} color="foreground" />
        </NodeContainer>
    );
}
