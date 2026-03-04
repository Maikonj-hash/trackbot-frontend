import { Node, Edge } from "@xyflow/react";
import { TrackerNodeData } from "@/store/flow-store";

export function parseReactFlowToBackend(nodes: Node<TrackerNodeData>[], edges: Edge[], flowName: string = "Meu Novo Fluxo") {
    const steps: Record<string, any> = {};

    // Mágica 4: Encontrar a Bússola Oculta (Onde o fluxo começa de verdade?)
    const startNode = nodes.find(n => n.id === "start-1" || n.type === "startBlock");
    let firstStepId = null;
    if (startNode) {
        const startEdge = edges.find(e => e.source === startNode.id);
        if (startEdge) {
            firstStepId = startEdge.target;
        }
    }

    for (const node of nodes) {
        const id = node.id;

        // Helper to find next step ID from an edge origin handle
        const getNextStepId = (sourceHandle?: string) => {
            const edge = edges.find(e => {
                if (e.source !== id) return false;
                if (sourceHandle) {
                    return e.sourceHandle === sourceHandle;
                }
                // Se a busca é genérica (null), pega a corda que não tem origin handle espécifico ou chama-se 'next'
                return !e.sourceHandle || e.sourceHandle === 'next';
            });
            return edge?.target || null;
        };

        const defaultNextStep = getNextStepId();

        switch (node.type) {
            case "messageBlock":
                steps[id] = {
                    id,
                    type: "TEXT",
                    content: node.data.content || "Mensagem vazia",
                    nextStepId: defaultNextStep
                };
                break;
            case "inputBlock":
                steps[id] = {
                    id,
                    type: "INPUT",
                    content: node.data.content || "Aguardando input...",
                    saveToVariable: node.data.variableName || "var_padrao",
                    nextStepId: defaultNextStep
                };
                break;
            case "optionsBlock":
                const optionsMap: Record<string, string> = {};
                const options = node.data.options || ["Sim", "Não"];
                options.forEach((opt, idx) => {
                    const target = edges.find(e => e.source === id && e.sourceHandle === `option_${idx}`)?.target;
                    if (target) {
                        optionsMap[opt] = target; // e.g. "Sim" -> "node_abc123"
                    }
                });

                steps[id] = {
                    id,
                    type: "OPTIONS",
                    content: node.data.content || "Escolha uma opção:",
                    options: optionsMap,
                    fallbackStepId: getNextStepId("fallback"),
                    nextStepId: null // Options node uses specific routing, generic next is null in our backend logic usually or doesn't matter
                };
                break;
            case "conditionBlock":
                steps[id] = {
                    id,
                    type: "CONDITION",
                    variable: node.data.conditionVariable || "user.name",
                    operator: node.data.conditionOperator || "EQUALS",
                    value: node.data.conditionValue || "",
                    trueStepId: getNextStepId("true"),
                    falseStepId: getNextStepId("false"),
                    nextStepId: null // Routable
                };
                break;
            case "delayBlock":
                steps[id] = {
                    id,
                    type: "DELAY",
                    durationMs: node.data.delayMs || 3000,
                    nextStepId: defaultNextStep
                };
                break;
            case "mediaBlock":
                steps[id] = {
                    id,
                    type: "MEDIA",
                    mediaType: node.data.mediaType || "image",
                    url: node.data.content || "https://example.com/media.png",
                    nextStepId: defaultNextStep
                };
                break;
            case "webhookBlock":
                steps[id] = {
                    id,
                    type: "HTTP_REQUEST",
                    method: node.data.webhookMethod || "POST",
                    url: node.data.content || "https://api.exemplo.com",
                    nextStepId: defaultNextStep
                };
                break;
            case "variableBlock":
                steps[id] = {
                    id,
                    type: "SET_VARIABLE",
                    variable: node.data.variableName || "score",
                    action: node.data.variableAction || "SET",
                    value: node.data.variableValue || "1",
                    nextStepId: defaultNextStep
                };
                break;
            case "handoverBlock":
                steps[id] = {
                    id,
                    type: "HANDOVER",
                    department: node.data.content || undefined,
                    nextStepId: null // Encerra automação
                };
                break;
            case "endBlock":
                steps[id] = {
                    id,
                    type: "END",
                    nextStepId: null
                };
                break;
            case "startBlock":
                // Ignorado no banco porque é apenas Metadado Visual
                break;
        }
    }

    return {
        id: "flow_" + Date.now().toString(),
        name: flowName,
        firstStepId, // Bússola oficial Exportada
        steps
    };
}
