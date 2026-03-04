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

            <div className="grid grid-cols-2 border-t border-border/50 bg-muted/5 rounded-b-md h-8">
                <div className="flex items-center justify-center border-r border-border/50 relative group hover:bg-emerald-500/5 transition-colors">
                    <span className="text-[9px] font-bold text-emerald-600 tracking-tighter uppercase opacity-70 group-hover:opacity-100">SUCCESS</span>
                    <NodeHandle
                        type="source"
                        id="success"
                        position={Position.Bottom}
                        color="emerald"
                        style={{ bottom: "-4px" }}
                    />
                </div>

                <div className="flex items-center justify-center relative group hover:bg-red-500/5 transition-colors">
                    <span className="text-[9px] font-bold text-red-600 tracking-tighter uppercase opacity-70 group-hover:opacity-100">FAILURE</span>
                    <NodeHandle
                        type="source"
                        id="failure"
                        position={Position.Bottom}
                        color="red"
                        style={{ bottom: "-4px" }}
                    />
                </div>
            </div>
        </NodeContainer>
    );
}
