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
    Ticket,
    LucideIcon
} from "lucide-react";

export type NodeColorKey = 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';

export interface NodeDefinition {
    type: string;
    label: string;
    icon: LucideIcon;
    color: NodeColorKey;
    initialData: Record<string, any>;
    category: string;
    description: string;
}

export const sanitizeVariableName = (name: string) => {
    return name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_.]/g, '');
};

export const NODE_REGISTRY: Record<string, NodeDefinition> = {
    messageBlock: {
        type: "messageBlock",
        label: "Mensagem",
        icon: MessageSquare,
        color: "blue",
        category: "CONTEÚDO",
        description: "Envia uma mensagem de texto simples.",
        initialData: { content: "", label: "Mensagem de Texto", allowBack: false }
    },
    mediaBlock: {
        type: "mediaBlock",
        label: "Arquivo/Mídia",
        icon: ImageIcon,
        color: "blue",
        category: "CONTEÚDO",
        description: "Envia imagens, vídeos ou documentos.",
        initialData: { mediaType: "image", content: "", label: "Mídia/Arquivo", allowBack: false }
    },
    optionsBlock: {
        type: "optionsBlock",
        label: "Escolhas",
        icon: List,
        color: "purple",
        category: "INTERAÇÃO",
        description: "Apresenta um menu de opções para o usuário.",
        initialData: { options: ["Opção 1", "Opção 2"], content: "Selecione uma opção:", label: "Menu de Opções", allowBack: false }
    },
    inputBlock: {
        type: "inputBlock",
        label: "Pergunta Livre",
        icon: Type,
        color: "purple",
        category: "INTERAÇÃO",
        description: "Coleta uma resposta de texto do usuário.",
        initialData: { content: "Digite sua resposta:", variableName: "", label: "Pergunta Aberta", allowBack: false }
    },
    conditionBlock: {
        type: "conditionBlock",
        label: "Condição (IF)",
        icon: Zap,
        color: "amber",
        category: "LÓGICA",
        description: "Direciona o fluxo baseado em uma variável.",
        initialData: { conditionVariable: "", conditionOperator: "EQUALS", conditionValue: "", label: "Verificação Lógica" }
    },
    switchBlock: {
        type: "switchBlock",
        label: "Switch/Case",
        icon: GitBranch,
        color: "amber",
        category: "LÓGICA",
        description: "Múltiplos caminhos baseados em valores exatos.",
        initialData: { switchVariable: "", switchBranches: [], label: "Roteador Switch" }
    },
    delayBlock: {
        type: "delayBlock",
        label: "Aguardar",
        icon: Clock,
        color: "amber",
        category: "LÓGICA",
        description: "Pausa o fluxo por alguns segundos.",
        initialData: { delayMs: 2000, label: "Pausa/Delay" }
    },
    identificationBlock: {
        type: "identificationBlock",
        label: "Identificação",
        icon: UserCheck,
        color: "emerald",
        category: "CRM",
        description: "Coleta dados do cliente (Nome, E-mail, etc).",
        initialData: { 
            identificationFields: [
                { label: "Qual seu nome?", type: "TEXT", saveToVariable: "user_name" }
            ], 
            content: "Para começarmos, identifique-se por favor:",
            label: "Identificação do Autor", 
            skipIfAlreadyFilled: false,
            allowBack: false 
        }
    },
    variableBlock: {
        type: "variableBlock",
        label: "Variavel",
        icon: Variable,
        color: "emerald",
        category: "DADOS",
        description: "Define ou manipula valores de variáveis.",
        initialData: { variableName: "", variableAction: "SET", variableValue: "", label: "Definir Variável" }
    },
    reviewBlock: {
        type: "reviewBlock",
        label: "Revisão",
        icon: ClipboardCheck,
        color: "emerald",
        category: "CRM",
        description: "Permite ao usuário revisar dados coletados.",
        initialData: { 
            fields: [], 
            content: "Confirme se seus dados estão corretos:",
            label: "Revisão de Dados", 
            skipIfAlreadyFilled: false, 
            allowBack: true 
        }
    },
    webhookBlock: {
        type: "webhookBlock",
        label: "Integração/API",
        icon: Globe,
        color: "rose",
        category: "AVANÇADO",
        description: "Integra com sistemas externos via HTTP.",
        initialData: { webhookMethod: "POST", content: "https://api.exemplo.com", label: "Chamada de API/Webhook" }
    },
    handoverBlock: {
        type: "handoverBlock",
        label: "Transbordo",
        icon: ArrowRightLeft,
        color: "rose",
        category: "AVANÇADO",
        description: "Transfere o atendimento para um humano.",
        initialData: { label: "Transbordo Humano", content: "Departamento Financeiro" }
    },
    trackDeskBlock: {
        type: "trackDeskBlock",
        label: "Track-Desk",
        icon: Ticket,
        color: "blue",
        category: "AVANÇADO",
        description: "Cria chamados automaticamente no Track-Desk.",
        initialData: { 
            type: "TRACK_DESK",
            webhookMethod: "POST", 
            content: "{{sys.desk_url}}", 
            label: "Ticket Track-Desk",
            bodyPayload: JSON.stringify({
              cliente: "{{contact.name}}",
              telefone: "{{contact.phone}}",
              tipoProblema: "{{assunto}}",
              descricao: "{{descricao}}",
              severidade: "MEDIA",
              protocolo: "{{sys.protocol}}",
              projetoId: "",
              municipioId: "",
              nucleoId: "",
              estado: "",
              cidade: ""
            }, null, 2),
            headers: {
              "x-api-key": "test123"
            }
        }
    },
    segmentBlock: {
        type: "segmentBlock",
        label: "Segmentador",
        icon: Zap,
        color: "blue",
        category: "FLUXO",
        description: "Agrupa blocos visualmente por contexto.",
        initialData: { color: "#3b82f6", label: "Novo Segmento" }
    },
    jumpBlock: {
        type: "jumpBlock",
        label: "Salto/Jump",
        icon: Zap,
        color: "rose",
        category: "FLUXO",
        description: "Salta para outro ponto do fluxo sem fios.",
        initialData: { targetStepId: "", label: "Salto de Fluxo" }
    },
    endBlock: {
        type: "endBlock",
        label: "Encerrar",
        icon: LogOut,
        color: "rose",
        category: "FLUXO",
        description: "Finaliza a interação do bot.",
        initialData: { label: "Fim do Fluxo", endResetType: "IMMEDIATE" }
    }
};

export const getColorClass = (color: NodeColorKey) => {
    const map = {
        blue: "text-blue-400 border-blue-500/50 hover:bg-blue-500/10",
        purple: "text-purple-400 border-purple-500/50 hover:bg-purple-500/10",
        amber: "text-amber-400 border-amber-500/50 hover:bg-amber-500/10",
        emerald: "text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/10",
        rose: "text-rose-400 border-rose-500/50 hover:bg-rose-500/10",
    };
    return map[color] || map.blue;
};
