import { Position, NodeProps, Node } from "@xyflow/react";
import { Ticket } from "lucide-react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";

export function TrackDeskNode({ id, data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader 
                icon={Ticket} 
                label={data.label || "TICKET TRACK-DESK"} 
                color="blue" 
                onLabelChange={(newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })}
            />

            <NodeBody className="space-y-2" noTextWrapper>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter bg-blue-500/10 px-1 rounded border border-blue-500/20">
                            AUTO-TICKET
                        </span>
                        <span className="text-[10px] font-medium text-foreground/70 truncate">
                            Criar Chamado
                        </span>
                    </div>
                </div>
            </NodeBody>

            <div className="grid grid-cols-2 border-t border-border/50 bg-muted/5 rounded-b-md h-8">
                <div className="flex items-center justify-center border-r border-border/50 relative group hover:bg-emerald-500/5 transition-colors">
                    <span className="text-[9px] font-bold text-emerald-600 tracking-tighter uppercase opacity-70 group-hover:opacity-100">CRIADO</span>
                    <NodeHandle
                        type="source"
                        id="success"
                        position={Position.Bottom}
                        color="emerald"
                        style={{ bottom: "-4px" }}
                    />
                </div>

                <div className="flex items-center justify-center relative group hover:bg-red-500/5 transition-colors">
                    <span className="text-[9px] font-bold text-red-600 tracking-tighter uppercase opacity-70 group-hover:opacity-100">FALHA</span>
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
