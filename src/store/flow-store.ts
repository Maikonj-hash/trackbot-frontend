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

export type ConditionOperator = 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'IS_EMPTY' | 'IS_NOT_EMPTY';
export type MediaType = 'image' | 'video' | 'audio' | 'document';
export type VariableAction = 'SET' | 'INCREMENT' | 'DECREMENT';
export type WebhookMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type TrackerNodeData = {
    label: string;
    type: string;
    color?: string;
    content?: string;
    options?: string[];
    delayMs?: number;
    allowBack?: boolean;

    useNativeButtons?: boolean;
    listButtonLabel?: string;
    listTitle?: string;
    listFooter?: string;
    dynamicOptionsVariable?: string;

    conditionVariable?: string;
    conditionOperator?: ConditionOperator;
    conditionValue?: string | boolean;

    mediaType?: MediaType;

    variableName?: string;
    expectedType?: 'TEXT' | 'CEP' | 'LICENSE_PLATE' | 'DATE' | 'TIME' | 'EMAIL' | 'PHONE' | 'CPF_CNPJ' | 'NUMBER';
    errorMessage?: string;
    maxRetries?: number;
    variableAction?: VariableAction;
    variableValue?: string;
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

    identificationFields?: Array<{
        label: string;
        type: 'TEXT' | 'EMAIL' | 'PHONE' | 'NUMBER' | 'CPF';
        saveToVariable: string;
    }>;
    submitButtonText?: string;
    skipIfAlreadyFilled?: boolean;

    fields?: Array<{
        label: string;
        variableName: string;
        type?: 'TEXT' | 'EMAIL' | 'PHONE' | 'NUMBER' | 'CPF';
        saveToVariable?: string;
    }>;
    confirmButtonText?: string;
    editButtonText?: string;

    switchVariable?: string;
    switchBranches?: Array<{
        id: string;
        value: string;
    }>;

    endResetType?: 'IMMEDIATE' | 'TIMEOUT';
    endTimeoutValue?: number;
    targetStepId?: string;
};

type FlowState = {
    flowId: string | null;
    flowName: string;
    flowDescription: string;

    nodes: Node<TrackerNodeData>[];
    edges: Edge[];
    selectedNode: Node<TrackerNodeData> | null;
    isDirty: boolean;
    onNodesChange: OnNodesChange<Node<TrackerNodeData>>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setSelectedNode: (nodeId: string | null) => void;
    updateNodeData: (nodeId: string, data: Partial<TrackerNodeData>) => void;
    deleteNode: (nodeId: string) => void;
    addNode: (node: Node<TrackerNodeData>) => void;
    duplicateNodes: (nodeIds: string[]) => void;
    copyNodes: (nodeIds: string[]) => void;
    pasteNodes: (position: { x: number; y: number }) => void;
    clipboard: { nodes: Node<TrackerNodeData>[]; edges: Edge[] } | null;

    setFlowMetadata: (id: string, name: string, description: string) => void;
    setFlowName: (name: string) => void;
    setFlow: (nodes: Node<TrackerNodeData>[], edges: Edge[]) => void;
    setSaved: () => void;
    getVariables: () => string[];
    isVariablesDrawerOpen: boolean;
    setVariablesDrawerOpen: (open: boolean) => void;
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
    isVariablesDrawerOpen: false,
    clipboard: null,

    copyNodes: (nodeIds: string[]) => {
        const nodes = get().nodes.filter(n => nodeIds.includes(n.id) && n.id !== 'start-1');
        const edges = get().edges.filter(e => nodeIds.includes(e.source) && nodeIds.includes(e.target));
        
        if (nodes.length > 0) {
            set({ clipboard: { nodes, edges } });
        }
    },

    pasteNodes: (position: { x: number; y: number }) => {
        const { clipboard, nodes: existingNodes, edges: existingEdges } = get();
        if (!clipboard || clipboard.nodes.length === 0) return;

        // 1. Calcular o bounding box dos nodes no clipboard para o offset
        const minX = Math.min(...clipboard.nodes.map(n => n.position.x));
        const minY = Math.min(...clipboard.nodes.map(n => n.position.y));

        // 2. Mapear IDs antigos para novos IDs
        const idMap: Record<string, string> = {};
        const newNodes = clipboard.nodes.map(node => {
            const newId = `${node.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            idMap[node.id] = newId;

            return {
                ...node,
                id: newId,
                position: {
                    x: position.x + (node.position.x - minX),
                    y: position.y + (node.position.y - minY),
                },
                selected: true,
            };
        });

        // 3. Mapear arestas com os novos IDs
        const newEdges = clipboard.edges.map(edge => ({
            ...edge,
            id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            source: idMap[edge.source],
            target: idMap[edge.target],
        }));

        set({
            nodes: [
                ...existingNodes.map(n => ({ ...n, selected: false })),
                ...newNodes
            ],
            edges: [...existingEdges, ...newEdges],
            selectedNode: newNodes.length === 1 ? newNodes[0] : null,
            isDirty: true,
        });
    },
    setVariablesDrawerOpen: (open: boolean) => {
        set({ isVariablesDrawerOpen: open });
        if (open) set({ selectedNode: null }); // Fecha o editor de blocos ao abrir variáveis
    },

    onNodesChange: (changes: NodeChange<Node<TrackerNodeData>>[]) => {
        const safeChanges = changes.filter(c => !(c.type === 'remove' && c.id === 'start-1'));
        set({
            nodes: applyNodeChanges(safeChanges, get().nodes),
            isDirty: changes.length > 0,
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
            isDirty: true,
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
            isDirty: true,
        });
    },
    setSelectedNode: (nodeId: string | null) => {
        if (!nodeId) {
            set({ selectedNode: null });
            return;
        }
        const node = get().nodes.find((n) => n.id === nodeId);
        set({ selectedNode: node || null });
    },
    updateNodeData: (nodeId: string, data: Partial<TrackerNodeData>) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    const sanitizedData = { ...data };
                    if (sanitizedData.delayMs !== undefined) {
                        sanitizedData.delayMs = Math.max(0, sanitizedData.delayMs);
                    }
                    const updatedNode = { ...node, data: { ...node.data, ...sanitizedData } };
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
    deleteNode: (nodeId: string) => {
        if (nodeId === "start-1") return;
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
            selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
            isDirty: true,
        });
    },
    addNode: (node: Node<TrackerNodeData>) => {
        const exists = get().nodes.some(n => n.id === node.id);
        const safeNode = exists ? { ...node, id: `${node.id}-${Date.now()}` } : node;

        set({
            nodes: [...get().nodes, safeNode],
            isDirty: true,
        });
    },
    duplicateNodes: (nodeIds: string[]) => {
        const { nodes: existingNodes, edges: existingEdges } = get();
        const nodesToDuplicate = existingNodes.filter(n => nodeIds.includes(n.id) && n.id !== 'start-1');
        const edgesToDuplicate = existingEdges.filter(e => nodeIds.includes(e.source) && nodeIds.includes(e.target));
        
        if (nodesToDuplicate.length === 0) return;

        const idMap: Record<string, string> = {};
        const newNodes = nodesToDuplicate.map(node => {
            const newId = `${node.type}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            idMap[node.id] = newId;

            return {
                ...node,
                id: newId,
                position: {
                    x: node.position.x + 40,
                    y: node.position.y + 40,
                },
                selected: true,
            };
        });

        const newEdges = edgesToDuplicate.map(edge => ({
            ...edge,
            id: `edge_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            source: idMap[edge.source],
            target: idMap[edge.target],
        }));

        set({
            nodes: [
                ...existingNodes.map(n => ({ ...n, selected: false })),
                ...newNodes
            ],
            edges: [...existingEdges, ...newEdges],
            selectedNode: newNodes.length === 1 ? newNodes[0] : null,
            isDirty: true,
        });
    },
    setFlow: (nodes, edges) => {
        let hydratedNodes = nodes;
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
    setFlowMetadata: (id, name, description) => {
        set({ flowId: id, flowName: name, flowDescription: description });
    },

    setFlowName: (name: string) => {
        set({ flowName: name, isDirty: true });
    },

    setSaved: () => {
        set({ isDirty: false });
    },

    getVariables: () => {
        const nodes = get().nodes;
        const variables = new Set<string>();

        const extractFromText = (text: string) => {
            if (!text || typeof text !== "string") return;
            const matches = text.matchAll(/\{\{([^}]+)\}\}/g);
            for (const match of matches) {
                variables.add(match[1].trim());
            }
        };

        const scanDeep = (obj: any) => {
            if (!obj) return;
            if (typeof obj === "string") {
                extractFromText(obj);
            } else if (Array.isArray(obj)) {
                obj.forEach(scanDeep);
            } else if (typeof obj === "object") {
                Object.values(obj).forEach(scanDeep);
            }
        };

        nodes.forEach((node) => {
            const data = node.data;

            // 1. Variáveis de Atribuição Explícita (Escrita)
            if (data.variableName) variables.add(data.variableName);
            if (data.identificationFields) {
                data.identificationFields.forEach(f => {
                    if (f.saveToVariable) variables.add(f.saveToVariable);
                });
            }
            if (data.fields) {
                data.fields.forEach(f => {
                    if (f.variableName) variables.add(f.variableName);
                });
            }
            if (data.saveStatusToVariable) variables.add(data.saveStatusToVariable);
            if (data.saveResponseToVariable) variables.add(data.saveResponseToVariable);
            if (data.responseMapping) {
                data.responseMapping.forEach(m => {
                    if (m.variableName) variables.add(m.variableName);
                });
            }

            // 2. Variáveis de Controle (Leitura/Uso)
            if (data.conditionVariable) variables.add(data.conditionVariable);
            if (data.switchVariable) variables.add(data.switchVariable);
            if (data.dynamicOptionsVariable) variables.add(data.dynamicOptionsVariable);

            // 3. Varredura Exaustiva de Menções {{var}} em qualquer campo
            scanDeep(data);
        });

        return Array.from(variables).filter(v => v.length > 0).sort();
    },
}));
