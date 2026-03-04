import { Position, NodeProps, Node } from "@xyflow/react";
import { CircleStop } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHandle } from "./base/node-handle";

export function EndNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer
            selected={selected}
            color="red"
            className="flex-row items-center gap-2 px-4 py-2 w-auto"
        >
            <NodeHandle type="target" position={Position.Top} />

            <CircleStop className="w-3 h-3 text-red-500" />
            <span className="text-[10px] font-mono font-bold text-red-500 tracking-widest uppercase mt-0.5">
                END FLOW
            </span>
        </NodeContainer>
    );
}
