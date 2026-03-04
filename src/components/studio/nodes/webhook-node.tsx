import { Position, NodeProps, Node } from "@xyflow/react";
import { Globe } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function WebhookNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const method = data?.webhookMethod || "POST";
    const url = data?.content || "https://api.exemplo.com/webhook";

    return (
        <NodeContainer selected={selected} color="cyan">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={Globe} label="HTTP WEBHOOK" color="cyan" />

            <div className="p-3 bg-card space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        {method}
                    </span>
                    <div className="text-[10px] font-medium truncate text-foreground/70 flex-1">
                        {url}
                    </div>
                </div>
            </div>

            <NodeHandle type="source" position={Position.Bottom} color="cyan" />
        </NodeContainer>
    );
}
