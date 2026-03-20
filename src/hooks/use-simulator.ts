import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";
import { TrackerNodeData } from "@/store/flow-store";

export type SimMessage = {
    id: string;
    text?: string;
    isBot: boolean;
    type: "text" | "image" | "video" | "audio" | "document" | "options" | "component";
    options?: string[];
    mediaUrl?: string;
    isInteractive?: boolean;
};

type SimulatorState = {
    isOpen: boolean;
    isRunning: boolean;
    messages: SimMessage[];
    variables: Record<string, string | number | boolean>;
    logs: Array<{ time: string; text: string; type: "info" | "error" | "warn" | "success" }>;

    currentNodeId: string | null;
    waitingForInput: boolean;
    toggleSimulator: () => void;
    startSimulation: (nodes: Node<TrackerNodeData>[], edges: Edge[]) => void;
    stopSimulation: () => void;

    processNextNode: (nodes: Node<TrackerNodeData>[], edges: Edge[]) => Promise<void>;
    handleUserInput: (text: string, nodes: Node<TrackerNodeData>[], edges: Edge[]) => void;

    setVariable: (key: string, value: string | number | boolean) => void;
    addLog: (text: string, type?: "info" | "error" | "warn" | "success") => void;
};

const resolveVar = (text: string, vars: Record<string, any>) => {
    if (!text) return text;
    return text.replace(/\{\{(.+?)\}\}/g, (match, path) => {
        const key = path.trim();
        if (vars[key] !== undefined) return String(vars[key]);
        return match;
    });
};

const validateSimulatorInput = (text: string, expectedType?: string): { isValid: boolean, error?: string } => {
    if (!text || !expectedType || expectedType === 'TEXT') return { isValid: true };
    const val = text.trim();
    switch (expectedType) {
        case 'EMAIL':
            return { isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), error: "Formato de e-mail inválido." };
        case 'PHONE':
            return { isValid: val.replace(/\D/g, '').length >= 10, error: "Formato de telefone inválido." };
        case 'CPF_CNPJ':
            const doc = val.replace(/\D/g, '');
            return { isValid: doc.length === 11 || doc.length === 14, error: "Documento inválido." };
        case 'NUMBER':
            return { isValid: !isNaN(Number(val)) && val !== '', error: "Por favor, informe apenas números." };
        case 'CEP':
            return { isValid: val.replace(/\D/g, '').length === 8, error: "CEP inválido. Deve conter 8 dígitos." };
        case 'LICENSE_PLATE':
            const plate = val.replace(/[^A-Za-z0-9]/g, '');
            return { isValid: /^[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}$/.test(plate), error: "Placa inválida." };
        case 'DATE':
            const matchVal = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
            if (!matchVal) return { isValid: false, error: "Formato de data inválido (DD/MM/AAAA)." };
            const d = parseInt(matchVal[1], 10);
            const m = parseInt(matchVal[2], 10);
            const y = parseInt(matchVal[3], 10);
            const dateObj = new Date(y, m - 1, d);
            if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
                return { isValid: false, error: "A data informada não existe no calendário." };
            }
            if (y < 1900 || y > 2100) return { isValid: false, error: "Ano fora do limite aceitável." };
            return { isValid: true };
        case 'TIME':
            return { isValid: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), error: "Horário inválido (HH:MM)." };
        default:
            return { isValid: true };
    }
};

export const useSimulator = create<SimulatorState>((set, get) => ({
    isOpen: false,
    isRunning: false,
    messages: [],
    variables: {
        "user.name": "Visitante Teste",
        "user.phone": "5511999999999",
        "sys.date": new Date().toLocaleDateString("pt-BR"),
    },
    logs: [],
    currentNodeId: null,
    waitingForInput: false,

    toggleSimulator: () => set((state) => ({ isOpen: !state.isOpen })),

    setVariable: (key, value) => set((state) => ({
        variables: { ...state.variables, [key]: value }
    })),

    addLog: (text, type = "info") => set((state) => ({
        logs: [...state.logs, { time: new Date().toLocaleTimeString('pt-BR'), text, type }]
    })),

    stopSimulation: () => set({ isRunning: false, messages: [], currentNodeId: null, waitingForInput: false, logs: [] }),

    startSimulation: async (nodes, edges) => {
        const startNode = nodes.find(n => n.id === "start-1" || n.type === "startBlock");
        if (!startNode) {
            get().addLog("Erro: Bloco Início não encontrado.", "error");
            return;
        }

        const firstEdge = edges.find(e => e.source === startNode.id);
        if (!firstEdge) {
            get().addLog("Aviso: Nada conectado ao Bloco Início.", "warn");
            return;
        }

        set({
            isOpen: true,
            isRunning: true,
            messages: [{ id: "sys-1", isBot: true, type: "text", text: "⚡ Simulador Iniciado." }],
            logs: [],
            currentNodeId: firstEdge.target,
            waitingForInput: false,
        });

        get().addLog(`Iniciando simulação a partir do bloco inicial.`);
        await get().processNextNode(nodes, edges);
    },

    handleUserInput: async (text, nodes, edges) => {
        const { isRunning, currentNodeId, waitingForInput } = get();
        if (!isRunning || !waitingForInput || !currentNodeId) return;

        set((state) => ({
            messages: [...state.messages, { id: `m_${Date.now()}`, isBot: false, type: "text", text }],
            waitingForInput: false
        }));

        const node = nodes.find(n => n.id === currentNodeId);
        if (node?.type === "inputBlock") {
            const validation = validateSimulatorInput(text, node.data.expectedType);
            
            if (!validation.isValid) {
                const errorMsg = node.data.errorMessage || validation.error || "Entrada inválida.";
                set((state) => ({
                    messages: [...state.messages, { id: `err_${Date.now()}`, isBot: true, type: "text", text: `❌ ${errorMsg}` }],
                    waitingForInput: true
                }));
                get().addLog(`[SIMULADOR] Validação falhou: ${errorMsg}`, "warn");
                return; // Aborta prosseguimento no simulador
            }

            const varName = node.data.variableName || "var_padrao";
            get().setVariable(varName, text);
            get().addLog(`Valor salvo na variável '${varName}': ${text}`, "success");

            const nextEdge = edges.find(e => e.source === currentNodeId);
            set({ currentNodeId: nextEdge ? nextEdge.target : null });
            await get().processNextNode(nodes, edges);
        } else if (node?.type === "optionsBlock") {
            const options = node.data.options || [];

            let index = options.findIndex((opt: any) => opt.toLowerCase() === text.trim().toLowerCase());

            if (index === -1) {
                const numericIndex = parseInt(text.trim()) - 1;
                if (!isNaN(numericIndex) && numericIndex >= 0 && numericIndex < options.length) {
                    index = numericIndex;
                }
            }

            if (index !== -1) {
                const nextEdge = edges.find(e => e.source === currentNodeId && e.sourceHandle === `option_${index}`);
                set({ currentNodeId: nextEdge ? nextEdge.target : null });
            } else {
                const fallbackEdge = edges.find(e => e.source === currentNodeId && e.sourceHandle === "fallback");
                set({ currentNodeId: fallbackEdge ? fallbackEdge.target : null });
            }
            await get().processNextNode(nodes, edges);
        }
    },

    processNextNode: async (nodes, edges) => {
        let { isRunning, currentNodeId } = get();

        while (isRunning && currentNodeId) {
            const node = nodes.find(n => n.id === currentNodeId) as Node<TrackerNodeData> | undefined;

            if (!node) {
                get().addLog(`Erro: Bloco ${currentNodeId} deletado ou não existe.`, "error");
                break;
            }

            const getTarget = (handle?: string) => {
                const edge = edges.find(e => {
                    if (e.source !== node.id) return false;
                    if (handle) return e.sourceHandle === handle;
                    return !e.sourceHandle || e.sourceHandle === 'next';
                });
                return edge?.target || null;
            };

            const data = node.data;
            const vars = get().variables;

            switch (node.type) {
                case "messageBlock":
                    const msgParsed = resolveVar(data.content || "", vars);
                    set(s => ({ messages: [...s.messages, { id: Date.now().toString(), text: msgParsed, type: "text", isBot: true }] }));
                    get().addLog(`Disparou Mensagem: ${msgParsed.substring(0, 20)}...`);
                    currentNodeId = getTarget();
                    break;

                case "delayBlock":
                    const ms = data.delayMs || 3000;
                    get().addLog(`Aguardando ${ms}ms...`);
                    set(s => ({ messages: [...s.messages, { id: "typing", text: "digitando...", type: "text", isBot: true }] }));
                    await new Promise(r => setTimeout(r, ms));
                    set(s => ({ messages: s.messages.filter(m => m.id !== "typing") }));
                    currentNodeId = getTarget();
                    break;

                case "variableBlock":
                    const varName = resolveVar(data.variableName || "", vars);
                    const varValue = resolveVar(data.variableValue || "", vars);
                    const action = data.variableAction || "SET";

                    if (varName) {
                        if (action === "SET") {
                            get().setVariable(varName, varValue);
                            get().addLog(`Motor [SET] Definiu '${varName}' = ${varValue}`, "success");
                        } else {
                            const currentVal = Number(vars[varName]) || 0;
                            const change = Number(varValue) || 0;
                            const newVal = action === "INCREMENT" ? currentVal + change : currentVal - change;
                            get().setVariable(varName, newVal);
                            get().addLog(`Motor [${action}] Calculou '${varName}' = ${newVal}`, "success");
                        }
                    }
                    currentNodeId = getTarget();
                    break;

                case "conditionBlock":
                    const conditionVar = resolveVar(data.conditionVariable || "", vars);
                    const conditionVal = resolveVar(String(data.conditionValue || ""), vars);
                    const op = data.conditionOperator;

                    let result = false;
                    const evalVarStr = vars[conditionVar] !== undefined ? String(vars[conditionVar]) : "";

                    if (op === 'EQUALS') result = evalVarStr === conditionVal;
                    if (op === 'NOT_EQUALS') result = evalVarStr !== conditionVal;
                    if (op === 'CONTAINS') result = evalVarStr.includes(conditionVal);
                    if (op === 'IS_EMPTY') result = evalVarStr === "";
                    if (op === 'IS_NOT_EMPTY') result = evalVarStr !== "";

                    get().addLog(`Condição avaliada: '${conditionVar}' (${evalVarStr}) ${op} '${conditionVal}' -> ${result}`);
                    currentNodeId = getTarget(result ? "true" : "false");
                    break;

                case "switchBlock":
                    const switchVarKey = data.switchVariable || "";
                    const switchVarVal = vars[switchVarKey] !== undefined ? String(vars[switchVarKey]).trim().toLowerCase() : "";
                    const branches = Array.isArray(data.switchBranches) ? data.switchBranches : [];

                    let targetFound = null;
                    for (const branch of branches) {
                        if (branch.value?.trim().toLowerCase() === switchVarVal) {
                            targetFound = branch.id;
                            break;
                        }
                    }

                    if (targetFound) {
                        get().addLog(`Roteador: Match exato na rota (${targetFound})`);
                        currentNodeId = getTarget(targetFound);
                    } else {
                        get().addLog(`Roteador: Sem conexões. Repassando ao Fallback.`);
                        currentNodeId = getTarget("default");
                    }
                    break;

                case "inputBlock":
                    const iparse = resolveVar(data.content || "", vars);
                    set(s => ({
                        messages: [...s.messages, { id: Date.now().toString(), text: iparse, type: "text", isBot: true }],
                        waitingForInput: true
                    }));
                    get().addLog(`Aguardando input do usuário (pausado)...`, "warn");
                    return;

                case "optionsBlock":
                    const optParse = resolveVar(data.content || "", vars);
                    set(s => ({
                        messages: [...s.messages, {
                            id: Date.now().toString(),
                            text: optParse,
                            type: "options",
                            options: data.options,
                            isBot: true
                        }],
                        waitingForInput: true
                    }));
                    get().addLog(`Menu de Opções gerado (pausado)...`, "warn");
                    return;

                case "webhookBlock":
                    const isMock = !(data as any).simulateRealRequest;
                    const url = resolveVar(data.content || "", vars);

                    if (!isMock) {
                        get().addLog(`Disparando [${data.webhookMethod}] REAL para: ${url}`);
                        try {
                            const res = await fetch(url, {
                                method: data.webhookMethod || "GET",
                            });
                            const success = res.ok;
                            get().addLog(`Resposta Webhook Real: ${res.status}`, success ? "success" : "error");
                            currentNodeId = getTarget(success ? "success" : "failure");
                        } catch (e) {
                            get().addLog(`Falha na requisição real (CORS/Network)`, "error");
                            currentNodeId = getTarget("failure");
                        }
                    } else {
                        get().addLog(`[MOCK] Pulou requisição HTTP. Foi direto pro lado de Sucesso.`, "success");
                        currentNodeId = getTarget("success");
                    }
                    break;

                case "endBlock":
                case "handoverBlock":
                    set(s => ({ messages: [...s.messages, { id: Date.now().toString(), text: "🏁 Fluxo Encerrado pelo Robô.", type: "text", isBot: true }] }));
                    get().addLog(`Fim Categórico Atingido. Tratamento Paralisado.`);
                    currentNodeId = null;
                    break;

                case "identificationBlock":
                    set(s => ({ messages: [...s.messages, { id: Date.now().toString(), text: "🔗 *Clique no link abaixo para preencher os dados solicitados:*\n[ Link Dinâmico para Formit ]\n_O simulador pula automaticamente essa pausa._", type: "text", isBot: true }] }));
                    currentNodeId = getTarget();
                    break;

                default:
                    get().addLog(`Bloco ${node.type} não suportado pelo simulador visual. Ignorado.`);
                    currentNodeId = getTarget();
                    break;
            }

            set({ currentNodeId });
            isRunning = get().isRunning;
            await new Promise(r => setTimeout(r, 150));
        }

        if (!currentNodeId && get().isRunning && !get().waitingForInput) {
            set(s => ({ messages: [...s.messages, { id: "finish", text: "📴 Nenhuma Saída Detectada. Sinal Fechado.", type: "text", isBot: true }] }));
            set({ isRunning: false });
        }
    }
}));
