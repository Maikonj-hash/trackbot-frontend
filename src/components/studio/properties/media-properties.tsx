import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput, PropertyToggle } from "./base-properties"

export function MediaProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <PropertySection title="Tipo de Mídia">
                <select
                    value={node.data.mediaType || "image"}
                    onChange={(e) => updateNodeData(node.id, { mediaType: e.target.value as any })}
                    className="w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none font-medium"
                >
                    <option value="image">Imagem (JPG, PNG)</option>
                    <option value="video">Vídeo (MP4)</option>
                    <option value="audio">Áudio Gravado (PTT)</option>
                    <option value="document">Documento (PDF, etc)</option>
                </select>
            </PropertySection>

            <PropertySection title="Origem do Arquivo">
                <div className="space-y-2">
                    <PropertyInput
                        value={node.data.content as string || ""}
                        onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                        placeholder="https://sua-imagem.com/foto.png"
                    />
                    <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter px-1">
                        URL pública do arquivo (CDN/S3)
                    </p>
                </div>
            </PropertySection>

            <PropertySection title="Ações do Cliente">
                <PropertyToggle
                    label="Habilitar Voltar (Undo)"
                    description="Permitir que o cliente retorne ao passo anterior digitando '0'."
                    checked={!!node.data.allowBack}
                    onChange={(checked) => updateNodeData(node.id, { allowBack: checked })}
                />
            </PropertySection>
        </div>
    )
}
