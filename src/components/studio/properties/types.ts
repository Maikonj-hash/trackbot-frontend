import { Node } from "@xyflow/react";
import { TrackerNodeData } from "@/store/flow-store";

export interface PropertyPanelProps {
    node: Node<TrackerNodeData>;
    updateNodeData: (nodeId: string, data: Partial<TrackerNodeData>) => void;
}
