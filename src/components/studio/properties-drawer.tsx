import { useFlowStore } from "@/store/flow-store";
import { Copy, Trash2, X, Plus, PlusCircle } from "lucide-react";

export function PropertiesDrawer() {
    const { selectedNode, setSelectedNode, updateNodeData, deleteNode } = useFlowStore();

    if (!selectedNode) return null;

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
                {(selectedNode.type === "messageBlock" || selectedNode.type === "optionsBlock" || selectedNode.type === "inputBlock") && (
                    <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Texto da Mensagem / Pergunta
                        </label>
                        <textarea
                            value={selectedNode.data.content as string || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { content: e.target.value })}
                            className="min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="O que o bot deve falar?"
                        />
                    </div>
                )}

                {selectedNode.type === "inputBlock" && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Salvar resposta na variável
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.variableName || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { variableName: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                            placeholder="Ex: nome_cliente"
                        />
                        <p className="text-[10px] text-muted-foreground">
                            O que o usuário digitar será salvo com este nome para uso futuro.
                        </p>
                    </div>
                )}

                {selectedNode.type === "conditionBlock" && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Variável para Testar
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.conditionVariable || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { conditionVariable: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono"
                            placeholder="Ex: user.name"
                        />
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2 block">
                            Operador
                        </label>
                        <select
                            value={selectedNode.data.conditionOperator || "EQUALS"}
                            onChange={(e) => updateNodeData(selectedNode.id, { conditionOperator: e.target.value as any })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="EQUALS">Igual a (=)</option>
                            <option value="NOT_EQUALS">Diferente de (!=)</option>
                            <option value="CONTAINS">Contém</option>
                            <option value="IS_EMPTY">Está Vazio</option>
                            <option value="IS_NOT_EMPTY">Não Está Vazio</option>
                        </select>

                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2 block">
                            Valor
                        </label>
                        <input
                            type="text"
                            value={String(selectedNode.data.conditionValue || "")}
                            onChange={(e) => updateNodeData(selectedNode.id, { conditionValue: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono"
                            placeholder="Ex: João"
                        />
                        <p className="text-[10px] text-muted-foreground">
                            O roteamento vai pro caminho "Verdadeiro" ou "Falso".
                        </p>
                    </div>
                )}

                {selectedNode.type === "optionsBlock" && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Botões de Opções
                            </label>
                            <button
                                onClick={() => {
                                    const currentOptions = selectedNode.data.options || [];
                                    updateNodeData(selectedNode.id, { options: [...currentOptions, `Opção ${currentOptions.length + 1}`] });
                                }}
                                className="text-blue-500 hover:text-blue-400 p-1"
                            >
                                <PlusCircle className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {(selectedNode.data.options || ["Sim", "Não"]).map((opt, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...(selectedNode.data.options || ["Sim", "Não"])];
                                            newOptions[index] = e.target.value;
                                            updateNodeData(selectedNode.id, { options: newOptions });
                                        }}
                                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                    <button
                                        onClick={() => {
                                            const newOptions = [...(selectedNode.data.options || ["Sim", "Não"])];
                                            newOptions.splice(index, 1);
                                            updateNodeData(selectedNode.id, { options: newOptions });
                                        }}
                                        className="text-muted-foreground hover:text-destructive p-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedNode.type === "delayBlock" && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Tempo de Pausa (Em Milissegundos)
                        </label>
                        <input
                            type="number"
                            value={selectedNode.data.delayMs || 3000}
                            onChange={(e) => updateNodeData(selectedNode.id, { delayMs: parseInt(e.target.value) || 0 })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Ex: 3000 (3 Segundos)"
                        />
                        <p className="text-[10px] text-muted-foreground">Ex: 1000 = 1 segundo de tempo digitando.</p>
                    </div>
                )}

                {(selectedNode.type === "mediaBlock") && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Tipo de Mídia
                        </label>
                        <select
                            value={selectedNode.data.mediaType || "image"}
                            onChange={(e) => updateNodeData(selectedNode.id, { mediaType: e.target.value as any })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="image">Imagem (JPG, PNG)</option>
                            <option value="video">Vídeo (MP4)</option>
                            <option value="audio">Áudio Gravado (PTT)</option>
                            <option value="document">Documento (PDF, etc)</option>
                        </select>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2 block">
                            URL do Arquivo (Imagem/Vídeo/Áudio)
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.content as string || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { content: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="https://sua-imagem.com/foto.png"
                        />
                    </div>
                )}

                {(selectedNode.type === "webhookBlock") && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Método HTTP
                        </label>
                        <select
                            value={selectedNode.data.webhookMethod || "POST"}
                            onChange={(e) => updateNodeData(selectedNode.id, { webhookMethod: e.target.value as any })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                        </select>

                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2 block">
                            URL do Endpoint (API)
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.content as string || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { content: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="https://api.site.com/webhook"
                        />
                    </div>
                )}

                {(selectedNode.type === "variableBlock") && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Nome da Variável
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.variableName || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { variableName: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                            placeholder="Ex: score"
                        />

                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2 block">
                            Ação
                        </label>
                        <select
                            value={selectedNode.data.variableAction || "SET"}
                            onChange={(e) => updateNodeData(selectedNode.id, { variableAction: e.target.value as any })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="SET">Atribuir Novo Valor (=)</option>
                            <option value="INCREMENT">Incrementar (+)</option>
                            <option value="DECREMENT">Decrementar (-)</option>
                        </select>

                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2 block">
                            Valor
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.variableValue || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { variableValue: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                            placeholder="Ex: 5 ou 'Ativo'"
                        />
                    </div>
                )}

                {(selectedNode.type === "handoverBlock") && (
                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Departamento Comercial (Opcional)
                        </label>
                        <input
                            type="text"
                            value={selectedNode.data.content as string || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { content: e.target.value })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Ex: Vendas"
                        />
                    </div>
                )}

                {selectedNode.type === "endBlock" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md mt-4">
                        <p className="text-sm text-red-500 font-medium text-center">
                            Ao chegar neste bloco o robô de auto-atendimento será encerrado e a conversa fechada.
                        </p>
                    </div>
                )}
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
