"use client";

import { useMemo, useEffect, Suspense, useState, useCallback } from "react";
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
import { ContextMenu } from "@/components/studio/context-menu";
import { ShortcutGuide } from "@/components/studio/shortcut-guide";
import { TrackDeskNode } from "@/components/studio/nodes/track-desk-node";
import { NODE_REGISTRY } from "@/lib/node-registry";

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
    trackDeskBlock: TrackDeskNode,
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

    const { screenToFlowPosition, fitView, getViewport } = useReactFlow();

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

    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();

        const rawType = event.dataTransfer.getData("application/reactflow");
        const labelFromSidebar = event.dataTransfer.getData("application/reactflow-label");

        if (typeof rawType === "undefined" || !rawType) return;

        const [type, specificType] = rawType.split(":");
        const registryNode = NODE_REGISTRY[type];

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: any = {
            id: `${type}_${Date.now()}`,
            type: registryNode?.type || type,
            position,
            data: {
                ...(registryNode?.initialData || {}),
                label: labelFromSidebar || registryNode?.label || "Novo Bloco",
                ...(specificType ? { expectedType: specificType as any } : {})
            },
        };

        if (type === "segmentBlock") {
            newNode.width = 400;
            newNode.height = 300;
            newNode.zIndex = -1;
        }

        addNode(newNode);
        setSelectedNode(newNode.id);
    };

    const handleContextMenu = useCallback((event: React.MouseEvent, node?: Node) => {
        event.preventDefault();
        if (node) setSelectedNode(node.id);

        setContextMenu({
            x: event.clientX,
            y: event.clientY,
        });
    }, [setSelectedNode]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (modifier && e.key === 'd') {
                e.preventDefault();
                const selectedIds = nodes.filter(n => n.selected).map(n => n.id);
                if (selectedIds.length > 0) {
                    useFlowStore.getState().duplicateNodes(selectedIds);
                }
            }

            if (modifier && e.key === 'c') {
                const selectedIds = nodes.filter(n => n.selected).map(n => n.id);
                if (selectedIds.length > 0) {
                    useFlowStore.getState().copyNodes(selectedIds);
                }
            }

            if (modifier && e.key === 'v') {
                e.preventDefault();
                const { clipboard } = useFlowStore.getState();
                if (clipboard) {
                    const { x, y, zoom } = getViewport();
                    const centerX = (window.innerWidth / 2 - x) / zoom;
                    const centerY = (window.innerHeight / 2 - y) / zoom;

                    useFlowStore.getState().pasteNodes({
                        x: centerX - 100,
                        y: centerY - 100
                    });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nodes]);

    return (
        <div className="flex flex-col w-full h-screen font-sans overflow-hidden bg-background">
            <StudioTopbar />

            <div className="flex flex-1 relative overflow-hidden">
                <SidebarNodes />

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
                        onPaneClick={() => {
                            setSelectedNode(null);
                            setContextMenu(null);
                        }}
                        onNodeContextMenu={(e, node) => handleContextMenu(e as any, node as any)}
                        onPaneContextMenu={(e) => handleContextMenu(e as any)}
                        deleteKeyCode={["Backspace", "Delete"]}
                        isValidConnection={(connection) => {
                            if (connection.source === connection.target) return false;
                            if (connection.target === 'start-1') return false;
                            return true;
                        }}
                        fitView
                        snapToGrid
                        snapGrid={[15, 15]}
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

                    {contextMenu && (
                        <ContextMenu
                            x={contextMenu.x}
                            y={contextMenu.y}
                            onClose={() => setContextMenu(null)}
                            onDuplicate={() => {
                                const selectedIds = nodes.filter(n => n.selected).map(n => n.id);
                                if (selectedIds.length > 0) useFlowStore.getState().duplicateNodes(selectedIds);
                            }}
                            onCopy={() => {
                                const selectedIds = nodes.filter(n => n.selected).map(n => n.id);
                                if (selectedIds.length > 0) useFlowStore.getState().copyNodes(selectedIds);
                            }}
                            onPaste={() => {
                                const { clipboard } = useFlowStore.getState();
                                if (clipboard) {
                                    const { x, y, zoom } = getViewport();
                                    useFlowStore.getState().pasteNodes({
                                        x: (window.innerWidth / 2 - x) / zoom - 100,
                                        y: (window.innerHeight / 2 - y) / zoom - 100
                                    });
                                }
                            }}
                            onDelete={() => {
                                const selected = nodes.find(n => n.selected);
                                if (selected) useFlowStore.getState().deleteNode(selected.id);
                            }}
                            hasSelection={nodes.some(n => n.selected)}
                            canPaste={!!useFlowStore.getState().clipboard}
                        />
                    )}
                    <ShortcutGuide />
                </div>

                {selectedNode && <PropertiesDrawer />}

                <VariablesDrawer />
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
