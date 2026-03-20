import { Node, Edge } from "@xyflow/react";
import { TrackerNodeData } from "@/store/flow-store";
interface ParserContext {
    id: string;
    edges: Edge[];
    defaultNextStep: string | null;
    getNextStepId: (sourceHandle?: string) => string | null;
}

const BLOCK_PARSERS: Record<string, (node: Node<TrackerNodeData>, ctx: ParserContext) => any> = {
    messageBlock: (node, ctx) => ({
        id: ctx.id,
        type: "TEXT",
        content: node.data.content || "Mensagem vazia",
        allowBack: node.data.allowBack,
        nextStepId: ctx.defaultNextStep
    }),

    inputBlock: (node, ctx) => ({
        id: ctx.id,
        type: "INPUT",
        content: node.data.content || "Aguardando input...",
        saveToVariable: node.data.variableName || "var_padrao",
        expectedType: node.data.expectedType,
        errorMessage: node.data.errorMessage,
        maxRetries: node.data.maxRetries,
        allowBack: node.data.allowBack,
        nextStepId: ctx.defaultNextStep
    }),

    optionsBlock: (node, ctx) => {
        const optionsMap: Record<string, string> = {};
        const options = node.data.options || ["Sim", "Não"];
        options.forEach((opt: any, idx: number) => {
            const target = ctx.edges.find(e => e.source === ctx.id && e.sourceHandle === `option_${idx}`)?.target;
            if (target) optionsMap[opt] = target;
        });

        return {
            id: ctx.id,
            type: "OPTIONS",
            content: node.data.content || "Escolha uma opção:",
            options: optionsMap,
            useNativeButtons: node.data.useNativeButtons,
            listButtonLabel: node.data.listButtonLabel,
            listTitle: node.data.listTitle,
            listFooter: node.data.listFooter,
            dynamicOptionsVariable: node.data.dynamicOptionsVariable,
            allowBack: node.data.allowBack,
            fallbackStepId: ctx.getNextStepId("fallback"),
            nextStepId: null
        };
    },

    conditionBlock: (node, ctx) => ({
        id: ctx.id,
        type: "CONDITION",
        variable: node.data.conditionVariable || "user.name",
        operator: node.data.conditionOperator || "EQUALS",
        value: node.data.conditionValue || "",
        trueStepId: ctx.getNextStepId("true"),
        falseStepId: ctx.getNextStepId("false"),
        nextStepId: null
    }),

    delayBlock: (node, ctx) => ({
        id: ctx.id,
        type: "DELAY",
        durationMs: node.data.delayMs || 3000,
        nextStepId: ctx.defaultNextStep
    }),

    mediaBlock: (node, ctx) => ({
        id: ctx.id,
        type: "MEDIA",
        mediaType: node.data.mediaType || "image",
        url: node.data.content || "https://example.com/media.png",
        allowBack: node.data.allowBack,
        nextStepId: ctx.defaultNextStep
    }),

    webhookBlock: (node, ctx) => ({
        id: ctx.id,
        type: "HTTP_REQUEST",
        method: node.data.webhookMethod || "POST",
        url: node.data.content || "https://api.exemplo.com",
        timeout: node.data.timeout || 10000,
        headers: node.data.headers,
        bodyPayload: node.data.bodyPayload,
        saveStatusToVariable: node.data.saveStatusToVariable,
        saveResponseToVariable: node.data.saveResponseToVariable,
        responseMapping: node.data.responseMapping,
        successStepId: ctx.getNextStepId("success"),
        failureStepId: ctx.getNextStepId("failure"),
        nextStepId: ctx.defaultNextStep
    }),

    variableBlock: (node, ctx) => ({
        id: ctx.id,
        type: "SET_VARIABLE",
        variable: node.data.variableName || "score",
        action: node.data.variableAction || "SET",
        value: node.data.variableValue || "1",
        nextStepId: ctx.defaultNextStep
    }),

    identificationBlock: (node, ctx) => ({
        id: ctx.id,
        type: "CUSTOMER_IDENTIFICATION",
        content: node.data.content || "Preencha seus dados:",
        fields: node.data.identificationFields || [],
        submitButtonText: node.data.submitButtonText,
        skipIfAlreadyFilled: node.data.skipIfAlreadyFilled,
        allowBack: node.data.allowBack,
        nextStepId: ctx.defaultNextStep
    }),

    handoverBlock: (node, ctx) => ({
        id: ctx.id,
        type: "HANDOVER",
        department: node.data.content || undefined,
        nextStepId: null
    }),

    switchBlock: (node, ctx) => {
        const mappedBranches: Array<{ value: string; targetStepId: string }> = [];
        const switchBranches = node.data.switchBranches || [];

        switchBranches.forEach((branch: any) => {
            const target = ctx.edges.find(e => e.source === ctx.id && e.sourceHandle === branch.id)?.target;
            if (target) {
                mappedBranches.push({ value: branch.value, targetStepId: target });
            }
        });

        return {
            id: ctx.id,
            type: "SWITCH",
            variable: node.data.switchVariable || "",
            branches: mappedBranches,
            defaultStepId: ctx.getNextStepId("default"),
            nextStepId: null
        };
    },

    endBlock: (node, ctx) => ({
        id: ctx.id,
        type: "END",
        resetType: node.data.endResetType || "IMMEDIATE",
        timeoutValue: node.data.endTimeoutValue || 60,
        nextStepId: null
    }),

    jumpBlock: (node, ctx) => ({
        id: ctx.id,
        type: "JUMP",
        targetStepId: node.data.targetStepId,
        nextStepId: null
    }),

    reviewBlock: (node, ctx) => ({
        id: ctx.id,
        type: "REVIEW",
        content: node.data.content || "Confirme seus dados:",
        fields: node.data.fields || [],
        confirmButtonText: node.data.confirmButtonText,
        editButtonText: node.data.editButtonText,
        skipIfAlreadyFilled: node.data.skipIfAlreadyFilled,
        allowBack: node.data.allowBack,
        nextStepId: ctx.getNextStepId("confirm"),
        correctionStepId: ctx.getNextStepId("edit")
    }),

    trackDeskBlock: (node, ctx) => ({
        id: ctx.id,
        type: "TRACK_DESK",
        method: node.data.webhookMethod || "POST",
        url: node.data.content || "{{sys.desk_url}}",
        timeout: node.data.timeout || 10000,
        headers: node.data.headers,
        bodyPayload: node.data.bodyPayload,
        errorFallbackMessage: node.data.errorFallbackMessage,
        successStepId: ctx.getNextStepId("success") || ctx.defaultNextStep,
        failureStepId: node.data.failureStepId || ctx.getNextStepId("failure"),
        nextStepId: ctx.defaultNextStep
    }),
};

export function parseReactFlowToBackend(nodes: Node<TrackerNodeData>[], edges: Edge[], flowName: string = "Meu Novo Fluxo") {
    const steps: Record<string, any> = {};

    const startNode = nodes.find(n => n.id === "start-1" || n.type === "startBlock");
    let firstStepId: string | null = null;
    if (startNode) {
        const startEdge = edges.find(e => e.source === startNode.id);
        if (startEdge) firstStepId = startEdge.target;
    }

    for (const node of nodes) {
        if (!node.type || node.type === "startBlock") continue;

        const getNextStepId = (sourceHandle?: string) => {
            const edgesFromNode = edges.filter((e: any) => e.source === node.id);

            if (sourceHandle) {
                const specificEdge = edgesFromNode.find(e => e.sourceHandle === sourceHandle);
                if (specificEdge) return specificEdge.target;
            }

            if (edgesFromNode.length === 1) return edgesFromNode[0].target;

            const nextEdge = edgesFromNode.find(e => !e.sourceHandle || e.sourceHandle === 'next' || e.sourceHandle === 'default');
            return nextEdge?.target || null;
        };

        const context: ParserContext = {
            id: node.id,
            edges,
            defaultNextStep: getNextStepId(),
            getNextStepId
        };

        const parser = BLOCK_PARSERS[node.type];
        if (parser) {
            const step = parser(node, context);
            steps[node.id] = {
                ...step,
                label: node.data.label || node.type
            };
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
    } else if (!edges.some(e => e.source === startNode.id)) {
        errors.push("O bloco de Início não está conectado a nenhum outro bloco.");
    }

    nodes.forEach(node => {
        if (node.id === "start-1" || node.type === "startBlock" || node.type === "segmentBlock") return;

        if (!edges.some(e => e.target === node.id)) {
            warnings.push(`O bloco "${node.data.label || node.id}" está isolado e nunca será alcançado.`);
        }

        if (node.type === "endBlock" || node.type === "handoverBlock" || node.type === "segmentBlock" || node.type === "jumpBlock") return;

        const hasOutput = edges.some(e => e.source === node.id);
        if (!hasOutput) {
            handleMissingOutput(node, edges, errors, warnings);
        }
    });

    validateNodeConfigurations(nodes, errors);

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

function handleMissingOutput(node: Node, edges: Edge[], errors: string[], warnings: string[]) {
    switch (node.type) {
        case "conditionBlock":
            const hasTrue = edges.some(e => e.source === node.id && e.sourceHandle === 'true');
            const hasFalse = edges.some(e => e.source === node.id && e.sourceHandle === 'false');
            if (!hasTrue || !hasFalse) errors.push(`O bloco de Condição "${node.data.label}" precisa de saídas TRUE e FALSE.`);
            break;
        case "optionsBlock":
            const options = (node.data as any).options || [];
            if (!options.every((_: any, i: number) => edges.some(e => e.source === node.id && e.sourceHandle === `option_${i}`))) {
                errors.push(`O bloco de Opções "${node.data.label}" tem alternativas sem conexão.`);
            }
            break;
        case "webhookBlock":
            if (!edges.some(e => e.source === node.id && e.sourceHandle === 'success') || !edges.some(e => e.source === node.id && e.sourceHandle === 'failure')) {
                errors.push(`O bloco de Webhook "${node.data.label}" precisa de saídas SUCCESS e FAILURE.`);
            }
            break;
        case "reviewBlock":
            if (!edges.some(e => e.source === node.id && e.sourceHandle === 'confirm') || !edges.some(e => e.source === node.id && e.sourceHandle === 'edit')) {
                errors.push(`O bloco de Revisão "${node.data.label}" precisa das saídas CONFIRMAR e CORRIGIR.`);
            }
            break;
        case "switchBlock":
            const branches = (node.data as any).switchBranches || [];
            const allConnected = branches.every((b: any) => edges.some(e => e.source === node.id && e.sourceHandle === b.id));
            if (!allConnected || !edges.some(e => e.source === node.id && e.sourceHandle === 'default')) {
                errors.push(`O bloco Roteador "${(node.data as any).switchVariable || 'Sem Nome'}" precisa de todas as Rotas e Saída Padrão.`);
            }
            break;
        default:
            warnings.push(`O bloco "${node.data.label || node.id}" não tem saída conectada.`);
    }
}

function validateNodeConfigurations(nodes: Node[], errors: string[]) {
    const varRegex = /^[a-zA-Z0-9_.]+$/;
    nodes.forEach(node => {
        const vn = (node.data as any).variableName;
        if (vn && !varRegex.test(vn)) {
            errors.push(`A variável "${vn}" no bloco "${node.data.label}" tem caracteres inválidos.`);
        }
        if (node.type === "webhookBlock") {
            const url = String(node.data.content || "");
            if (!url.startsWith("http")) errors.push(`O Webhook "${node.data.label}" precisa de uma URL válida.`);
        }
        if (node.type === "jumpBlock" && !node.data.targetStepId) {
            errors.push(`O bloco de Salto "${node.data.label}" precisa de um destino.`);
        }
    });
}
