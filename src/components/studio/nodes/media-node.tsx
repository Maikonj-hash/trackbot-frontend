import { Position, NodeProps, Node } from "@xyflow/react";
import { Image as ImageIcon } from "lucide-react";
import { TrackerNodeData } from "@/store/flow-store";
import { NodeContainer } from "./base/node-container";
import { NodeHeader } from "./base/node-header";
import { NodeHandle } from "./base/node-handle";
import { NodeBody } from "./base/node-body";

export function MediaNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const typeLabel = data?.mediaType?.toUpperCase() || "IMAGE";

    return (
        <NodeContainer selected={selected} color="pink">
            <NodeHandle type="target" position={Position.Top} />

            <NodeHeader icon={ImageIcon} label={`SEND ${typeLabel}`} color="pink" allowBack={data.allowBack} />

            <NodeBody className="space-y-3" noTextWrapper>
                <div className="aspect-video w-full rounded border border-border/40 bg-muted/20 flex items-center justify-center overflow-hidden">
                    <ImageIcon className="w-6 h-6 text-pink-500/20" />
                </div>
                <div className="text-[10px] break-all text-muted-foreground bg-muted/30 px-2 py-1 rounded font-mono">
                    {data?.content || "No media URL"}
                </div>
            </NodeBody>

            <NodeHandle type="source" position={Position.Bottom} color="pink" />
        </NodeContainer>
    );
}
