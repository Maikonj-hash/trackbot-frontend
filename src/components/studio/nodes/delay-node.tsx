import { Position, NodeProps, Node } from "@xyflow/react";
import { Clock } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function DelayNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer selected={selected} color="slate">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={Clock} label="WAIT DELAY" color="slate" />

            <div className="p-3 bg-card flex items-center justify-between">
                <div className="text-xs font-medium text-foreground/70">Duração:</div>
                <div className="text-xs font-mono font-bold text-slate-400 bg-slate-400/10 px-2 py-1 rounded border border-slate-400/20">
                    {data?.delayMs ? `${data.delayMs}ms` : "1000ms"}
                </div>
            </div>

            <NodeHandle type="source" position={Position.Bottom} color="slate" />
        </NodeContainer>
    );
}
