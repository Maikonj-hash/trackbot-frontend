"use client";

import { useFlowStore } from "@/store/flow-store";
import { Braces, X, Search, Database, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { VariableHighlighter } from "./nodes/base/variable-highlighter";
import { clsx } from "clsx";

/**
 * Gaveta lateral para visualização e gerenciamento de variáveis.
 * Estética premium com busca e destaque visual.
 */
export function VariablesDrawer() {
    const isVariablesDrawerOpen = useFlowStore(s => s.isVariablesDrawerOpen);
    const setVariablesDrawerOpen = useFlowStore(s => s.setVariablesDrawerOpen);
    const nodes = useFlowStore(s => s.nodes);
    const getVariables = useFlowStore(s => s.getVariables);
    
    const [search, setSearch] = useState("");

    // Otimização: Só calcula variáveis se a drawer estiver aberta
    // E ignoramos mudanças de posição criando um hash apenas dos dados/labels
    const nodesDataHash = useMemo(() => {
        return nodes.map(n => JSON.stringify(n.data)).join('|');
    }, [nodes]);

    const allVariables = useMemo(() => {
        if (!isVariablesDrawerOpen) return [];
        return getVariables();
    }, [isVariablesDrawerOpen, nodesDataHash, getVariables]);

    const filteredVariables = allVariables.filter(v =>
        v.toLowerCase().includes(search.toLowerCase())
    );

    if (!isVariablesDrawerOpen) return null;

    return (
        <div className="w-80 h-full border-l border-border/50 bg-background/95 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                        <Braces className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-tight">Variáveis do Fluxo</h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">{allVariables.length} detectadas</p>
                    </div>
                </div>
                <button
                    onClick={() => setVariablesDrawerOpen(false)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Busca */}
            <div className="px-4 py-3 border-b border-border/30">
                <div className="relative group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar variável..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-muted/30 border border-border/50 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {filteredVariables.length > 0 ? (
                    <div className="space-y-2">
                        {filteredVariables.map((variable) => (
                            <div
                                key={variable}
                                className="group flex flex-col gap-2 p-3 rounded-lg border border-border/50 bg-muted/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-default"
                            >
                                <div className="flex items-center justify-between">
                                    <VariableHighlighter text={`{{${variable}}}`} />
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Database className="w-3 h-3 text-muted-foreground/40" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/40 rounded-xl bg-muted/5">
                        <Search className="w-8 h-8 text-muted-foreground/20 mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">Nenhuma variável encontrada</p>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-border/50 bg-muted/20">
                <div className="flex gap-2 p-3 rounded-md bg-blue-500/5 border border-blue-500/10">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-600/80 leading-relaxed italic">
                        Variáveis são detectadas automaticamente ao serem criadas ou mencionadas em blocos de texto.
                    </p>
                </div>
            </div>
        </div>
    );
}
