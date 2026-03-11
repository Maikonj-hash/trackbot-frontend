import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput, PropertyToggle, PropertyHint } from "./base-properties"

export function InputProperties({ node, updateNodeData }: PropertyPanelProps) {
    return (
        <div className="space-y-6">
            <PropertySection title="Pergunta ao Cliente">
                <PropertyInput
                    isTextArea
                    value={node.data.content as string || ""}
                    onChange={(e) => updateNodeData(node.id, { content: e.target.value })}
                    placeholder="O que o bot deve perguntar?"
                />
            </PropertySection>

            <PropertySection title="Armazenamento">
                <div className="space-y-2">
                    <PropertyInput
                        type="text"
                        value={node.data.variableName || ""}
                        onChange={(e) => updateNodeData(node.id, { variableName: e.target.value })}
                        placeholder="NOME_DA_VARIAVEL"
                        className="font-mono uppercase tracking-wider"
                    />
                    <PropertyHint>
                        O dado coletado será salvo no perfil do cliente com esta chave.
                    </PropertyHint>
                </div>
            </PropertySection>

            <PropertySection title="Ações">
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
