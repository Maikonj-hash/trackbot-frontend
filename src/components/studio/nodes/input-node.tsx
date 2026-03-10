import { Position, NodeProps, Node } from "@xyflow/react";
import { UserRound } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";
import { VariableHighlighter } from "./base/variable-highlighter";

export function InputNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <NodeContainer selected={selected} color="violet">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={UserRound} label="USER INPUT" color="violet" allowBack={data.allowBack} />

            <NodeBody className="text-left" noTextWrapper>
                <div className="space-y-2">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-70 px-1">
                        Question to User:
                    </div>
                    <div className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words px-1 text-foreground/80">
                        <VariableHighlighter text={data?.content || "Sua pergunta aqui..."} />
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/30">
                        <div className="text-[9px] font-mono text-violet-500 uppercase tracking-widest bg-violet-500/10 px-2 py-0.5 rounded-full inline-block">
                            Save to Variable
                        </div>
                    </div>
                </div>
            </NodeBody>

            <div className="h-4 relative w-full rounded-b-md bg-muted/5">
                <NodeHandle
                    type="source"
                    id="next"
                    position={Position.Bottom}
                    color="violet"
                    style={{ bottom: '-4px' }}
                />
            </div>
        </NodeContainer>
    );
}
