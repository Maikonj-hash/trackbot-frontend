"use client";

import { useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
    ReactFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    Panel,
    ReactFlowProvider,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "@/store/flow-store";
import { MessageNode } from "@/components/studio/nodes/message-node";
import { OptionsNode } from "@/components/studio/nodes/options-node";
import { ConditionNode } from "@/components/studio/nodes/condition-node";
import { InputNode } from "@/components/studio/nodes/input-node";
import { DelayNode } from "@/components/studio/nodes/delay-node";
import { MediaNode } from "@/components/studio/nodes/media-node";
import { CustomerIdentificationNode } from "@/components/studio/nodes/customer-identification-node";
import { WebhookNode } from "@/components/studio/nodes/webhook-node";
import { VariableNode } from "@/components/studio/nodes/variable-node";
import { HandoverNode } from "@/components/studio/nodes/handover-node";
import { EndNode } from "@/components/studio/nodes/end-node";
import { StartNode } from "@/components/studio/nodes/start-node";
import { PropertiesDrawer } from "@/components/studio/properties-drawer";
import { SidebarNodes } from "@/components/studio/sidebar-nodes";
import { StudioTopbar } from "@/components/studio/studio-topbar";
import { API_URL } from "@/lib/constants";
import { SwitchNode } from "@/components/studio/nodes/switch-node";
import { ReviewNode } from "@/components/studio/nodes/review-node";
import { SimulatorDrawer } from "@/components/studio/simulator/simulator-drawer";
import { VariablesDrawer } from "@/components/studio/variables-drawer";
import { JumpNode } from "@/components/studio/nodes/jump-node";
import { SegmentNode } from "@/components/studio/nodes/segment-node";

const customNodeTypes = {
    messageBlock: MessageNode,
    optionsBlock: OptionsNode,
    inputBlock: InputNode,
    conditionBlock: ConditionNode,
    delayBlock: DelayNode,
    mediaBlock: MediaNode,
    identificationBlock: CustomerIdentificationNode,
    webhookBlock: WebhookNode,
    variableBlock: VariableNode,
    handoverBlock: HandoverNode,
    switchBlock: SwitchNode,
    reviewBlock: ReviewNode,
    jumpBlock: JumpNode,
    segmentBlock: SegmentNode,
    endBlock: EndNode,
    startBlock: StartNode,
};

function StudioCanvas() {
    const searchParams = useSearchParams();
    const flowId = searchParams.get("id");

    const {
        nodes,
        edges,
        selectedNode,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setSelectedNode,
        addNode,
        setFlow,
        setFlowMetadata
    } = useFlowStore();

    const { screenToFlowPosition, fitView } = useReactFlow();

    useEffect(() => {
        if (!flowId) return;

        fetch(`${API_URL}/flows/${flowId}`)
            .then(res => res.json())
            .then(data => {
                setFlowMetadata(data.id, data.name, data.description || "");
                if (data.jsonContent && data.jsonContent.nodes) {
                    setFlow(data.jsonContent.nodes, data.jsonContent.edges || []);
                } else {
                    setFlow([], []);
                }

                setTimeout(() => {
                    fitView({ padding: 0.2, duration: 800, maxZoom: 1 });
                }, 100);
            })
            .catch(err => console.error("Erro ao carregar fluxo", err));
    }, [flowId, setFlow, setFlowMetadata, fitView]);

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();

        const rawType = event.dataTransfer.getData("application/reactflow");
        const label = event.dataTransfer.getData("application/reactflow-label");

        if (typeof rawType === "undefined" || !rawType) {
            return;
        }

        const [type, expectedType] = rawType.split(":");

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: any = {
            id: `dndnode_${Date.now()}`,
            type,
            position,
            data: { 
                label, 
                type: type.replace("Block", ""), 
                content: "",
                ...(expectedType ? { expectedType: expectedType as any } : {})
            },
        };

        // Adiciona dimensões iniciais apenas para o Segmentador
        if (type === "segmentBlock") {
            newNode.width = 400;
            newNode.height = 300;
            newNode.zIndex = -1; // Garante que fique atrás dos outros nós
            newNode.data.color = "#3b82f6"; // Cor padrão inicial
        }

        addNode(newNode);
        setSelectedNode(newNode.id);
    };

    return (
        <div className="flex flex-col w-full h-screen font-sans overflow-hidden bg-background">
            <StudioTopbar />

            {/* Corpo Inferior onde fica o Studio  */}
            <div className="flex flex-1 relative overflow-hidden">
                {/* PAINEL LATERAL ESQUERDO (Blocos) */}
                <SidebarNodes />

                {/* Container Principal do Editor (Canvas) */}
                <div className="flex-1 h-full w-full border-t border-b border-border/50 overflow-hidden relative"
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={customNodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={(_, node) => setSelectedNode(node.id)}
                        onPaneClick={() => setSelectedNode(null)}
                        deleteKeyCode={["Backspace", "Delete"]}
                        isValidConnection={(connection) => {
                            if (connection.source === connection.target) return false;
                            if (connection.target === 'start-1') return false;
                            return true;
                        }}
                        fitView
                        className="bg-transparent"
                    >
                        <Background
                            variant={BackgroundVariant.Dots}
                            gap={16}
                            size={1.5}
                            color="rgba(0, 0, 0, 0.1)"
                        />
                        <Controls className="fill-foreground stroke-border bg-card shadow-lg" showInteractive={false} />

                        <Panel position="top-left" className="m-4">
                            <h1 className="text-xl font-bold tracking-tight text-foreground drop-shadow-md">
                                Flow Builder MVP
                            </h1>
                            <p className="text-sm text-muted-foreground">Edite, arraste e clique nas caixas.</p>
                        </Panel>

                        <MiniMap
                            zoomable
                            pannable
                        nodeColor={(n) => {
                                if (n.type === "segmentBlock") return (n.data as any).color || "#3b82f6";
                                if (n.type === "messageBlock") return "#2563eb";
                                return "#3b82f6";
                            }}
                            maskColor="rgba(255, 255, 255, 0.5)"
                            className="bg-card/50 border border-border rounded-md shadow-xl"
                        />
                    </ReactFlow>
                </div>

                {/* PAINEL LATERAL DIREITO (Propriedades) */}
                {selectedNode && <PropertiesDrawer />}

                {/* PAINEL LATERAL DIREITO (Variáveis) */}
                <VariablesDrawer />

                {/* SIMULADOR (Overlay Absoluto à Direita) */}
                <SimulatorDrawer />
            </div>
        </div>
    );
}

export default function StudioPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
            <ReactFlowProvider>
                <StudioCanvas />
            </ReactFlowProvider>
        </Suspense>
    );
}
