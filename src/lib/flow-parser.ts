import { Node, Edge } from "@xyflow/react";
import { TrackerNodeData } from "@/store/flow-store";

export function parseReactFlowToBackend(nodes: Node<TrackerNodeData>[], edges: Edge[], flowName: string = "Meu Novo Fluxo") {
    const steps: Record<string, any> = {};

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

        const getNextStepId = (sourceHandle?: string) => {
            const edge = edges.find(e => {
                if (e.source !== id) return false;
                if (sourceHandle) {
                    return e.sourceHandle === sourceHandle;
                }
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
                        optionsMap[opt] = target;
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
                    nextStepId: null
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
            case "identificationBlock":
                steps[id] = {
                    id,
                    type: "CUSTOMER_IDENTIFICATION",
                    content: node.data.content || "Preencha seus dados:",
                    fields: node.data.identificationFields || [],
                    submitButtonText: node.data.submitButtonText,
                    skipIfAlreadyFilled: node.data.skipIfAlreadyFilled,
                    nextStepId: defaultNextStep
                };
                break;
            case "handoverBlock":
                steps[id] = {
                    id,
                    type: "HANDOVER",
                    department: node.data.content || undefined,
                    nextStepId: null
                };
                break;
            case "switchBlock":
                const mappedBranches: Array<{ value: string; targetStepId: string }> = [];
                const switchBranches = node.data.switchBranches || [];

                switchBranches.forEach((branch) => {
                    const target = edges.find(e => e.source === id && e.sourceHandle === branch.id)?.target;
                    if (target) {
                        mappedBranches.push({
                            value: branch.value,
                            targetStepId: target
                        });
                    }
                });

                steps[id] = {
                    id,
                    type: "SWITCH",
                    variable: node.data.switchVariable || "",
                    branches: mappedBranches,
                    defaultStepId: getNextStepId("default"),
                    nextStepId: null
                };
                break;
            case "endBlock":
                steps[id] = {
                    id,
                    type: "END",
                    resetType: node.data.endResetType || "IMMEDIATE",
                    timeoutValue: node.data.endTimeoutValue || 60,
                    nextStepId: null
                };
                break;
            case "reviewBlock":
                steps[id] = {
                    id,
                    type: "REVIEW",
                    content: node.data.content || "Confirme seus dados:",
                    fields: node.data.fields || [],
                    confirmButtonText: node.data.confirmButtonText,
                    editButtonText: node.data.editButtonText,
                    nextStepId: getNextStepId("confirm"),
                    correctionStepId: getNextStepId("edit")
                };
                break;
            case "startBlock":
                break;
        }
    }

    return {
        id: "flow_" + Date.now().toString(),
        name: flowName,
        firstStepId,
        steps
    };
}

export function validateFlow(nodes: Node[], edges: Edge[]) {
    const errors: string[] = [];
    const warnings: string[] = [];

    const startNode = nodes.find(n => n.id === "start-1" || n.type === "startBlock");
    if (!startNode) {
        errors.push("Bloco de Início não encontrado.");
    } else {
        const hasConnection = edges.some(e => e.source === startNode.id);
        if (!hasConnection) {
            errors.push("O bloco de Início não está conectado a nenhum outro bloco.");
        }
    }

    nodes.forEach(node => {
        if (node.id === "start-1" || node.type === "startBlock") return;

        const hasInput = edges.some(e => e.target === node.id);
        if (!hasInput) {
            warnings.push(`O bloco "${node.data.label || node.id}" está isolado e nunca será alcançado.`);
        }
    });

    nodes.forEach(node => {
        if (node.type === "endBlock" || node.type === "handoverBlock") return;

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
            } else if (node.type === "switchBlock") {
                const sBranches = (node.data as any).switchBranches || [];
                const allCasesConnected = Array.isArray(sBranches) && sBranches.every((branch: any) =>
                    edges.some(e => e.source === node.id && e.sourceHandle === branch.id)
                );

                const isDefaultConnected = edges.some(e => e.source === node.id && e.sourceHandle === 'default');
                if (!allCasesConnected || !isDefaultConnected) {
                    errors.push(`O bloco Roteador "${(node.data as any).switchVariable || 'Sem Nome'}" precisa de todas as Rotas e a Saída Padrão conectadas.`);
                }
            } else if (node.type === "reviewBlock") {
                const hasConfirm = edges.some(e => e.source === node.id && e.sourceHandle === 'confirm');
                const hasEdit = edges.some(e => e.source === node.id && e.sourceHandle === 'edit');
                if (!hasConfirm || !hasEdit) {
                    errors.push(`O bloco de Revisão "${node.data.label}" precisa ter as saídas CONFIRMAR e CORRIGIR conectadas.`);
                }
            } else {
                warnings.push(`O bloco "${node.data.label || node.id}" não tem saída conectada.`);
            }
        }
    });

    const varRegex = /^[a-zA-Z0-9_.]+$/;
    nodes.forEach(node => {
        let varName: string = "";
        if (node.type === "inputBlock") varName = String((node.data as any).variableName || "");
        if (node.type === "variableBlock") varName = String((node.data as any).variableName || "");

        if (varName && !varRegex.test(varName)) {
            errors.push(`A variável "${varName}" no bloco "${node.data.label}" contém caracteres inválidos. Use apenas letras, números e underline.`);
        }
    });

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
