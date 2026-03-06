import { PropertyPanelProps } from "./types"
import { PlusCircle, X } from "lucide-react"

export function WebhookProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-4 pt-2">
            {/* Headers Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headers</label>
                    <button
                        onClick={() => {
                            const currentHeaders = node.data.headers || {};
                            updateNodeData(node.id, {
                                headers: { ...currentHeaders, "": "" }
                            });
                        }}
                        className="text-cyan-500 hover:text-cyan-400 p-1"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-2">
                    {Object.entries(node.data.headers || {}).map(([key, value], index) => (
                        <div key={index} className="flex gap-2 group relative">
                            <input
                                type="text"
                                placeholder="Chave"
                                value={key}
                                onChange={(e) => {
                                    const newHeaders = { ...node.data.headers };
                                    const val = newHeaders[key];
                                    delete newHeaders[key];
                                    newHeaders[e.target.value] = val as string;
                                    updateNodeData(node.id, { headers: newHeaders });
                                }}
                                className="w-1/2 rounded-md border border-input bg-background px-2 py-1 text-[10px] font-mono"
                            />
                            <input
                                type="text"
                                placeholder="Valor"
                                value={value as string}
                                onChange={(e) => {
                                    updateNodeData(node.id, {
                                        headers: { ...node.data.headers, [key]: e.target.value }
                                    });
                                }}
                                className="w-1/2 rounded-md border border-input bg-background px-2 py-1 text-[10px] font-mono"
                            />
                            <button
                                onClick={() => {
                                    const newHeaders = { ...node.data.headers };
                                    delete newHeaders[key];
                                    updateNodeData(node.id, { headers: newHeaders });
                                }}
                                className="p-1 text-muted-foreground hover:text-destructive self-center"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Body Payload Section */}
            {["POST", "PUT", "PATCH"].includes((node.data.webhookMethod as string) || "") && (
                <div className="space-y-2 pt-2 border-t border-border/10">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Body JSON</label>
                    <textarea
                        value={typeof node.data.bodyPayload === 'string' ? node.data.bodyPayload : JSON.stringify(node.data.bodyPayload, null, 2)}
                        onChange={(e) => {
                            try {
                                const val = e.target.value;
                                updateNodeData(node.id, { bodyPayload: val });
                            } catch (err) { }
                        }}
                        className="min-h-[100px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-[11px] font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder='{ "key": "{{valor}}" }'
                    />
                </div>
            )}

            <div className="space-y-2 pt-2 border-t border-border/10">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">URL do Endpoint</label>
                <input
                    type="text"
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                    placeholder="https://api.site.com/webhook"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Método</label>
                    <select
                        value={node.data.webhookMethod as string || "POST"}
                        onChange={(e) => updateNodeData(node.id, { webhookMethod: e.target.value as any })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Timeout (ms)</label>
                    <input
                        type="number"
                        value={node.data.timeout as number || 10000}
                        onChange={(e) => updateNodeData(node.id, { timeout: parseInt(e.target.value) })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/10 mt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                    <input
                        type="checkbox"
                        checked={(node.data as any).simulateRealRequest || false}
                        onChange={(e) => updateNodeData(node.id, { simulateRealRequest: e.target.checked } as any)}
                        className="rounded border-input bg-background w-3.5 h-3.5 text-cyan-500 focus:ring-cyan-500"
                    />
                    Disparo REAL no Simulador
                </label>
                <p className="text-[10px] text-muted-foreground leading-relaxed pl-5">
                    Se desmarcado, o Sandbox (Play) vai apenas fingir que a API retornou Sucesso sem estourar quotas.
                </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/10">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Salvar Status em</label>
                <input
                    type="text"
                    value={node.data.saveStatusToVariable as string || ""}
                    onChange={(e) => updateNodeData(node.id, { saveStatusToVariable: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                    placeholder="ex: status_code"
                />
            </div>

            {/* Response Mapping Section */}
            <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mapeamento de Resposta</label>
                    <button
                        onClick={() => {
                            const currentMapping = node.data.responseMapping || [];
                            updateNodeData(node.id, {
                                responseMapping: [...currentMapping, { jsonPath: "", variableName: "" }]
                            });
                        }}
                        className="text-cyan-500 hover:text-cyan-400 p-1"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-2">
                    {(node.data.responseMapping || []).map((mapping, index: number) => (
                        <div key={index} className="space-y-1 p-2 bg-muted/20 rounded-md border border-border/30 relative group">
                            <button
                                onClick={() => {
                                    const newMapping = [...(node.data.responseMapping || [])];
                                    newMapping.splice(index, 1);
                                    updateNodeData(node.id, { responseMapping: newMapping });
                                }}
                                className="absolute -top-2 -right-2 bg-background border border-border p-1 rounded-full text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <input
                                type="text"
                                placeholder="Caminho JSON (ex: data.id)"
                                value={mapping.jsonPath}
                                onChange={(e) => {
                                    const newMapping = [...(node.data.responseMapping || [])];
                                    newMapping[index].jsonPath = e.target.value;
                                    updateNodeData(node.id, { responseMapping: newMapping });
                                }}
                                className="w-full bg-transparent border-none text-[11px] font-mono focus:ring-0 p-0"
                            />
                            <div className="h-[1px] bg-border/30 my-1" />
                            <input
                                type="text"
                                placeholder="Variável (ex: user_id)"
                                value={mapping.variableName}
                                onChange={(e) => {
                                    const newMapping = [...(node.data.responseMapping || [])];
                                    newMapping[index].variableName = e.target.value;
                                    updateNodeData(node.id, { responseMapping: newMapping });
                                }}
                                className="w-full bg-transparent border-none text-[11px] font-mono focus:ring-0 p-0 text-cyan-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
