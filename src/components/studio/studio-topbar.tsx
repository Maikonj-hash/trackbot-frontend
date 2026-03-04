import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Play, CheckCircle2, ArrowLeft } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { parseReactFlowToBackend } from "@/lib/flow-parser";
import { Input } from "@/components/ui/input";

export function StudioTopbar() {
    const router = useRouter();
    const { nodes, edges, flowId, flowName, setFlowMetadata, setFlowName } = useFlowStore();
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaved(false);

            // 1. Traduz JSX XYFlow para Record JSON do Backend
            const backendPayload = parseReactFlowToBackend(nodes, edges, flowName);

            // 2. Dispara pra API do NestJS
            const isUpdate = !!flowId;
            const url = isUpdate ? `http://localhost:3000/flows/${flowId}` : "http://localhost:3000/flows";

            const response = await fetch(url, {
                method: isUpdate ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: flowName,
                    description: "Gerado pelo TrackBot Studio Web",
                    jsonContent: {
                        nodes: nodes,
                        edges: edges,
                        backendFlow: backendPayload
                    }
                })
            });

            if (!response.ok) {
                console.error("Erro na API:", response.statusText);
                throw new Error("Falha ao salvar no banco");
            }

            const data = await response.json();

            if (!isUpdate && data.id) {
                // Se era POST, salvar o ID novo no Store
                setFlowMetadata(data.id, data.name, data.description || "");
            }

            console.log("Fluxo salvo com sucesso no PostgreSQL:", data);

            setSaved(true);
            setTimeout(() => setSaved(false), 3000); // Tira o check verde depois de 3 segundos

        } catch (error) {
            console.error(error);
            alert("Erro ao gravar fluxo. Verifique o console.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <header className="h-14 bg-background border-b border-border/50 flex items-center justify-between px-6 z-20 shadow-sm relative">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/studio')}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors mr-2 border border-transparent hover:border-border"
                    title="Voltar para Meus Fluxos"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                </div>
                <div className="flex flex-col">
                    <input
                        type="text"
                        value={flowName}
                        onChange={(e) => setFlowName(e.target.value)}
                        className="bg-transparent border-none text-sm font-semibold tracking-tight text-foreground focus:outline-none focus:ring-0 p-0 hover:bg-muted/50 rounded px-1 -mx-1 transition-colors w-64"
                        placeholder="Nome do Fluxo..."
                    />
                    <p className="text-xs text-muted-foreground leading-none">
                        {nodes.length} Blocos no canvas
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                        </>
                    ) : saved ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" /> Salvo
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" /> Salvar Alterações
                        </>
                    )}
                </button>
            </div>
        </header>
    );
}
