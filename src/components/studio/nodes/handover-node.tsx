import { Position, NodeProps, Node } from "@xyflow/react";
import { Headset } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function HandoverNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer selected={selected} color="rose">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={Headset} label="HUMAN HANDOVER" color="rose" />

            <div className="p-4 bg-rose-500/5 text-center">
                <p className="text-[10px] text-rose-600 font-medium leading-tight">
                    Transfere o atendimento para um agente humano real.
                </p>
            </div>
        </NodeContainer>
    );
}
