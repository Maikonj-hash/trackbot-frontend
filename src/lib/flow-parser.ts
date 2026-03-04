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
                    useNativeButtons: node.data.useNativeButtons,
                    listButtonLabel: node.data.listButtonLabel,
                    listTitle: node.data.listTitle,
                    listFooter: node.data.listFooter,
                    dynamicOptionsVariable: node.data.dynamicOptionsVariable,
                    fallbackStepId: getNextStepId("fallback"),
                    nextStepId: null
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
                    timeout: node.data.timeout || 10000,
                    headers: node.data.headers,
                    bodyPayload: node.data.bodyPayload,
                    saveStatusToVariable: node.data.saveStatusToVariable,
                    saveResponseToVariable: node.data.saveResponseToVariable,
                    responseMapping: node.data.responseMapping,
                    successStepId: getNextStepId("success"),
                    failureStepId: getNextStepId("failure"),
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

export function validateFlow(nodes: Node[], edges: Edge[]) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Verificar Bloco Início
    const startNode = nodes.find(n => n.id === "start-1" || n.type === "startBlock");
    if (!startNode) {
        errors.push("Bloco de Início não encontrado.");
    } else {
        const hasConnection = edges.some(e => e.source === startNode.id);
        if (!hasConnection) {
            errors.push("O bloco de Início não está conectado a nenhum outro bloco.");
        }
    }

    // 2. Verificar Blocos Órfãos (sem entrada, exceto Start)
    nodes.forEach(node => {
        if (node.id === "start-1" || node.type === "startBlock") return;

        const hasInput = edges.some(e => e.target === node.id);
        if (!hasInput) {
            warnings.push(`O bloco "${node.data.label || node.id}" está isolado e nunca será alcançado.`);
        }
    });

    // 3. Verificar Saídas não conectadas (exceto End)
    nodes.forEach(node => {
        if (node.type === "endBlock" || node.type === "handoverBlock") return;

        // Simplificação: apenas checa se tem pelo menos uma saída
        const hasOutput = edges.some(e => e.source === node.id);
        if (!hasOutput) {
            if (node.type === "conditionBlock") {
                const hasTrue = edges.some(e => e.source === node.id && e.sourceHandle === 'true');
                const hasFalse = edges.some(e => e.source === node.id && e.sourceHandle === 'false');
                if (!hasTrue || !hasFalse) {
                    errors.push(`O bloco de Condição "${node.data.label}" precisa ter as saídas TRUE e FALSE conectadas.`);
                }
            } else if (node.type === "optionsBlock") {
                const options = (node.data as any).options || [];
                const allConnected = Array.isArray(options) && options.every((_: any, idx: number) =>
                    edges.some(e => e.source === node.id && e.sourceHandle === `option_${idx}`)
                );
                if (!allConnected) {
                    errors.push(`O bloco de Opções "${node.data.label}" tem alternativas sem conexão.`);
                }
            } else if (node.type === "webhookBlock") {
                const hasSuccess = edges.some(e => e.source === node.id && e.sourceHandle === 'success');
                const hasFailure = edges.some(e => e.source === node.id && e.sourceHandle === 'failure');
                if (!hasSuccess || !hasFailure) {
                    errors.push(`O bloco de Webhook "${node.data.label}" precisa ter as saídas SUCCESS e FAILURE conectadas.`);
                }
            } else {
                warnings.push(`O bloco "${node.data.label || node.id}" não tem saída conectada.`);
            }
        }
    });

    // 4. Validação de Nomes de Variáveis (Sanitização)
    const varRegex = /^[a-zA-Z0-9_.]+$/;
    nodes.forEach(node => {
        let varName: string = "";
        if (node.type === "inputBlock") varName = String((node.data as any).variableName || "");
        if (node.type === "variableBlock") varName = String((node.data as any).variableName || "");

        if (varName && !varRegex.test(varName)) {
            errors.push(`A variável "${varName}" no bloco "${node.data.label}" contém caracteres inválidos. Use apenas letras, números e underline.`);
        }
    });

    // 5. Validação de URLs de Webhook
    nodes.forEach(node => {
        if (node.type === "webhookBlock") {
            const url = String(node.data.content || "");
            if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
                errors.push(`O bloco de Webhook "${node.data.label}" precisa de uma URL válida (http/https).`);
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
