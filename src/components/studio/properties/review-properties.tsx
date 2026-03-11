"use client";

import { PropertyPanelProps } from "./types";
import { PlusCircle, X } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";

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
        <div className="space-y-6 pt-2">
            {/* --- CONFIGURAÇÕES GLOBAIS --- */}
            <div className="space-y-3 pb-4 border-b border-border/50">
                <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="space-y-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-emerald-500 transition-colors">
                                Salto Inteligente (Skip)
                            </span>
                            <p className="text-[10px] text-muted-foreground/70 leading-tight">Pular se dados já existirem</p>
                        </div>
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted transition-colors border border-border">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={node.data.skipIfAlreadyFilled || false}
                                onChange={(e) => updateNodeData(node.id, { skipIfAlreadyFilled: e.target.checked })}
                            />
                            <span
                                className={`${node.data.skipIfAlreadyFilled ? 'translate-x-4 bg-emerald-500' : 'translate-x-1 bg-muted-foreground'
                                    } inline-block h-3 w-3 transform rounded-full transition-all duration-200 ease-in-out`}
                            />
                        </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="space-y-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-blue-500 transition-colors">
                                Botão Voltar (Undo)
                            </span>
                            <p className="text-[10px] text-muted-foreground/70 leading-tight">Permitir retornar ao passo anterior</p>
                        </div>
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted transition-colors border border-border">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={node.data.allowBack || false}
                                onChange={(e) => updateNodeData(node.id, { allowBack: e.target.checked })}
                            />
                            <span
                                className={`${node.data.allowBack ? 'translate-x-4 bg-blue-500' : 'translate-x-1 bg-muted-foreground'
                                    } inline-block h-3 w-3 transform rounded-full transition-all duration-200 ease-in-out`}
                            />
                        </div>
                    </label>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Mensagem de Revisão
                </label>
                <textarea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Ex: Por favor, confirme se seus dados estão corretos:"
                />
            </div>

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
                                <label className="text-[9px] font-bold uppercase text-muted-foreground/70">Rótulo (Ex: Nome)</label>
                                <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => updateField(index, { label: e.target.value })}
                                    className="w-full bg-background border border-input rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
                                    placeholder="Nome do Cliente"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground/70">Variável</label>
                                <select
                                    value={field.variableName}
                                    onChange={(e) => updateField(index, { variableName: e.target.value })}
                                    className="w-full bg-background border border-input rounded px-1 py-1 text-[10px] font-mono focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
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
