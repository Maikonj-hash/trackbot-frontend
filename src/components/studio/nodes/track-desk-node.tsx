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
                <div className="flex flex-col gap-1.5 p-1">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[8px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded border border-blue-500/20">
                                TICKET
                            </span>
                            <span className="text-[10px] font-medium text-foreground/80 truncate max-w-[100px]">
                                {(() => {
                                    try {
                                        const p = typeof data.bodyPayload === 'string' ? JSON.parse(data.bodyPayload) : data.bodyPayload || {};
                                        return p.tipoProblema || "Sem Assunto";
                                    } catch(e) { return "Erro no Payload" }
                                })()}
                            </span>
                        </div>
                    </div>
                    <div className="px-1">
                        <p className="text-[9px] text-muted-foreground/60 line-clamp-2 leading-tight italic">
                            {(() => {
                                try {
                                    const p = typeof data.bodyPayload === 'string' ? JSON.parse(data.bodyPayload) : data.bodyPayload || {};
                                    return p.descricao || "Nenhuma descrição...";
                                } catch(e) { return "" }
                            })()}
                        </p>
                    </div>
                </div>
            </NodeBody>

            <NodeHandle
                type="source"
                position={Position.Bottom}
                color="blue"
            />
        </NodeContainer>
    );
}
