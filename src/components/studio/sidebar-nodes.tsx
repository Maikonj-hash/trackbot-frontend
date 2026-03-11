import { memo } from "react";
import { 
    MessageSquare, 
    List, 
    Type, 
    Zap, 
    Clock, 
    Image as ImageIcon, 
    UserCheck, 
    Globe, 
    Variable, 
    ArrowRightLeft,
    GitBranch,
    ClipboardCheck,
    LogOut,
    PlayCircle,
    LucideIcon
} from "lucide-react";

// Definição formal das cores para evitar redundância e facilitar manutenção
const COLOR_MAP = {
    blue: {
        text: "text-blue-400",
        borderHover: "hover:border-blue-500/50",
        glow: "group-hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    },
    purple: {
        text: "text-purple-400",
        borderHover: "hover:border-purple-500/50",
        glow: "group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    },
    amber: {
        text: "text-amber-400",
        borderHover: "hover:border-amber-500/50",
        glow: "group-hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    },
    emerald: {
        text: "text-emerald-400",
        borderHover: "hover:border-emerald-500/50",
        glow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    },
    rose: {
        text: "text-rose-400",
        borderHover: "hover:border-rose-500/50",
        glow: "group-hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    },
} as const;

type ColorKey = keyof typeof COLOR_MAP;

interface BlockDefinition {
    type: string;
    label: string;
    icon: LucideIcon;
    color: ColorKey;
}

interface CategoryDefinition {
    title: string;
    blocks: BlockDefinition[];
}

const CATEGORIES: CategoryDefinition[] = [
    {
        title: "CONTEÚDO",
        blocks: [
            { type: "messageBlock", label: "Mensagem", icon: MessageSquare, color: "blue" },
            { type: "mediaBlock", label: "Arquivo/Mídia", icon: ImageIcon, color: "blue" },
        ]
    },
    {
        title: "INTERAÇÃO",
        blocks: [
            { type: "optionsBlock", label: "Escolhas", icon: List, color: "purple" },
            { type: "inputBlock", label: "Pergunta Livre", icon: Type, color: "purple" },
        ]
    },
    {
        title: "LÓGICA",
        blocks: [
            { type: "conditionBlock", label: "Condição (IF)", icon: Zap, color: "amber" },
            { type: "switchBlock", label: "Switch/Case", icon: GitBranch, color: "amber" },
            { type: "delayBlock", label: "Aguardar", icon: Clock, color: "amber" },
        ]
    },
    {
        title: "CRM & DADOS",
        blocks: [
            { type: "identificationBlock", label: "Identificação", icon: UserCheck, color: "emerald" },
            { type: "variableBlock", label: "Variavel", icon: Variable, color: "emerald" },
            { type: "reviewBlock", label: "Revisão", icon: ClipboardCheck, color: "emerald" },
        ]
    },
    {
        title: "AVANÇADO",
        blocks: [
            { type: "webhookBlock", label: "Integração/API", icon: Globe, color: "rose" },
            { type: "handoverBlock", label: "Transbordo", icon: ArrowRightLeft, color: "rose" },
        ]
    },
    {
        title: "FLUXO",
        blocks: [
            { type: "jumpBlock", label: "Salto/Jump", icon: Zap, color: "rose" },
            { type: "endBlock", label: "Encerrar", icon: LogOut, color: "rose" },
        ]
    }
];

export const SidebarNodes = memo(function SidebarNodes() {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/reactflow-label", label);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="w-72 bg-background/40 backdrop-blur-xl border-r border-border/50 flex flex-col h-full overflow-hidden z-10">
            {/* Header da Sidebar */}
            <div className="p-4 border-b border-border/50 bg-card/20">
                <div className="flex items-center gap-2 mb-1">
                    <PlayCircle className="w-4 h-4 text-blue-500" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/70 font-mono">
                        Node Library
                    </h2>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider opacity-50">
                    Industrial Builder v2.0
                </p>
            </div>

            {/* Lista de Blocos Categorizada */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-border/50">
                {CATEGORIES.map((category) => (
                    <div key={category.title} className="space-y-3">
                        <h3 className="text-[9px] font-bold text-muted-foreground/40 font-mono tracking-[0.3em] uppercase pl-1 border-l-2 border-border/20">
                            {category.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-2">
                            {category.blocks.map((block) => {
                                const styles = COLOR_MAP[block.color];
                                const Icon = block.icon;

                                return (
                                    <div
                                        key={block.type}
                                        className={`
                                            group flex items-center gap-3 p-3 bg-card/30 
                                            border border-border/40 rounded-xl cursor-grab active:cursor-grabbing 
                                            transition-all duration-300 ${styles.borderHover} ${styles.glow}
                                            hover:bg-card/60 hover:-translate-y-0.5
                                        `}
                                        onDragStart={(event) => onDragStart(event, block.type, block.label)}
                                        draggable
                                    >
                                        <div className={`p-2 rounded-lg bg-background/50 border border-border/30 group-hover:border-foreground/10 transition-colors shadow-inner`}>
                                            <Icon className={`w-4 h-4 ${styles.text} transition-transform group-hover:scale-110`} />
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                                                {block.label}
                                            </span>
                                            <span className="text-[8px] font-mono uppercase tracking-tighter text-muted-foreground/40 mt-0.5">
                                                {block.type.replace('Block', '')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Footer */}
            <div className="p-4 border-t border-border/30 bg-card/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest font-bold">
                        Builder Studio 2.0
                    </span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest">
                    v2.0.4-PRO
                </span>
            </div>
        </aside>
    );
});
