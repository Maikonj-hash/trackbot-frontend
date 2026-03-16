import { Position, NodeProps, Node } from "@xyflow/react";
import { CircleStop } from "lucide-react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function EndNode({ id, data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer
            selected={selected}
            color="red"
        >
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader 
                icon={CircleStop} 
                label={data.label || "END FLOW"} 
                color="rose" 
                onLabelChange={(newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })}
            />
        </NodeContainer>
    );
}
