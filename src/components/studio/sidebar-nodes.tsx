import {
    MessageSquareText,
    ListOrdered,
    Split,
    Clock,
    Globe,
    Headset,
    Keyboard,
    Image as ImageIcon,
    Variable,
    CircleStop,
    UserPlus,
    GitBranch,
    ClipboardCheck
} from "lucide-react";

export const FLOW_BLOCKS = [
    {
        type: "messageBlock",
        label: "Mensagem",
        description: "Envia um texto simples",
        icon: MessageSquareText,
        color: "text-blue-600",
        bgColor: "bg-blue-600/10",
        borderColor: "border-blue-600/20"
    },
    {
        type: "optionsBlock",
        label: "Menu de Opções",
        description: "Botões ou lista de escolhas",
        icon: ListOrdered,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        type: "inputBlock",
        label: "Aguardar Resposta",
        description: "Espera e salva o que digitar",
        icon: Keyboard,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        borderColor: "border-violet-500/20"
    },
    {
        type: "switchBlock",
        label: "Roteador (Switch)",
        description: "Rotas múltiplas por variável",
        icon: GitBranch,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
    },
    {
        type: "conditionBlock",
        label: "Condição (If/Else)",
        description: "Muda o caminho por regras",
        icon: Split,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20"
    },
    {
        type: "delayBlock",
        label: "Atraso (Delay)",
        description: "Pausa simulando digitação",
        icon: Clock,
        color: "text-slate-400",
        bgColor: "bg-slate-400/10",
        borderColor: "border-slate-400/20"
    },
    {
        type: "mediaBlock",
        label: "Multimídia",
        description: "Imagens, vídeos ou áudios",
        icon: ImageIcon,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20"
    },
    {
        type: "webhookBlock",
        label: "Webhook (API)",
        description: "Integra com sistemas externos",
        icon: Globe,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20"
    },
    {
        type: "variableBlock",
        label: "Definir Variável",
        description: "Altera dados e pontuações",
        icon: Variable,
        color: "text-fuchsia-500",
        bgColor: "bg-fuchsia-500/10",
        borderColor: "border-fuchsia-500/20"
    },
    {
        type: "handoverBlock",
        label: "Atendimento Humano",
        description: "Transfere para o chat ao vivo",
        icon: Headset,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20"
    },
    {
        type: "identificationBlock",
        label: "Identificação",
        description: "Formulário para identificar o cliente (Nome, CPF, etc)",
        icon: UserPlus,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
    },
    {
        type: "reviewBlock",
        label: "Revisão de Dados",
        description: "Confirmação de variáveis coletadas",
        icon: ClipboardCheck,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20"
    },
    {
        type: "endBlock",
        label: "Encerrar Chat",
        description: "Finaliza o fluxo atual",
        icon: CircleStop,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
    }
];

export function SidebarNodes() {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/reactflow-label", label);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside className="w-72 border-r border-border/50 bg-background/95 shadow-lg flex flex-col z-10 transition-transform duration-300">
            <div className="p-4 border-b border-border/50 bg-card/50">
                <h2 className="text-sm font-semibold tracking-tight">Biblioteca de Blocos</h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Arraste e solte no canvas para construir seu Chatbot.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
                {FLOW_BLOCKS.map((block) => (
                    <div
                        key={block.type}
                        onDragStart={(e) => onDragStart(e, block.type, block.label)}
                        draggable
                        className={`flex items-start gap-3 p-3 rounded-lg border border-transparent hover:${block.borderColor} hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm`}
                    >
                        <div className={`mt-0.5 p-2 rounded-md ${block.bgColor}`}>
                            <block.icon className={`w-4 h-4 ${block.color}`} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{block.label}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{block.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
