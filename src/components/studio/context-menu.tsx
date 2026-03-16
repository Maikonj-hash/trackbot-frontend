import { 
    Copy, 
    Trash2, 
    Files,
    ArrowUpFromLine
} from "lucide-react";
import { useEffect, useRef } from "react";

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onDuplicate: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onDelete: () => void;
    hasSelection: boolean;
    canPaste: boolean;
}

export function ContextMenu({ 
    x, y, onClose, onDuplicate, onCopy, onPaste, onDelete, hasSelection, canPaste 
}: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div 
            ref={menuRef}
            className="fixed z-[100] w-48 bg-background border border-border shadow-2xl rounded-lg py-1 animate-in fade-in zoom-in duration-100"
            style={{ top: y, left: x }}
        >
            <div className="px-3 py-1.5 border-b border-border/50 mb-1">
                <span className="text-[9px] font-black font-mono tracking-widest text-muted-foreground/50 uppercase">
                    Ações de Bloco
                </span>
            </div>

            <button 
                onClick={() => { onDuplicate(); onClose(); }}
                disabled={!hasSelection}
                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-foreground/80 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors group"
            >
                <Files className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                Duplicar
                <span className="ml-auto text-[9px] text-muted-foreground/40 font-mono">CTRL+D</span>
            </button>

            <button 
                onClick={() => { onCopy(); onClose(); }}
                disabled={!hasSelection}
                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-foreground/80 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors group"
            >
                <Copy className="w-3.5 h-3.5 text-purple-500 group-hover:scale-110 transition-transform" />
                Copiar
                <span className="ml-auto text-[9px] text-muted-foreground/40 font-mono">CTRL+C</span>
            </button>

            <button 
                onClick={() => { onPaste(); onClose(); }}
                disabled={!canPaste}
                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-foreground/80 hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent transition-colors group"
            >
                <ArrowUpFromLine className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                Colar
                <span className="ml-auto text-[9px] text-muted-foreground/40 font-mono">CTRL+V</span>
            </button>

            <div className="my-1 border-t border-border/50" />

            <button 
                onClick={() => { onDelete(); onClose(); }}
                disabled={!hasSelection}
                className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-rose-500 hover:bg-rose-500/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors group"
            >
                <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                Remover
                <span className="ml-auto text-[9px] text-muted-foreground/40 font-mono">DEL</span>
            </button>
        </div>
    );
}
