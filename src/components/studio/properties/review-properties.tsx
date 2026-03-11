import { PropertyPanelProps } from "./types";
import { PlusCircle, X } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { PropertySection, PropertyToggle, PropertyInput } from "./base-properties"

export function ReviewProperties({ node, updateNodeData }: PropertyPanelProps) {
    const { getVariables } = useFlowStore();
    const availableVariables = getVariables();

    const fields = node.data.fields || [];

    const addField = () => {
        updateNodeData(node.id, {
            fields: [...fields, { label: "Novo Campo", variableName: "" }]
        });
    };

    const removeField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        updateNodeData(node.id, { fields: newFields });
    };

    const updateField = (index: number, updates: Partial<{ label: string; variableName: string }>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        updateNodeData(node.id, { fields: newFields });
    };

    return (
        <div className="space-y-6">
            <PropertySection title="Configurações Globais">
                <div className="space-y-4">
                    <PropertyToggle
                        label="Salto Inteligente (Skip)"
                        description="Ignorar revisão se os dados já estiverem preenchidos."
                        checked={!!node.data.skipIfAlreadyFilled}
                        onChange={(checked) => updateNodeData(node.id, { skipIfAlreadyFilled: checked })}
                    />
                    <PropertyToggle
                        label="Habilitar Voltar (Undo)"
                        description="Permitir que o cliente retorne ao passo anterior digitando '0'."
                        checked={!!node.data.allowBack}
                        onChange={(checked) => updateNodeData(node.id, { allowBack: checked })}
                    />
                </div>
            </PropertySection>

            <PropertySection title="Mensagem de Revisão">
                <PropertyInput
                    isTextArea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    placeholder="Ex: Por favor, confirme se seus dados estão corretos:"
                />
            </PropertySection>

            <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Campos para Revisão
                    </label>
                    <button
                        onClick={addField}
                        className="text-blue-500 hover:text-blue-400 p-1 transition-colors bg-blue-500/10 rounded-md"
                        title="Adicionar Campo"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={index} className="p-3 bg-muted/20 rounded-md border border-border space-y-2 relative group shadow-sm">
                            <button
                                onClick={() => removeField(index)}
                                className="absolute -top-2 -right-2 bg-background border border-border p-1 rounded-full text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            <div className="space-y-1">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Rótulo (Ex: Nome)</span>
                                <PropertyInput
                                    value={field.label}
                                    onChange={(e) => updateField(index, { label: e.target.value })}
                                    placeholder="Nome do Cliente"
                                />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Variável</span>
                                <select
                                    value={field.variableName}
                                    onChange={(e) => updateField(index, { variableName: e.target.value })}
                                    className="w-full bg-background/50 border border-border/50 rounded-lg px-2 py-2 text-[10px] font-mono focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                                >
                                    <option value="">Selecionar variável...</option>
                                    {availableVariables.map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <p className="text-[10px] text-muted-foreground text-center py-2 italic bg-muted/10 rounded border border-dashed border-border">
                            Adicione campos que o usuário deve revisar.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
