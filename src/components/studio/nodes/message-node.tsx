import { Position, NodeProps, Node } from "@xyflow/react";
import { MessageSquareText } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function MessageNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={MessageSquareText} label="SEND MESSAGE" color="blue" />

            <div className="p-3 bg-card">
                <div className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words px-1 text-foreground/80">
                    {data?.content || "Sua pergunta aqui..."}
                </div>
            </div>

            <NodeHandle type="source" position={Position.Bottom} color="blue" />
        </NodeContainer>
    );
}
