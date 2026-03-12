"use client";

import { useFlowStore } from "@/store/flow-store";
import { Braces, X, Search, Database, Info, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { VariableHighlighter } from "./nodes/base/variable-highlighter";
import { clsx } from "clsx";

const GLOBAL_VARIABLES = [
    { name: "sys.time", description: "Imprime a hora exata local", example: "14:30" },
    { name: "sys.date", description: "Imprime a data de hoje", example: "11/03/2026" },
    { name: "sys.datetime", description: "Imprime a data e hora juntos", example: "11/03/2026, 14:30:00" },
    { name: "sys.greeting", description: "A famosa saudação inteligente", example: "Bom dia, Boa tarde..." },
    { name: "sys.day_name", description: "O dia da semana por extenso", example: "Segunda-feira" },
    { name: "sys.month_name", description: "O mês atual por extenso", example: "Março" },
    { name: "sys.year", description: "O ano atual com 4 dígitos", example: "2026" },
    { name: "sys.protocol", description: "Gera um número de protocolo único", example: "20260311-165030-1234" },
    { name: "sys.payload", description: "JSON completo do chamado (Dados + Respostas)", example: "{ 'ticket': {...}, 'customer': {...} }" },
    { name: "user.name", description: "O nome rastreado do cliente", example: "João Santos" },
    { name: "user.phone", description: "O número de WhatsApp do cliente", example: "5511999999999" },
];

/**
 * Gaveta lateral para visualização e gerenciamento de variáveis.
 * Estética premium com busca e destaque visual e abas para globais/locais.
 */
export function VariablesDrawer() {
    const isVariablesDrawerOpen = useFlowStore(s => s.isVariablesDrawerOpen);
    const setVariablesDrawerOpen = useFlowStore(s => s.setVariablesDrawerOpen);
    const nodes = useFlowStore(s => s.nodes);
    const getVariables = useFlowStore(s => s.getVariables);
    
    const [search, setSearch] = useState("");
    const [expandedSections, setExpandedSections] = useState({ global: true, local: true });

    const toggleSection = (section: 'global' | 'local') => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Otimização: Só calcula variáveis locais se a drawer estiver aberta
    const nodesDataHash = useMemo(() => {
        return nodes.map(n => JSON.stringify(n.data)).join('|');
    }, [nodes]);

    const allLocalVariables = useMemo(() => {
        if (!isVariablesDrawerOpen) return [];
        return getVariables();
    }, [isVariablesDrawerOpen, nodesDataHash, getVariables]);

    const filteredLocalVariables = allLocalVariables.filter(v =>
        v.toLowerCase().includes(search.toLowerCase())
    );

    const filteredGlobalVariables = GLOBAL_VARIABLES.filter(v => 
        v.name.toLowerCase().includes(search.toLowerCase()) || 
        v.description.toLowerCase().includes(search.toLowerCase())
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
                        <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                            Gerenciador de Variáveis
                        </h3>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">{(allLocalVariables.length + GLOBAL_VARIABLES.length)} mapeadas</p>
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
                        placeholder="Buscar variável (ex: sys.time)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-muted/30 border border-border/50 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Lista Principal com Accordions */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-4 pb-12">
                
                {/* Accordion Globais */}
                {(filteredGlobalVariables.length > 0 || search) && (
                    <div className="space-y-1">
                        <button 
                            onClick={() => toggleSection('global')}
                            className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">Variáveis do Sistema</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-medium text-muted-foreground bg-muted/50 px-1.5 rounded">{filteredGlobalVariables.length}</span>
                                {expandedSections.global ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                            </div>
                        </button>
                        
                        {expandedSections.global && (
                            <div className="space-y-1.5 pt-1 pl-1">
                                {filteredGlobalVariables.length > 0 ? (
                                    filteredGlobalVariables.map((v) => (
                                        <div key={v.name} className="flex flex-col gap-1 p-2.5 rounded-lg border border-border/50 bg-muted/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all">
                                            <div className="flex items-center justify-between">
                                                <VariableHighlighter text={`{{${v.name}}}`} />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{v.description}</p>
                                            <p className="text-[10px] font-mono text-blue-500/80 italic mt-0.5 opacity-80">Ex: {v.example}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground/60 border border-dashed border-border/40 rounded-lg">
                                        Nenhuma variável de sistema encontrada.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}


                {/* Accordion Locais (Metadata) */}
                {(filteredLocalVariables.length > 0 || search) && (
                    <div className="space-y-1">
                        <button 
                            onClick={() => toggleSection('local')}
                            className="w-full px-2 py-1.5 flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                <Database className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">Variáveis do Fluxo (Locais)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-medium text-muted-foreground bg-muted/50 px-1.5 rounded">{filteredLocalVariables.length}</span>
                                {expandedSections.local ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                            </div>
                        </button>
                        
                        {expandedSections.local && (
                            <div className="space-y-1.5 pt-1 pl-1">
                                {filteredLocalVariables.length > 0 ? (
                                    filteredLocalVariables.map((variable) => (
                                        <div key={variable} className="flex flex-col gap-1 p-2.5 rounded-lg border border-border/50 bg-muted/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
                                            <div className="flex items-center justify-between">
                                                <VariableHighlighter text={`{{${variable}}}`} />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Capturada em nós do tipo Input/Identificação.</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-muted-foreground/60 border border-dashed border-border/40 rounded-lg">
                                        Nenhuma variável customizada detectada neste fluxo.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State Geral */}
                {filteredGlobalVariables.length === 0 && filteredLocalVariables.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/40 rounded-xl bg-muted/5 mt-4">
                        <Search className="w-8 h-8 text-muted-foreground/20 mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">Nenhuma variável encontrada</p>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-border/50 bg-muted/20 shrink-0">
                <div className="flex gap-2 p-3 rounded-md bg-blue-500/5 border border-blue-500/10">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-600/80 leading-relaxed italic">
                        Variáveis Globais são sempre acessíveis. Variáveis de Fluxo são detectadas ao serem criadas em blocos de Entrada de Dados.
                    </p>
                </div>
            </div>
        </div>
    );
}
