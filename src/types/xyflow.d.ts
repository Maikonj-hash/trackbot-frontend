// src/types/xyflow.d.ts
// Esse arquivo contorna definições de tipo corrompidas no pacote @xyflow/react v12.10.1
declare module '@xyflow/react' {
    export type Node<T = any> = any;
    export type Edge<T = any> = any;
    export type NodeProps<T = any> = any;
    export type EdgeProps<T = any> = any;
    export type HandleProps = any;
    export type Connection = any;
    export type OnConnect = any;
    export type OnNodesChange<T = any> = any;
    export type OnEdgesChange = any;
    export type XYPosition = any;
    export type NodeChange<T = any> = any;
    export type EdgeChange<T = any> = any;

    export type Position = any;
    export const Position: any;

    export type BackgroundVariant = any;
    export const BackgroundVariant: any;

    export type MarkerType = any;
    export const MarkerType: any;

    export const ReactFlow: any;
    export const Controls: any;
    export const Background: any;
    export const MiniMap: any;
    export const Panel: any;
    export const Handle: any;
    export const NodeResizer: any;
    export const ReactFlowProvider: any;
    export const useReactFlow: any;
    export const useNodesState: any;
    export const useEdgesState: any;
    export const addEdge: any;
    export const applyNodeChanges: any;
    export const applyEdgeChanges: any;
}
