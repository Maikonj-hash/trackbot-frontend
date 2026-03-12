import { useFlowStore } from "@/store/flow-store";
import { Copy, Trash2, X } from "lucide-react";

import { MessageProperties } from "./properties/message-properties";
import { InputProperties } from "./properties/input-properties";
import { IdentificationProperties } from "./properties/identification-properties";
import { OptionsProperties } from "./properties/options-properties";
import { ConditionProperties } from "./properties/condition-properties";
import { DelayProperties } from "./properties/delay-properties";
import { MediaProperties } from "./properties/media-properties";
import { WebhookProperties } from "./properties/webhook-properties";
import { VariableProperties } from "./properties/variable-properties";
import { HandoverProperties } from "./properties/handover-properties";
import { SwitchProperties } from "./properties/switch-properties";
import { EndProperties } from "./properties/end-properties";
import { ReviewProperties } from "./properties/review-properties";
import { JumpProperties } from "./properties/jump-properties";
import { SegmentProperties } from "./properties/segment-properties";

export function PropertiesDrawer() {
    const { selectedNode, setSelectedNode, updateNodeData, deleteNode } = useFlowStore();

    if (!selectedNode) return null;

    const renderNodeProperties = () => {
        const props = { node: selectedNode, updateNodeData };

        switch (selectedNode.type) {
            case "messageBlock":
                return <MessageProperties {...props} />;
            case "inputBlock":
                return <InputProperties {...props} />;
            case "identificationBlock":
                return <IdentificationProperties {...props} />;
            case "optionsBlock":
                return <OptionsProperties {...props} />;
            case "conditionBlock":
                return <ConditionProperties {...props} />;
            case "delayBlock":
                return <DelayProperties {...props} />;
            case "mediaBlock":
                return <MediaProperties {...props} />;
            case "webhookBlock":
                return <WebhookProperties {...props} />;
            case "variableBlock":
                return <VariableProperties {...props} />;
            case "handoverBlock":
                return <HandoverProperties {...props} />;
            case "switchBlock":
                return <SwitchProperties {...props} />;
            case "reviewBlock":
                return <ReviewProperties {...props} />;
            case "jumpBlock":
                return <JumpProperties {...props} />;
            case "endBlock":
                return <EndProperties {...props} />;
            case "segmentBlock":
                return <SegmentProperties {...props} />;
            default:
                return (
                    <p className="text-sm text-muted-foreground italic text-center py-8">
                        Propriedades não configuráveis para este bloco.
                    </p>
                );
        }
    };

    return (
        <div className="w-80 h-full border-l border-border/50 bg-background/40 backdrop-blur-xl shadow-2xl flex flex-col z-10 relative overflow-hidden">
            {/* Visual HUD Decoration */}
            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />

            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/20 group">
                <div className="space-y-1">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80 font-mono">
                        Configuração
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                        <p className="text-[9px] text-muted-foreground/60 font-mono uppercase tracking-widest font-bold">
                            {(selectedNode.type || "unknown").replace('Block', '')} UNIT
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedNode(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-all hover:text-foreground border border-transparent hover:border-border/50"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-border/50">
                {/* O Roteador Injeta Apenas a Interface do Bloco Específico */}
                {renderNodeProperties()}
            </div>

            <div className="p-4 border-t border-border/40 bg-card/10 flex items-center justify-between gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/20 hover:bg-muted/40 hover:text-foreground rounded-lg transition-all border border-border/20 active:scale-95 font-mono">
                    <Copy className="w-3.5 h-3.5" /> Clonar
                </button>
                <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-500/70 bg-rose-500/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-all border border-rose-500/20 active:scale-95 font-mono"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Deletar
                </button>
            </div>
        </div>
    );
}
