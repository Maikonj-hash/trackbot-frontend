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
            "flex w-64 flex-col rounded-md border shadow-sm overflow-hidden transition-all",
            selected ? "border-pink-500 ring-1 ring-pink-500" : "border-border bg-card hover:border-border/80"
        )}>
            {/* Entrada */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 bg-muted-foreground" />

            <div className="flex items-center gap-2 bg-pink-500/10 px-3 py-2 border-b border-border/50">
                <ImageIcon className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-semibold text-pink-500 tracking-wider uppercase">
                    Multimídia ({mediaLabel})
                </span>
            </div>

            <div className="p-3 bg-muted/20 pb-0">
                <div className="text-sm font-medium leading-relaxed truncate px-1 text-muted-foreground">
                    {data?.content || "Nenhum arquivo enviado"}
                </div>
            </div>

            <div className="px-3 pb-3 bg-muted/20 pt-2">
                <div className="h-[100px] w-full rounded-md border border-dashed border-border/60 bg-background/50 flex items-center justify-center text-xs text-muted-foreground">
                    Preview do Arquivo
                </div>
            </div>

            {/* Saída */}
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 bg-pink-500 border-background" />
        </div>
    );
}
