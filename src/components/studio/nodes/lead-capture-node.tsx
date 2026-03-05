import { Position, NodeProps, Node } from "@xyflow/react";
import { UserPlus, Mail, Phone, Hash, CreditCard, TextCursorInput } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function LeadCaptureNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const fields = data?.leadCaptureFields || [];

    const getIcon = (type: string) => {
        switch (type) {
            case 'EMAIL': return Mail;
            case 'PHONE': return Phone;
            case 'NUMBER': return Hash;
            case 'CPF': return CreditCard;
            default: return TextCursorInput;
        }
    };

    return (
        <NodeContainer selected={selected} color="blue">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={UserPlus} label="LEAD CAPTURE" color="blue" />

            <div className="p-3 flex flex-col gap-2 bg-card min-w-[180px]">
                {data?.content && (
                    <div className="text-[10px] text-muted-foreground italic line-clamp-2 pb-1 border-b border-border/30">
                        "{data.content}"
                    </div>
                )}

                <div className="flex flex-col gap-1.5 mt-1">
                    {fields.length === 0 ? (
                        <div className="text-[10px] text-muted-foreground/50 text-center py-2 border border-dashed border-border/40 rounded">
                            Nenhum campo configurado
                        </div>
                    ) : (
                        fields.map((field, idx) => {
                            const Icon = getIcon(field.type);
                            return (
                                <div key={idx} className="flex items-center gap-2 bg-muted/20 p-1.5 rounded border border-border/40 group">
                                    <Icon className="w-3 h-3 text-blue-500/70" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[9px] font-bold text-foreground/80 truncate">{field.label}</span>
                                        <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-tighter truncate">
                                            {field.saveToVariable}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {data?.skipIfAlreadyFilled && (
                    <div className="mt-1 px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit">
                        <span className="text-[8px] font-bold text-blue-600 uppercase">Intelligent Skip</span>
                    </div>
                )}
            </div>

            <NodeHandle type="source" position={Position.Bottom} />
        </NodeContainer>
    );
}
