import { Keyboard, X } from "lucide-react";
import { useState } from "react";

export function ShortcutGuide() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-9 h-9 bg-background border border-border shadow-lg rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-500/50 transition-all active:scale-95 group z-[50]"
            >
                <Keyboard className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    const shortcuts = [
        { keys: ["CTRL", "D"], label: "Duplicar Seleção" },
        { keys: ["CTRL", "C"], label: "Copiar Blocos" },
        { keys: ["CTRL", "V"], label: "Colar no Centro" },
        { keys: ["DEL / BACKSPACE"], label: "Deletar Seleção" },
        { keys: ["LSHIFT + CLICK"], label: "Seleção Múltipla" },
        { keys: ["RIGHT CLICK"], label: "Menu de Contexto" },
    ];

    return (
        <div className="fixed bottom-6 right-6 w-64 bg-background border border-border shadow-2xl rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 z-[50]">
            <div className="p-3 bg-muted/20 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Keyboard className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-black font-mono tracking-widest uppercase text-foreground/70">
                        Atalhos de Teclado
                    </span>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                >
                    <X className="w-3 h-3 text-muted-foreground" />
                </button>
            </div>

            <div className="p-3 space-y-2.5">
                {shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                            {s.label}
                        </span>
                        <div className="flex gap-1">
                            {s.keys.map((k, j) => (
                                <kbd key={j} className="px-1.5 py-0.5 bg-muted border border-border/60 rounded text-[9px] font-mono font-bold text-foreground">
                                    {k}
                                </kbd>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-2 bg-blue-500/5 border-t border-border/30">
                <span className="text-[8px] font-mono text-center block text-blue-500/60 uppercase tracking-tighter">
                    Industrial Builder v1.0
                </span>
            </div>
        </div>
    );
}
