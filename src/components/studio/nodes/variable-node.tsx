import { Position, NodeProps, Node } from "@xyflow/react";
import { Variable } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";

export function VariableNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const actionMap: Record<string, string> = {
        SET: "=",
        INCREMENT: "+=",
        DECREMENT: "-=",
    };

    const variable = data?.variableName || "var_name";
    const action = actionMap[data?.variableAction || "SET"] || "=";
    const value = data?.variableValue || "value";

    return (
        <NodeContainer selected={selected} color="fuchsia">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={Variable} label="SET VARIABLE" color="fuchsia" />

            <div className="p-3 bg-card flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-fuchsia-500 bg-fuchsia-500/5 px-2 py-2 rounded border border-fuchsia-500/10 shadow-inner">
                    <span className="font-bold">{variable}</span>
                    <span className="text-muted-foreground/50">{action}</span>
                    <span className="text-foreground/80">{value}</span>
                </div>
            </div>

            <NodeHandle type="source" position={Position.Bottom} color="fuchsia" />
        </NodeContainer>
    );
}
