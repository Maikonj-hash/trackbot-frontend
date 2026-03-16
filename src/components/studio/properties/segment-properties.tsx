import { PropertyPanelProps } from "./types"
import { PropertySection, PropertyInput, NodeLabelProperty } from "./base-properties"
import { Layout } from "lucide-react"

export function SegmentProperties({ node, updateNodeData }: PropertyPanelProps) {
    const colors = [
        { name: "Blue", value: "#3b82f6" },
        { name: "Purple", value: "#a855f7" },
        { name: "Emerald", value: "#10b981" },
        { name: "Amber", value: "#f59e0b" },
        { name: "Rose", value: "#f43f5e" },
        { name: "Slate", value: "#64748b" },
    ];

    return (
        <div className="space-y-6">
            <NodeLabelProperty node={node} updateNodeData={updateNodeData} />

            <PropertySection title="Estilização Visual">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Cor Temática</span>
                        <div className="grid grid-cols-6 gap-2 pt-1 px-1">
                            {colors.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => updateNodeData(node.id, { color: c.value })}
                                    className={`
                                        w-full aspect-square rounded-full border-2 transition-all
                                        ${node.data.color === c.value ? 'border-foreground scale-110 shadow-lg' : 'border-transparent hover:scale-105'}
                                    `}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </PropertySection>

            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-3">
                <Layout className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-500/80 leading-relaxed font-medium">
                    Use os cantos do bloco no canvas para redimensionar a área. Este bloco não gera custos de execução por ser puramente organizacional.
                </p>
            </div>
        </div>
    )
}
