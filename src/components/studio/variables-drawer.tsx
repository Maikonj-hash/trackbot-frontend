"use client";

import { useFlowStore } from "@/store/flow-store";
import { useState, useMemo } from "react";
import { Braces, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const GLOBAL_VARIABLES = [
    { name: "sys.time", description: "Hora local exata", example: "14:30" },
    { name: "sys.date", description: "Data atual", example: "11/03/2026" },
    { name: "sys.datetime", description: "Data e hora", example: "11/03/2026, 14:30" },
    { name: "sys.greeting", description: "Saudação dinâmica", example: "Bom dia/tarde" },
    { name: "sys.day_name", description: "Dia da semana", example: "Segunda-feira" },
    { name: "sys.year", description: "Ano atual", example: "2026" },
    { name: "contact.name", description: "Nome capturado no CRM", example: "João Silva" },
    { name: "contact.phone", description: "WhatsApp real do cliente", example: "5511999999999" },
    { name: "wpp_name", description: "Gatilho: Capturar Nome", example: "Use no nó de Identificação" },
    { name: "wpp_phone", description: "Gatilho: Capturar WhatsApp", example: "Use no nó de Identificação" },
    { name: "sys.protocol", description: "Protocolo único", example: "20260311-1234" },
    { name: "sys.payload", description: "JSON completo do evento (Ticket + Cliente + Jornada)", example: "{ \"ticket\": {...}, \"customer\": {...} }" },
    { name: "metadata.field", description: "Acessa campos personalizados do cliente", example: "{{metadata.email}}, {{metadata.orderId}}" },
];

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

    const nodesDataHash = useMemo(() => {
        return nodes.map((n: any) => JSON.stringify(n.data)).join('|');
    }, [nodes]);

    const allLocalVariables = useMemo(() => {
        if (!isVariablesDrawerOpen) return [];
        return getVariables();
    }, [isVariablesDrawerOpen, nodesDataHash, getVariables]);

    const filteredLocalVariables = allLocalVariables.filter((v: string) =>
        v.toLowerCase().includes(search.toLowerCase())
    );

    const filteredGlobalVariables = GLOBAL_VARIABLES.filter(v => 
        v.name.toLowerCase().includes(search.toLowerCase()) || 
        v.description.toLowerCase().includes(search.toLowerCase())
    );

    if (!isVariablesDrawerOpen) return null;

    return (
        <TooltipProvider delayDuration={100}>
            <div className="w-72 h-full border-l border-border/30 bg-background flex flex-col z-50">
                {/* Header Industrial */}
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                    <div className="flex items-center gap-2">
                        <Braces className="w-3.5 h-3.5 text-muted-foreground/30" />
                        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                            Variable_Engine
                        </h3>
                    </div>
                    <button
                        onClick={() => setVariablesDrawerOpen(false)}
                        className="p-1 text-muted-foreground/50 hover:text-foreground"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Busca Minimalista */}
                <div className="px-4 py-2 border-b border-border/30">
                    <input
                        type="text"
                        placeholder="FILTER_ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent border-b border-border/20 py-1 text-[10px] font-mono focus:outline-none focus:border-blue-500/50 transition-colors placeholder:opacity-10 uppercase"
                    />
                </div>

                {/* Lista Técnica */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                    
                    {/* Variáveis de Sistema */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => toggleSection('global')}
                            className="flex items-center gap-2 w-full text-left opacity-30"
                        >
                            <span className="text-[9px] font-bold uppercase tracking-widest">// SYSTEM_GLOBAL</span>
                            <div className="flex-1 h-[1px] bg-border/20" />
                        </button>
                        
                        {expandedSections.global && (
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                                {filteredGlobalVariables.map((v) => (
                                    <Tooltip key={v.name}>
                                        <TooltipTrigger asChild>
                                            <span className="text-[10px] font-mono text-blue-500/60 cursor-help">
                                                {`{{${v.name}}}`}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="left" className="bg-background border border-border shadow-xl p-3 max-w-[200px]">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{v.name}</p>
                                                <p className="text-[10px] text-foreground/80 leading-relaxed font-mono">{v.description}</p>
                                                <p className="text-[9px] text-muted-foreground italic border-t border-border/10 pt-1">Ex: {v.example}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Variáveis de Fluxo */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => toggleSection('local')}
                            className="flex items-center gap-2 w-full text-left opacity-30"
                        >
                            <span className="text-[9px] font-bold uppercase tracking-widest">// FLOW_CUSTOM</span>
                            <div className="flex-1 h-[1px] bg-border/20" />
                        </button>
                        
                        {expandedSections.local && (
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                                {filteredLocalVariables.map((variable: string) => (
                                    <span key={variable} className="text-[10px] font-mono text-emerald-500/60">
                                        {`{{${variable}}}`}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Status */}
                <div className="p-4 border-t border-border/30">
                    <div className="flex items-center gap-2 opacity-20">
                        <Info className="w-3 h-3" />
                        <span className="text-[8px] font-mono uppercase tracking-tighter">ENGINE_STATE: READY</span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
