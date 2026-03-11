import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput, PropertyToggle } from "./base-properties"

export function MessageProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <PropertySection title="Conteúdo da Mensagem">
                <PropertyInput
                    isTextArea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    placeholder="Digite a mensagem que o bot enviará..."
                />
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
