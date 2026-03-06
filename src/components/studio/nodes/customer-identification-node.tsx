import { Position, NodeProps, Node } from "@xyflow/react";
import { UserPlus, Mail, Phone, Hash, CreditCard, ChevronRight, Brain } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function CustomerIdentificationNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const fields = (data?.identificationFields as any[]) || [];
    const skipIfAlreadyFilled = data?.skipIfAlreadyFilled || false;

    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={UserPlus} label="IDENTIFICATION" color="blue" />

            <div className="p-2 space-y-1 bg-card">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest px-1">
                        {fields.length} {fields.length === 1 ? 'CAMPO' : 'CAMPOS'}
                    </span>
                    {skipIfAlreadyFilled && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20" title="Pular se já preenchido">
                            <Brain className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Skip ON</span>
                        </div>
                    )}
                </div>

                {fields.length > 0 ? (
                    <div className="space-y-1.5 custom-scrollbar">
                        {fields.map((field, idx) => (
                            <div key={idx} className="flex flex-col gap-0.5 p-1.5 rounded-md border border-border/40 bg-muted/20 group hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-muted-foreground/60">
                                            {field.type === 'EMAIL' && <Mail className="w-3 h-3" />}
                                            {field.type === 'PHONE' && <Phone className="w-3 h-3" />}
                                            {field.type === 'NUMBER' && <Hash className="w-3 h-3" />}
                                            {field.type === 'CPF' && <CreditCard className="w-3 h-3" />}
                                            {field.type === 'TEXT' && <ChevronRight className="w-3 h-3" />}
                                        </span>
                                        <span className="text-[10px] font-medium text-foreground/80 truncate max-w-[140px] lowercase group-hover:text-foreground transition-colors">
                                            {field.label}
                                        </span>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground font-mono lowercase opacity-50 group-hover:opacity-100 transition-opacity">
                                        {'{{'}{field.saveToVariable}{'}}'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-2 text-center border-2 border-dashed border-border/50 rounded-md bg-muted/10">
                        <p className="text-[9px] text-muted-foreground/70 font-semibold uppercase tracking-widest">Nenhum campo config.</p>
                    </div>
                )}
            </div>

            <NodeHandle type="source" position={Position.Bottom} color="blue" />
        </NodeContainer>
    );
}
