import { Position, NodeProps, Node } from "@xyflow/react";
import { Headset } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";
import { VariableHighlighter } from "./base/variable-highlighter";

export function HandoverNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer selected={selected} color="rose">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={Headset} label="HUMAN HANDOVER" color="rose" />

            <NodeBody className="bg-rose-500/5 text-center px-4" noTextWrapper>
                <div className="text-[10px] text-rose-600 font-medium leading-tight">
                    <VariableHighlighter text="Transfere o atendimento para um agente humano real." />
                </div>
            </NodeBody>
        </NodeContainer>
    );
}
