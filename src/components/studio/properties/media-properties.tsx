import { PropertyPanelProps } from "./types"

export function MediaProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-4 pt-2">
            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tipo de Mídia
                </label>
                <select
                    value={node.data.mediaType || "image"}
                    onChange={(e) => updateNodeData(node.id, { mediaType: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                    <option value="image">Imagem (JPG, PNG)</option>
                    <option value="video">Vídeo (MP4)</option>
                    <option value="audio">Áudio Gravado (PTT)</option>
                    <option value="document">Documento (PDF, etc)</option>
                </select>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    URL do Arquivo (Imagem/Vídeo/Áudio)
                </label>
                <input
                    type="text"
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="https://sua-imagem.com/foto.png"
                />
            </div>
        </div>
    )
}
