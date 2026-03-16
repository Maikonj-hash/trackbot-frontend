import { Position, NodeProps, Node } from "@xyflow/react";
import { UserPlus, Mail, Phone, Hash, CreditCard, ChevronRight, Brain } from "lucide-react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";
import { VariableHighlighter } from "./base/variable-highlighter";

export function CustomerIdentificationNode({ id, data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const fields = (data?.identificationFields as any[]) || [];
    const skipIfAlreadyFilled = data?.skipIfAlreadyFilled || false;

    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader 
                icon={UserPlus} 
                label={data.label || "IDENTIFICATION"} 
                color="blue" 
                allowBack={data.allowBack} 
                skipEnabled={data.skipIfAlreadyFilled}
                onLabelChange={(newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })}
            />

            <NodeBody className="p-2 space-y-1" noTextWrapper>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest px-1">
                        {fields.length} {fields.length === 1 ? 'CAMPO' : 'CAMPOS'}
                    </span>
                </div>

                {fields.length > 0 ? (
                    <div className="space-y-1.5 custom-scrollbar">
                        {fields.map((field, idx) => (
                            <div key={idx} className="flex flex-col gap-0.5 p-1.5 rounded-md border border-border/40 bg-muted/20 group hover:border-blue-500/30 transition-colors">
                                <div className="flex flex-col gap-1 text-left">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-muted-foreground/60 shrink-0">
                                            {field.type === 'EMAIL' && <Mail className="w-3 h-3" />}
                                            {field.type === 'PHONE' && <Phone className="w-3 h-3" />}
                                            {field.type === 'NUMBER' && <Hash className="w-3 h-3" />}
                                            {field.type === 'CPF' && <CreditCard className="w-3 h-3" />}
                                            {field.type === 'TEXT' && <ChevronRight className="w-3 h-3" />}
                                        </span>
                                        <span className="text-[10px] font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-tight break-all">
                                            <VariableHighlighter text={field.label} />
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 pl-4.5">
                                        <span className="text-[8px] text-muted-foreground font-mono lowercase opacity-50 bg-muted/60 px-1.5 py-0.5 rounded-sm break-all group-hover:opacity-100 transition-opacity">
                                            {'{{'}{field.saveToVariable}{'}}'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-2 text-center border-2 border-dashed border-border/50 rounded-md bg-muted/10">
                        <p className="text-[9px] text-muted-foreground/70 font-semibold uppercase tracking-widest">Nenhum campo config.</p>
                    </div>
                )}
            </NodeBody>

            <NodeHandle type="source" position={Position.Bottom} color="blue" />
        </NodeContainer>
    );
}
