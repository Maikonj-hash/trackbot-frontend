import { create } from "zustand";
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from "@xyflow/react";

// Tipo Global do Bot (Para mesclarmos depois ao Flow Master do Backend)
// Enumerações Estritas para Blindagem
export type ConditionOperator = 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'IS_EMPTY' | 'IS_NOT_EMPTY';
export type MediaType = 'image' | 'video' | 'audio' | 'document';
export type VariableAction = 'SET' | 'INCREMENT' | 'DECREMENT';
export type WebhookMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type TrackerNodeData = {
    label: string;
    type: string;
    content?: string;
    options?: string[];
    delayMs?: number;

    // Interactive Options
    useNativeButtons?: boolean;
    listButtonLabel?: string;
    listTitle?: string;
    listFooter?: string;
    dynamicOptionsVariable?: string; // Futuro: carregar opções de uma var

    // Condition
    conditionVariable?: string;
    conditionOperator?: ConditionOperator;
    conditionValue?: string | boolean;

    // Media
    mediaType?: MediaType;

    // Variable
    variableName?: string;
    variableAction?: VariableAction;
    variableValue?: string;

    // Webhook
    webhookMethod?: WebhookMethod;
    timeout?: number;
    saveStatusToVariable?: string;
    saveResponseToVariable?: string;
    responseMapping?: Array<{
        jsonPath: string;
        variableName: string;
    }>;
    headers?: Record<string, string>;
    bodyPayload?: any;

    // Customer Identification
    identificationFields?: Array<{
        label: string;
        type: 'TEXT' | 'EMAIL' | 'PHONE' | 'NUMBER' | 'CPF';
        saveToVariable: string;
    }>;
    submitButtonText?: string;
    skipIfAlreadyFilled?: boolean;
};

// Cérebro Global (Armazena tudo o que acontece no Studio na Memória RAM limpa)
type FlowState = {
    flowId: string | null;
    flowName: string;
    flowDescription: string;

    nodes: Node<TrackerNodeData>[];
    edges: Edge[];
    selectedNode: Node<TrackerNodeData> | null;
    isDirty: boolean; // Rastreia mudanças não salvas
    onNodesChange: OnNodesChange<Node<TrackerNodeData>>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setSelectedNode: (nodeId: string | null) => void;
    updateNodeData: (nodeId: string, data: Partial<TrackerNodeData>) => void;
    deleteNode: (nodeId: string) => void;
    addNode: (node: Node<TrackerNodeData>) => void;

    setFlowMetadata: (id: string, name: string, description: string) => void;
    setFlowName: (name: string) => void;
    setFlow: (nodes: Node<TrackerNodeData>[], edges: Edge[]) => void;
    setSaved: () => void; // Reseta o estado Dirty
};

export const useFlowStore = create<FlowState>((set, get) => ({
    flowId: null,
    flowName: "Fluxo Sem Título",
    flowDescription: "",

    nodes: [
        {
            id: "start-1",
            type: "startBlock",
            position: { x: 250, y: 150 },
            data: { label: "Início", type: "start", content: "Ponto de Partida" },
        },
    ],
    edges: [],
    selectedNode: null,
    isDirty: false,

    // Eventos Nativos do React Flow para mover as caixas fluidamente
    onNodesChange: (changes: NodeChange<Node<TrackerNodeData>>[]) => {
        // Blindagem extra contra a Lixeira Nativa (tecla Delete/Backspace)
        const safeChanges = changes.filter(c => !(c.type === 'remove' && c.id === 'start-1'));
        set({
            nodes: applyNodeChanges(safeChanges, get().nodes),
            isDirty: changes.length > 0, // Qualquer mudança física marca como Dirty
        });
    },

    // Eventos Nativos do React Flow para apagar/mover Fios e Arestas
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
            isDirty: true,
        });
    },

    // Conectar um Ponto A no Ponto B (Fio Redondo)
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
            isDirty: true,
        });
    },

    // Selecionar uma Caixa (Para abrir a Barra de configurações a direita)
    setSelectedNode: (nodeId: string | null) => {
        if (!nodeId) {
            set({ selectedNode: null });
            return;
        }
        const node = get().nodes.find((n) => n.id === nodeId);
        set({ selectedNode: node || null });
    },

    // Quando o usuário digitar algo na 'Caixinha', atualiza o Grid em Tempo real
    updateNodeData: (nodeId: string, data: Partial<TrackerNodeData>) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // Blindagem: Sanitização de dados numéricos
                    const sanitizedData = { ...data };
                    if (sanitizedData.delayMs !== undefined) {
                        sanitizedData.delayMs = Math.max(0, sanitizedData.delayMs);
                    }

                    // Precisamos clonar o nó para o React perceber a alteração e pintar novamente
                    const updatedNode = { ...node, data: { ...node.data, ...sanitizedData } };

                    // Atualiza o Painel Lateral também de brinde
                    if (get().selectedNode?.id === nodeId) {
                        set({ selectedNode: updatedNode });
                    }
                    return updatedNode;
                }
                return node;
            }),
            isDirty: true,
        });
    },

    // Deletar a caixa e todos os fios conectados a ela
    deleteNode: (nodeId: string) => {
        if (nodeId === "start-1") return; // Mágica 2: Bloco Intocável
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
            selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
            isDirty: true,
        });
    },

    // Injetar uma caixa do Ponto Cego para o Mundo Virtual
    addNode: (node: Node<TrackerNodeData>) => {
        const exists = get().nodes.some(n => n.id === node.id);
        const safeNode = exists ? { ...node, id: `${node.id}-${Date.now()}` } : node;

        set({
            nodes: [...get().nodes, safeNode],
            isDirty: true,
        });
    },

    // Hydration (Carregar arquivo salvo de volta pra tela)
    setFlow: (nodes, edges) => {
        let hydratedNodes = nodes;
        // Mágica 6: Garantir que fluxos vazios/novos criados no banco não percam o Bloco Início do Frontend
        const hasStart = nodes.some(n => n.id === "start-1" || n.type === "startBlock");
        if (!hasStart) {
            hydratedNodes = [
                {
                    id: "start-1",
                    type: "startBlock",
                    position: { x: 250, y: 150 },
                    data: { label: "Início", type: "start", content: "Ponto de Partida" },
                },
                ...nodes
            ];
        }
        set({ nodes: hydratedNodes, edges, selectedNode: null, isDirty: false });
    },

    // Salvar qual ID de fluxo o usuário abriu
    setFlowMetadata: (id, name, description) => {
        set({ flowId: id, flowName: name, flowDescription: description });
    },

    setFlowName: (name: string) => {
        set({ flowName: name, isDirty: true });
    },

    setSaved: () => {
        set({ isDirty: false });
    }
}));
