"use client";

import { useState, useRef, useEffect } from "react";
import { X, RotateCcw, Send, Settings, TerminalSquare, Smartphone, Play } from "lucide-react";
import { useSimulator } from "@/hooks/use-simulator";
import { useFlowStore } from "@/store/flow-store";
import { clsx } from "clsx";

export function SimulatorDrawer() {
    const { nodes, edges } = useFlowStore();
    const {
        isOpen,
        isRunning,
        messages,
        logs,
        variables,
        setVariable,
        toggleSimulator,
        startSimulation,
        stopSimulation,
        handleUserInput,
        waitingForInput
    } = useSimulator();

    const [activeTab, setActiveTab] = useState<"chat" | "vars" | "logs">("chat");
    const [inputText, setInputText] = useState("");
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    // Scroll chat bottom
    useEffect(() => {
        if (activeTab === "chat" && endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, waitingForInput, activeTab]);

    if (!isOpen) return null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        handleUserInput(inputText, nodes, edges);
        setInputText("");
    };

    return (
        <div className="w-[400px] h-full border-l border-border/50 bg-background shadow-2xl flex flex-col z-50 transition-transform duration-300 absolute right-0 top-0">
            {/* Cabeçalho do Simulador */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-red-500/10 flex items-center justify-center">
                        <Play className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Sandbox Simulator</h3>
                        <p className="text-xs text-muted-foreground">Testes em Tempo Real</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            stopSimulation();
                            startSimulation(nodes, edges);
                        }}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Reiniciar Simulação"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleSimulator}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex w-full items-center p-2 bg-muted/10 border-b border-border/50 gap-1">
                <button
                    onClick={() => setActiveTab("chat")}
                    className={clsx("flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors", activeTab === "chat" ? "bg-background shadow-sm border border-border/50 text-foreground" : "text-muted-foreground hover:bg-muted/50")}
                >
                    <Smartphone className="w-3.5 h-3.5" /> Chat
                </button>
                <button
                    onClick={() => setActiveTab("vars")}
                    className={clsx("flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors", activeTab === "vars" ? "bg-background shadow-sm border border-border/50 text-foreground" : "text-muted-foreground hover:bg-muted/50")}
                >
                    <Settings className="w-3.5 h-3.5" /> Vars
                </button>
                <button
                    onClick={() => setActiveTab("logs")}
                    className={clsx("flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors", activeTab === "logs" ? "bg-background shadow-sm border border-border/50 text-foreground" : "text-muted-foreground hover:bg-muted/50")}
                >
                    <TerminalSquare className="w-3.5 h-3.5" /> Logs
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-muted/5">

                {/* 📱 CHAT TAB */}
                {activeTab === "chat" && (
                    <div className="absolute inset-0 flex flex-col bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m) => (
                                <div key={m.id} className={clsx("flex flex-col w-full", m.isBot ? "items-start" : "items-end")}>
                                    <div className={clsx(
                                        "max-w-[85%] rounded-lg p-2.5 text-sm whitespace-pre-wrap relative shadow-sm",
                                        m.isBot ? "bg-card text-foreground border border-border/40 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm"
                                    )}>
                                        {m.text}
                                    </div>

                                    {/* MRender de Botoes (Options Block) */}
                                    {m.type === "options" && m.options && waitingForInput && (
                                        <div className="mt-2 flex flex-col gap-2 w-full max-w-[85%]">
                                            {m.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleUserInput(opt, nodes, edges)}
                                                    className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 font-medium text-xs rounded-md border border-blue-500/30 transition-colors"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={endOfMessagesRef} />
                        </div>

                        {/* Input Footer */}
                        <form onSubmit={handleSend} className="p-3 bg-background border-t border-border flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={!waitingForInput}
                                placeholder={waitingForInput ? "Digite sua resposta..." : "Aguarde..."}
                                className="flex-1 rounded-full border border-input bg-muted/50 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!waitingForInput || !inputText.trim()}
                                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}

                {/* ⚙️ VARIABLES TAB */}
                {activeTab === "vars" && (
                    <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 bg-background">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed font-medium">
                                Configure as variáveis mockadas antes da simulação iniciar. Elas afetam os blocos de Roteador e Condicionais de forma idêntica ao que ocorreria na vida real.
                            </p>
                        </div>

                        {Object.entries(variables).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                                <label className="text-xs font-mono font-semibold text-muted-foreground">{key}</label>
                                <input
                                    type="text"
                                    value={String(value)}
                                    onChange={(e) => setVariable(key, e.target.value)}
                                    className="w-full rounded-md border border-input bg-muted/20 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* 👨🏻‍💻 LOGS TAB */}
                {activeTab === "logs" && (
                    <div className="absolute inset-0 overflow-y-auto p-0 bg-[#0d1117]">
                        <div className="p-4 font-mono text-[10px] space-y-1.5 custom-scrollbar">
                            {logs.map((log, i) => (
                                <div key={i} className={clsx(
                                    "flex gap-3 leading-relaxed",
                                    log.type === "error" ? "text-red-400" :
                                        log.type === "warn" ? "text-amber-400" :
                                            log.type === "success" ? "text-green-400" : "text-slate-300"
                                )}>
                                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                                    <span className="break-all">{log.text}</span>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-slate-600 italic">O console de debug está vazio.</div>
                            )}
                            <div ref={endOfMessagesRef} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
