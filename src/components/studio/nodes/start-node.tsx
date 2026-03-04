import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Play } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function StartNode({ selected }: NodeProps<Node<TrackerNodeData>>) {
    return (
        <div className={clsx(
            "flex w-48 flex-col rounded-full border shadow-lg overflow-hidden transition-all items-center justify-center p-3 bg-card",
            selected ? "border-purple-500 ring-2 ring-purple-500" : "border-border hover:border-border/80"
        )}>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-md">
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-foreground tracking-wider uppercase">
                    Início
                </span>
            </div>

            {/* Apenas Saída (Bottom) */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3.5 h-3.5 border-2 bg-purple-500 border-background"
            />
        </div>
    );
}
