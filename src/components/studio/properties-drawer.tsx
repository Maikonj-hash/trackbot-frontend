import { useFlowStore } from "@/store/flow-store";
import { Copy, Trash2, X } from "lucide-react";

// Importando todos os subcomponentes abstraídos (Desacoplamento Clean Architecture)
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

export function PropertiesDrawer() {
    const { selectedNode, setSelectedNode, updateNodeData, deleteNode } = useFlowStore();

    if (!selectedNode) return null;

    // Dicionário de Componentes Renderizadores (Roteador Interno do Modal)
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
            case "endBlock":
                return <EndProperties {...props} />;
            default:
                return (
                    <p className="text-sm text-muted-foreground italic text-center py-8">
                        Propriedades não configuráveis para este bloco.
                    </p>
                );
        }
    };

    return (
        <div className="w-72 h-full border-l border-border/50 bg-background/95 shadow-2xl flex flex-col z-10 transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                <div>
                    <h3 className="font-semibold text-sm">Editar Bloco</h3>
                    <p className="text-xs text-muted-foreground uppercase">{selectedNode.type}</p>
                </div>
                <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* O Roteador Injeta Apenas a Interface do Bloco Específico */}
                {renderNodeProperties()}
            </div>

            <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-between">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                    <Copy className="w-3.5 h-3.5" /> Duplicar
                </button>
                <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Apagar
                </button>
            </div>
        </div>
    );
}
