import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput, PropertyToggle, PropertyHint, PropertySelect } from "./base-properties"

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

            <PropertySection title="Validação de Dados">
                <div className="space-y-4">
                    <PropertySelect
                        label="Tipo de Dado (Validação)"
                        value={node.data.expectedType || "TEXT"}
                        onChange={(val) => updateNodeData(node.id, { expectedType: val as any })}
                        options={[
                            { label: "Texto Livre (Sem validação)", value: "TEXT" },
                            { label: "Data (DD/MM/AAAA)", value: "DATE" },
                            { label: "Horário (HH:MM)", value: "TIME" },
                            { label: "E-mail", value: "EMAIL" },
                            { label: "Telefone / Celular", value: "PHONE" },
                            { label: "CPF ou CNPJ", value: "CPF_CNPJ" },
                            { label: "CEP", value: "CEP" },
                            { label: "Placa de Veículo", value: "LICENSE_PLATE" },
                            { label: "Número Inteiro/Decimal", value: "NUMBER" },
                        ]}
                    />

                    {node.data.expectedType && node.data.expectedType !== 'TEXT' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-tight text-foreground/80 uppercase">Mensagem de Erro Personalizada</label>
                                <PropertyInput
                                    value={node.data.errorMessage as string || ""}
                                    onChange={(e) => updateNodeData(node.id, { errorMessage: e.target.value })}
                                    placeholder="Ex: Formato inválido. Tente novamente."
                                />
                                <PropertyHint>
                                    Mensagem enviada se o cliente errar a validação.
                                </PropertyHint>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-tight text-foreground/80 uppercase">Limite de Tentativas</label>
                                <PropertyInput
                                    type="number"
                                    value={node.data.maxRetries as number || ""}
                                    onChange={(e) => updateNodeData(node.id, { maxRetries: parseInt(e.target.value) || undefined })}
                                    placeholder="Deixe em branco para infinito"
                                    min={1}
                                />
                            </div>
                        </>
                    )}
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
