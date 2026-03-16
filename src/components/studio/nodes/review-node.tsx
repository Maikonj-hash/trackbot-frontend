"use client";

import { Position, NodeProps, Node } from "@xyflow/react";
import { ClipboardCheck, ChevronRight } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";
import { VariableHighlighter } from "./base/variable-highlighter";

export function ReviewNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const fields = data.fields || [];

    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader
                icon={ClipboardCheck}
                label="DATA REVIEW"
                color="blue"
                allowBack={data.allowBack}
                skipEnabled={data.skipIfAlreadyFilled}
            />

            <NodeBody className="pb-1 space-y-1" noTextWrapper>
                <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-[9px] text-muted-foreground uppercase font-mono tracking-widest">
                        {fields.length} {fields.length === 1 ? 'CAMPO' : 'CAMPOS'}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Review Mode</span>
                    </div>
                </div>

                <div className="px-2 py-1 text-[11px] text-foreground/80 leading-relaxed mb-1">
                    <VariableHighlighter text={data?.content || "Confirme se seus dados estão corretos:"} />
                </div>

                <div className="flex flex-col gap-1 p-2 bg-muted/20 border-y border-border/40">
                    {fields.length > 0 ? (
                        fields.map((field, idx) => (
                            <div key={idx} className="flex flex-col gap-0.5 p-1.5 rounded-sm border border-border/40 bg-background/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors">
                                <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-tighter">{field.label}</span>
                                <div className="text-[10px] font-mono font-medium text-foreground/70 truncate">
                                    <VariableHighlighter text={`{{${field.variableName}}}`} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-3 text-center border border-dashed border-border/50 rounded-sm">
                            <p className="text-[9px] text-muted-foreground/50 italic">Nenhum campo selecionado</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1.5 p-2 pt-3">
                    <div className="relative flex items-center justify-between p-2 rounded-sm bg-background border border-border/60 group hover:border-blue-500/30 hover:bg-blue-500/5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-[9px] font-bold text-foreground/70 tracking-tight flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
                            CONFIRMAR DADOS
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-blue-500 transition-colors" />
                        <NodeHandle
                            type="source"
                            position={Position.Right}
                            id="confirm"
                            style={{ top: '50%', right: '-4px' }}
                            color="blue"
                        />
                    </div>

                    <div className="relative flex items-center justify-between p-2 rounded-sm bg-background border border-border/60 group hover:border-amber-500/30 hover:bg-amber-500/5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-[9px] font-bold text-foreground/70 tracking-tight flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.3)]" />
                            CORRIGIR / EDITAR
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-amber-500 transition-colors" />
                        <NodeHandle
                            type="source"
                            position={Position.Right}
                            id="edit"
                            style={{ top: '50%', right: '-4px' }}
                            color="slate"
                        />
                    </div>
                </div>
            </NodeBody>
        </NodeContainer>
    );
}
