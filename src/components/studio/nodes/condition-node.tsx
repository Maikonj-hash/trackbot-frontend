import { Position, NodeProps, Node } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";
import { VariableHighlighter } from "./base/variable-highlighter";

export function ConditionNode({ id, data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const operatorMap: Record<string, string> = {
        EQUALS: "==",
        NOT_EQUALS: "!=",
        CONTAINS: "∋",
        IS_EMPTY: "∅",
        IS_NOT_EMPTY: "∃",
    };

    const variable = data?.conditionVariable || "Not set";
    const operator = operatorMap[data?.conditionOperator || ""] || data?.conditionOperator || "Operator";
    const value = data?.conditionValue !== undefined ? String(data.conditionValue) : "Value";

    return (
        <NodeContainer selected={selected} color="violet">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader 
                icon={GitBranch} 
                label={data.label || "LOGIC CONDITION"} 
                color="violet" 
                onLabelChange={(newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })}
            />

            <NodeBody className="flex flex-col gap-2" noTextWrapper>
                <div className="flex flex-col gap-1 bg-muted/20 p-2 rounded border border-border/40">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-tight">IF VARIABLE</span>
                    <div className="text-[11px] font-bold text-violet-500 break-all">
                        {variable}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex-1 h-[1px] bg-border/50" />
                    <span className="text-[10px] font-mono font-bold text-violet-400 bg-muted/30 px-1.5 rounded">{operator}</span>
                    <div className="flex-1 h-[1px] bg-border/50" />
                </div>

                <div className="text-[11px] font-medium text-center bg-muted/10 py-1.5 rounded border border-border/60 text-foreground/70 break-all">
                    <VariableHighlighter text={String(value)} />
                </div>
            </NodeBody>

            <div className="grid grid-cols-2 border-t border-border/50 bg-muted/5 rounded-b-md h-8">
                <div className="flex items-center justify-center border-r border-border/50 relative group hover:bg-emerald-500/5 transition-colors">
                    <span className="text-[9px] font-bold text-emerald-600 tracking-tighter uppercase opacity-70 group-hover:opacity-100">TRUE</span>
                    <NodeHandle
                        type="source"
                        id="true"
                        position={Position.Bottom}
                        color="emerald"
                        style={{ bottom: '-4px' }}
                    />
                </div>

                <div className="flex items-center justify-center relative group hover:bg-red-500/5 transition-colors">
                    <span className="text-[9px] font-bold text-red-600 tracking-tighter uppercase opacity-70 group-hover:opacity-100">FALSE</span>
                    <NodeHandle
                        type="source"
                        id="false"
                        position={Position.Bottom}
                        color="red"
                        style={{ bottom: '-4px' }}
                    />
                </div>
            </div>
        </NodeContainer>
    );
}
