import { PropertyPanelProps } from "./types"
import { Ticket, ShieldCheck, HelpCircle, Key } from "lucide-react"
import { PropertySection, PropertyInput, NodeLabelProperty, PropertyHint } from "./base-properties"
import { useFlowStore, TrackerNodeData } from "@/store/flow-store";
import { useShallow } from 'zustand/react/shallow';
import { NODE_REGISTRY } from "@/lib/node-registry";
import { useEffect, useState } from "react"
import { Node } from "@xyflow/react"

export function TrackDeskProperties({ node, updateNodeData }: PropertyPanelProps) {
    const nodes = useFlowStore(useShallow(s => s.nodes));
    const [payload, setPayload] = useState<Record<string, any>>({});
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        try {
            const currentPayload = typeof node.data.bodyPayload === 'string' 
                ? JSON.parse(node.data.bodyPayload) 
                : node.data.bodyPayload || {};
            setPayload(currentPayload);
            
            const headers = (node.data.headers as Record<string, string>) || {};
            setApiKey(headers["x-api-key"] || "");
        } catch (e) {
            console.error("Erro ao carregar dados do Track-Desk", e);
        }
    }, [node.data.bodyPayload, node.data.headers]);

    const availableTargets = (nodes as Node<TrackerNodeData>[])
        .filter(n => n.id !== node.id)
        .map(n => {
            const type = n.type || 'unknown';
            const definition = NODE_REGISTRY[type];
            const typeLabel = definition?.label || type || "BLOCO";
            const customName = n.data?.label || "";
            return {
                id: n.id,
                displayLabel: `[${typeLabel.toUpperCase()}] ${customName}`.trim()
            };
        })
        .sort((a, b) => a.displayLabel.localeCompare(b.displayLabel));

    const updatePayload = (key: string, value: any) => {
        const newPayload = { ...payload, [key]: value };
        setPayload(newPayload);
        updateNodeData(node.id, { bodyPayload: JSON.stringify(newPayload, null, 2) });
    };

    const updateApiKey = (val: string) => {
        setApiKey(val);
        const currentHeaders = (node.data.headers as Record<string, string>) || {};
        updateNodeData(node.id, { 
            headers: { ...currentHeaders, "x-api-key": val } 
        });
    };

    return (
        <div className="space-y-6">
            <NodeLabelProperty node={node} updateNodeData={updateNodeData} />

            <PropertySection title="Configuração do Ticket">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" /> Assunto / Tipo do Problema
                        </span>
                        <PropertyInput
                            value={payload.tipoProblema || ""}
                            onChange={(e) => updatePayload("tipoProblema", e.target.value)}
                            placeholder="Ex: {{assunto}} ou Falha na Internet"
                            className="font-mono text-blue-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Severidade</span>
                        <select
                            value={payload.severidade || "MEDIA"}
                            onChange={(e) => updatePayload("severidade", e.target.value)}
                            className="w-full bg-background/50 border border-border/50 rounded-lg px-2 py-2 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none font-medium"
                        >
                            <option value="BAIXA">Baixa</option>
                            <option value="MEDIA">Média</option>
                            <option value="ALTA">Alta</option>
                            <option value="CRITICA">Crítica</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Descrição Detalhada</span>
                        <PropertyInput
                            isTextArea
                            value={payload.descricao || ""}
                            onChange={(e) => updatePayload("descricao", e.target.value)}
                            placeholder="Descreva o problema aqui. Suporta {{variáveis}}..."
                            className="min-h-[80px] font-mono text-[10px]"
                        />
                    </div>
                </div>
            </PropertySection>

            <PropertySection 
                title="Direcionamento Avançado" 
                badge={ (payload.projetoId || payload.municipioId || payload.nucleoId || payload.estado || payload.cidade) ? "Ativo" : undefined }
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Projeto ID</span>
                            <PropertyInput
                                value={payload.projetoId || ""}
                                onChange={(e) => updatePayload("projetoId", e.target.value)}
                                placeholder="ID ou {{var}}"
                                className={`font-mono text-[9px] ${payload.projetoId ? 'border-blue-500/30' : ''}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Município ID</span>
                            <PropertyInput
                                value={payload.municipioId || ""}
                                onChange={(e) => updatePayload("municipioId", e.target.value)}
                                placeholder="ID ou {{var}}"
                                className={`font-mono text-[9px] ${payload.municipioId ? 'border-blue-500/30' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Núcleo ID</span>
                        <PropertyInput
                            value={payload.nucleoId || ""}
                            onChange={(e) => updatePayload("nucleoId", e.target.value)}
                            placeholder="ID Regional ou {{var}}"
                            className={`font-mono text-[9px] ${payload.nucleoId ? 'border-blue-500/30' : ''}`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-border/20 pt-3">
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Estado</span>
                            <PropertyInput
                                value={payload.estado || ""}
                                onChange={(e) => updatePayload("estado", e.target.value)}
                                placeholder="Ex: Paraná"
                                className={`font-mono text-[9px] ${payload.estado ? 'border-blue-500/30' : ''}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Cidade</span>
                            <PropertyInput
                                value={payload.cidade || ""}
                                onChange={(e) => updatePayload("cidade", e.target.value)}
                                placeholder="Ex: Curitiba"
                                className={`font-mono text-[9px] ${payload.cidade ? 'border-blue-500/30' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            </PropertySection>

            <PropertySection 
                title="Tratamento de Exceção"
                badge={ (node.data.failureStepId || node.data.errorFallbackMessage) ? "Configurado" : undefined }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Mensagem de Fallback (Erro)</span>
                        <PropertyInput
                            value={node.data.errorFallbackMessage as string || ""}
                            onChange={(e) => updateNodeData(node.id, { errorFallbackMessage: e.target.value })}
                            placeholder="Ex: Tivemos um problema técnico. Tente novamente em instantes."
                            className="font-mono text-[10px] text-red-400"
                        />
                        <PropertyHint>Mensagem enviada imediatamente se a API falhar.</PropertyHint>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border/20">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Redirecionar para nó</span>
                        <div className="relative group">
                            <select
                                value={node.data.failureStepId as string || ""}
                                onChange={(e) => updateNodeData(node.id, { failureStepId: e.target.value })}
                                className="w-full bg-background/50 border border-border/60 hover:border-red-500/50 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-500/30 outline-none transition-all appearance-none cursor-pointer font-medium"
                            >
                                <option value="">Nenhum (Finalizar atendimento)</option>
                                {availableTargets.map((target) => (
                                    <option key={target.id} value={target.id}>
                                        {target.displayLabel}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </PropertySection>

            <PropertySection title="Conexão & Segurança">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1 flex items-center gap-1">
                            <Key className="w-3 h-3" /> API Key (x-api-key)
                        </span>
                        <PropertyInput
                            type="password"
                            value={apiKey}
                            onChange={(e) => updateApiKey(e.target.value)}
                            placeholder="Sua chave de acesso ao Desk"
                            className="font-mono text-amber-500/70"
                        />
                    </div>

                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[10px] font-bold text-blue-500/80 uppercase">Modo Blindado</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 leading-relaxed">
                            Este nó envia automaticamente o **Protocolo**, **Nome** e **Telefone** do contato para garantir a rastreabilidade total no Track-Desk.
                        </p>
                    </div>
                </div>
            </PropertySection>

            <PropertySection title="Endpoint & Conectividade">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Target URL</span>
                        <PropertyInput
                            value={node.data.content as string || ""}
                            onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                            placeholder="{{sys.desk_url}}"
                            className="font-mono text-[9px] text-blue-400 bg-transparent border-dashed focus:border-blue-500/50 transition-colors"
                        />
                        <div className="flex items-start gap-1.5 px-1 py-1 bg-blue-500/5 rounded border border-blue-500/10">
                            <code className="text-[8px] text-blue-500/60 font-mono mt-0.5">INFO:</code>
                            <p className="text-[8px] text-muted-foreground/60 leading-relaxed italic">
                                Recomendamos usar <span className="text-blue-500/80 font-bold">{"{{sys.desk_url}}"}</span> para manter a URL centralizada e facilitar mudanças de ambiente.
                            </p>
                        </div>
                    </div>
                </div>
            </PropertySection>
        </div>
    )
}
