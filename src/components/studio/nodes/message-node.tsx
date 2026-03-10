import { Position, NodeProps, Node } from "@xyflow/react";
import { MessageSquareText } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";

export function MessageNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={MessageSquareText} label="SEND MESSAGE" color="blue" allowBack={data.allowBack} />

            <NodeBody className="text-left">
                {data?.content || "Sua mensagem aqui..."}
            </NodeBody>

            <NodeHandle type="source" position={Position.Bottom} color="blue" />
        </NodeContainer>
    );
}
