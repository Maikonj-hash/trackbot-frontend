import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Image as ImageIcon } from "lucide-react";
import { clsx } from "clsx";
import { TrackerNodeData } from "@/store/flow-store";

export function MediaNode({ data, selected }: NodeProps<Node<TrackerNodeData>>) {
    const typeLabels = {
        image: "Imagem",
        video: "Vídeo",
        audio: "Áudio",
        document: "Documento",
    };
    const mediaLabel = typeLabels[data?.mediaType as keyof typeof typeLabels] || "Imagem";

    return (
        <div className={clsx(
            "flex w-60 flex-col rounded-md border border-border/50 shadow-sm bg-card transition-all",
            selected ? "border-pink-500 ring-1 ring-pink-500" : "hover:border-foreground/30"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-muted-foreground" />

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 border-b border-border/50 rounded-t-md">
                <ImageIcon className="w-3 h-3 text-pink-500" />
                <span className="text-[10px] font-mono font-bold text-pink-500 tracking-widest uppercase">
                    MEDIA ({mediaLabel.toUpperCase()})
                </span>
            </div>

            <div className="p-3 bg-card pb-1">
                <div className="text-[11px] font-medium leading-relaxed truncate px-1 text-foreground/80">
                    {data?.content || "Nenhum arquivo anexado"}
                </div>
            </div>

            <div className="px-3 pb-3 bg-card pt-1">
                <div className="h-[80px] w-full rounded-md border border-dashed border-border/60 bg-muted/20 flex flex-col gap-1 items-center justify-center text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                    <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                    Preview
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 rounded-[2px] bg-background border-[1px] border-pink-500" />
        </div>
    );
}
