import { PropertyPanelProps } from "./types"
import { PlusCircle, X } from "lucide-react"
import { PropertySection, PropertyToggle, PropertyInput, PropertyHint, NodeLabelProperty } from "./base-properties"

export function OptionsProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <NodeLabelProperty node={node} updateNodeData={updateNodeData} />
            <PropertySection title="Pergunta ao Cliente">
                <PropertyInput
                    isTextArea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    placeholder="O que o bot deve perguntar?"
                />
            </PropertySection>

            <PropertySection title="Lista de Opções">
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 font-mono">
                            Opções Cadastradas
                        </span>
                        <button
                            onClick={() => {
                                const currentOptions = node.data.options || [];
                                updateNodeData(node.id, { options: [...currentOptions, `Opção ${currentOptions.length + 1}`] });
                            }}
                            className="text-blue-500 hover:text-blue-400 p-1 bg-blue-500/10 rounded-md transition-colors"
                        >
                            <PlusCircle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {(node.data.options || ["Sim", "Não"]).map((opt, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <PropertyInput
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...(node.data.options || ["Sim", "Não"])];
                                            newOptions[index] = e.target.value;
                                            updateNodeData(node.id, { options: newOptions });
                                        }}
                                        className={node.data.useNativeButtons && (opt.length > 24) ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}
                                    />
                                    <button
                                        onClick={() => {
                                            const newOptions = [...(node.data.options || ["Sim", "Não"])];
                                            newOptions.splice(index, 1);
                                            updateNodeData(node.id, { options: newOptions });
                                        }}
                                        className="text-muted-foreground/40 hover:text-rose-500 p-1.5 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                {node.data.useNativeButtons && opt.length > 20 && (
                                    <p className={`text-[9px] font-mono uppercase px-2 ${opt.length > 24 ? 'text-rose-500 font-bold' : 'text-amber-500'}`}>
                                        {opt.length > 24 ? 'CRITICAL: MAX 24 CHR' : 'WARN: RECOM. MAX 20'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </PropertySection>

            <PropertySection title="Interface WhatsApp">
                <div className="space-y-4">
                    <PropertyToggle
                        label="Botões Nativos"
                        description="Envia botões reais ou lista automática."
                        checked={!!node.data.useNativeButtons}
                        onChange={(checked) => updateNodeData(node.id, { useNativeButtons: checked })}
                    />

                    {node.data.useNativeButtons && (
                        <div className="space-y-4 p-3 bg-muted/10 rounded-xl border border-border/40 animate-in fade-in slide-in-from-top-1 duration-300">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-bold uppercase text-muted-foreground/60 font-mono">Título do Menu</span>
                                    <span className={`text-[9px] font-mono ${(node.data.listTitle?.length || 0) > 24 ? 'text-rose-500 font-bold' : 'text-muted-foreground/40'}`}>
                                        {(node.data.listTitle?.length || 0)}/24
                                    </span>
                                </div>
                                <PropertyInput
                                    value={node.data.listTitle || ""}
                                    onChange={(e) => updateNodeData(node.id, { listTitle: e.target.value })}
                                    placeholder="Ex: Escolha um serviço"
                                    className={(node.data.listTitle?.length || 0) > 24 ? 'border-rose-500/50' : ''}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-bold uppercase text-muted-foreground/60 font-mono">Texto do Botão</span>
                                    <span className={`text-[9px] font-mono ${(node.data.listButtonLabel?.length || 0) > 20 ? 'text-rose-500 font-bold' : 'text-muted-foreground/40'}`}>
                                        {(node.data.listButtonLabel?.length || 0)}/20
                                    </span>
                                </div>
                                <PropertyInput
                                    value={node.data.listButtonLabel || ""}
                                    onChange={(e) => updateNodeData(node.id, { listButtonLabel: e.target.value })}
                                    placeholder="Ex: Ver Opções"
                                    className={(node.data.listButtonLabel?.length || 0) > 20 ? 'border-rose-500/50' : ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[9px] font-bold uppercase text-muted-foreground/60 font-mono px-1">Rodapé</span>
                                <PropertyInput
                                    value={node.data.listFooter || ""}
                                    onChange={(e) => updateNodeData(node.id, { listFooter: e.target.value })}
                                    placeholder="Ex: Selecione para continuar"
                                    className="font-mono text-[10px]"
                                />
                            </div>
                        </div>
                    )}

                </div>
            </PropertySection>

            <PropertySection title="Ações do Cliente">
                <PropertyToggle
                    label="Habilitar Voltar (Undo)"
                    description="Permitir que o cliente retorne ao passo anterior digitando '0'."
                    checked={!!node.data.allowBack}
                    onChange={(checked) => updateNodeData(node.id, { allowBack: checked })}
                />
            </PropertySection>
        </div>
    )
}
