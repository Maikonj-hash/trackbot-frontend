import { PropertyPanelProps } from "./types"
import { PlusCircle, X, Globe, Database, Settings } from "lucide-react"
import { PropertySection, PropertyInput, PropertyToggle } from "./base-properties"

export function WebhookProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <PropertySection title="Configuração da Requisição">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Endpoint URL</span>
                        <PropertyInput
                            value={node.data.content as string || ""}
                            onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                            placeholder="https://api.site.com/webhook"
                            className="font-mono text-blue-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Método</span>
                            <select
                                value={node.data.webhookMethod as string || "POST"}
                                onChange={(e) => updateNodeData(node.id, { webhookMethod: e.target.value as any })}
                                className="w-full bg-background/50 border border-border/50 rounded-lg px-2 py-2 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none font-medium"
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Timeout (ms)</span>
                            <PropertyInput
                                type="number"
                                value={node.data.timeout as number || 10000}
                                onChange={(e) => updateNodeData(node.id, { timeout: parseInt(e.target.value) })}
                                className="font-mono"
                            />
                        </div>
                    </div>
                </div>
            </PropertySection>

            <PropertySection title="Headers & Segurança">
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 font-mono">
                            Lista de Cabeçalhos
                        </span>
                        <button
                            onClick={() => {
                                const currentHeaders = node.data.headers || {};
                                updateNodeData(node.id, { headers: { ...currentHeaders, "": "" } });
                            }}
                            className="text-blue-500 hover:text-blue-400 p-1 bg-blue-500/10 rounded-md transition-colors"
                        >
                            <PlusCircle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {Object.entries(node.data.headers || {}).map(([key, value], index) => (
                            <div key={index} className="flex gap-2 group relative bg-muted/5 p-1 rounded-lg border border-border/20">
                                <PropertyInput
                                    placeholder="Key"
                                    value={key}
                                    onChange={(e) => {
                                        const newHeaders = { ...node.data.headers };
                                        const val = newHeaders[key];
                                        delete newHeaders[key];
                                        newHeaders[e.target.value] = val as string;
                                        updateNodeData(node.id, { headers: newHeaders });
                                    }}
                                    className="w-1/2 border-none bg-transparent h-8 text-[10px]"
                                />
                                <div className="w-[1px] bg-border/20 self-stretch my-1" />
                                <PropertyInput
                                    placeholder="Value"
                                    value={value as string}
                                    onChange={(e) => {
                                        updateNodeData(node.id, {
                                            headers: { ...node.data.headers, [key]: e.target.value }
                                        });
                                    }}
                                    className="w-1/3 border-none bg-transparent h-8 text-[10px]"
                                />
                                <button
                                    onClick={() => {
                                        const newHeaders = { ...node.data.headers };
                                        delete newHeaders[key];
                                        updateNodeData(node.id, { headers: newHeaders });
                                    }}
                                    className="p-1.5 text-muted-foreground/30 hover:text-rose-500 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </PropertySection>

            {["POST", "PUT", "PATCH"].includes((node.data.webhookMethod as string) || "") && (
                <PropertySection title="Corpo da Requisição (JSON)">
                    <div className="space-y-2">
                        <PropertyInput
                            isTextArea
                            value={typeof node.data.bodyPayload === 'string' ? node.data.bodyPayload : JSON.stringify(node.data.bodyPayload, null, 2)}
                            onChange={(e) => updateNodeData(node.id, { bodyPayload: e.target.value })}
                            className="min-h-[100px] font-mono text-[10px] bg-muted/5"
                            placeholder='{ "key": "{{valor}}" }'
                        />
                        <p className="text-[9px] font-mono text-muted-foreground/30 uppercase text-right tracking-tighter">
                            // Variáveis aceitas: {"{{"}nome{"}}"}
                        </p>
                    </div>
                </PropertySection>
            )}

            <PropertySection title="Tratamento de Resposta">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Status Code em:</span>
                        <PropertyInput
                            value={node.data.saveStatusToVariable as string || ""}
                            onChange={(e) => updateNodeData(node.id, { saveStatusToVariable: e.target.value })}
                            placeholder="ex: status_api"
                            className="font-mono text-[11px]"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 font-mono">
                                Mapear JSON para Variáveis
                            </span>
                            <button
                                onClick={() => {
                                    const currentMapping = node.data.responseMapping || [];
                                    updateNodeData(node.id, {
                                        responseMapping: [...currentMapping, { jsonPath: "", variableName: "" }]
                                    });
                                }}
                                className="text-blue-500 hover:text-blue-400 p-1 bg-blue-500/10 rounded-md transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {(node.data.responseMapping || []).map((mapping, index: number) => (
                                <div key={index} className="space-y-1 p-2 bg-muted/10 rounded-xl border border-border/40 relative group">
                                    <button
                                        onClick={() => {
                                            const newMapping = [...(node.data.responseMapping || [])];
                                            newMapping.splice(index, 1);
                                            updateNodeData(node.id, { responseMapping: newMapping });
                                        }}
                                        className="absolute -top-2 -right-2 bg-background border border-border p-1 rounded-full text-muted-foreground/40 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-bold text-muted-foreground/30 font-mono w-12 uppercase">Path</span>
                                        <PropertyInput
                                            placeholder="data.user.id"
                                            value={mapping.jsonPath}
                                            onChange={(e) => {
                                                const newMapping = [...(node.data.responseMapping || [])];
                                                newMapping[index].jsonPath = e.target.value;
                                                updateNodeData(node.id, { responseMapping: newMapping });
                                            }}
                                            className="h-7 border-none bg-transparent font-mono text-[10px]"
                                        />
                                    </div>
                                    <div className="h-[1px] bg-border/20 my-1" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-bold text-muted-foreground/30 font-mono w-12 uppercase">Var</span>
                                        <PropertyInput
                                            placeholder="id_externo"
                                            value={mapping.variableName}
                                            onChange={(e) => {
                                                const newMapping = [...(node.data.responseMapping || [])];
                                                newMapping[index].variableName = e.target.value;
                                                updateNodeData(node.id, { responseMapping: newMapping });
                                            }}
                                            className="h-7 border-none bg-transparent font-mono text-[10px] text-blue-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PropertySection>

            <PropertySection title="Simulador HUD">
                <PropertyToggle
                    label="Disparo Real"
                    description="Executar chamada real durante testes no Play."
                    checked={!!(node.data as any).simulateRealRequest}
                    onChange={(checked) => updateNodeData(node.id, { simulateRealRequest: checked } as any)}
                />
            </PropertySection>
        </div>
    )
}
