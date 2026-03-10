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
    content?: string;
    options?: string[];
    delayMs?: number;

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

    switchVariable?: string;
    switchBranches?: Array<{
        id: string;
        value: string;
    }>;

    endResetType?: 'IMMEDIATE' | 'TIMEOUT';
    endTimeoutValue?: number;
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

    setFlowMetadata: (id: string, name: string, description: string) => void;
    setFlowName: (name: string) => void;
    setFlow: (nodes: Node<TrackerNodeData>[], edges: Edge[]) => void;
    setSaved: () => void;
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
    }
}));
