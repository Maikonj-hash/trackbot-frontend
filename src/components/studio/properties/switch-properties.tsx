import { PropertyPanelProps } from "./types"
import { PlusCircle, X } from "lucide-react"
import { PropertySection, PropertyInput, NodeLabelProperty } from "./base-properties"

export function SwitchProperties({ node, updateNodeData }: PropertyPanelProps) {
    const branches = Array.isArray(node.data.switchBranches) ? node.data.switchBranches : [];

    const handleAddBranch = () => {
        updateNodeData(node.id, {
            switchBranches: [...branches, { id: `branch-${Date.now()}`, value: "" }]
        });
    };

    const handleUpdateBranchValue = (index: number, newValue: string) => {
        const updatedBranches = branches.map((branch, i) =>
            i === index ? { ...branch, value: newValue } : branch
        );
        updateNodeData(node.id, { switchBranches: updatedBranches });
    };

    const handleRemoveBranch = (idToRemove: string) => {
        const updatedBranches = branches.filter(branch => branch.id !== idToRemove);
        updateNodeData(node.id, { switchBranches: updatedBranches });
    };

    return (
        <div className="space-y-6">
            <NodeLabelProperty node={node} updateNodeData={updateNodeData} />
            <PropertySection title="Variável de Avaliação">
                <div className="space-y-2">
                    <PropertyInput
                        value={node.data.switchVariable || ""}
                        onChange={(e) => updateNodeData(node.id, { switchVariable: e.target.value })}
                        placeholder="Ex: categoria_cliente"
                        className="font-mono text-blue-400"
                    />
                    <p className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-tighter px-1">
                        // O bot comparará o valor desta variável
                    </p>
                </div>
            </PropertySection>

            <PropertySection title="Casos (Branches)">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 font-mono">
                            Rotas Ativas
                        </span>
                        <button
                            onClick={handleAddBranch}
                            className="text-purple-500 hover:text-purple-400 p-1 bg-purple-500/10 rounded-md transition-colors"
                        >
                            <PlusCircle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {branches.map((branch, index: number) => (
                            <div key={branch.id} className="flex gap-2 group relative items-center bg-muted/10 p-2 rounded-xl border border-border/40 hover:border-purple-500/30 transition-all">
                                <div className="flex-1 space-y-1">
                                    <span className="text-[9px] font-bold uppercase text-muted-foreground/40 font-mono px-1">Se valor for igual a:</span>
                                    <PropertyInput
                                        value={branch.value}
                                        onChange={(e) => handleUpdateBranchValue(index, e.target.value)}
                                        placeholder="Ex: premium"
                                        className="font-mono text-[11px]"
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemoveBranch(branch.id)}
                                    className="p-1.5 text-muted-foreground/40 hover:text-rose-500 self-end mb-0.5 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {branches.length === 0 && (
                            <div className="text-[10px] text-center text-muted-foreground/40 py-6 border border-dashed border-border/40 rounded-xl font-mono uppercase tracking-tighter">
                                Nenhuma rota definida.<br />Clique no [+] no canto superior.
                            </div>
                        )}
                    </div>
                </div>
            </PropertySection>

            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                <p className="text-[9px] text-purple-400/80 font-mono uppercase leading-relaxed tracking-tighter">
                    ℹ️ <strong>Default Fallback:</strong> Qualquer valor não mapeado seguirá para o pino [Fallback].
                </p>
            </div>
        </div>
    )
}
