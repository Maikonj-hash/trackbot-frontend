import { PropertyPanelProps } from "./types"
import { PlusCircle, X } from "lucide-react"

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
        <div className="space-y-4 pt-2">
            <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Variável a ser Avaliada
                </label>
                <input
                    type="text"
                    value={node.data.switchVariable || ""}
                    onChange={(e) => updateNodeData(node.id, { switchVariable: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-blue-500/50 focus:border-blue-500 transition-colors"
                    placeholder="Ex: plano (NÃO USE {{ }})"
                />
                <p className="text-[10px] text-muted-foreground pt-1">
                    Insira apenas o nome da variável. Ex: <code>plano</code>, <code>score</code>. O bot irá comparar o valor salvo nela com os casos abaixo.
                </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Casos (Branches)
                    </label>
                    <button
                        onClick={handleAddBranch}
                        className="text-purple-500 hover:text-purple-400 p-1 flex items-center gap-1 rounded-md hover:bg-purple-500/10 transition-colors"
                        title="Adicionar Novo Caso"
                    >
                        <PlusCircle className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {branches.map((branch, index: number) => (
                        <div key={branch.id} className="flex gap-2 group relative items-center bg-muted/20 p-2 rounded-lg border border-border/50 hover:border-purple-500/30 transition-all">
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground">Se valor for igual a:</label>
                                <input
                                    type="text"
                                    value={branch.value}
                                    onChange={(e) => handleUpdateBranchValue(index, e.target.value)}
                                    className="w-full rounded-md border border-input/50 bg-background px-2 py-1 text-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 hover:border-purple-500/50 transition-colors"
                                    placeholder="Ex: premium"
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveBranch(branch.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive self-end mb-0.5 rounded-md hover:bg-destructive/10 transition-colors"
                                title="Remover Rota"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {branches.length === 0 && (
                        <div className="text-xs text-center text-muted-foreground py-4 border border-dashed border-border/50 rounded-lg">
                            Nenhum caso cadastrado.<br />Clique no <span className="text-purple-500">+</span> para adicionar a primeira rota.
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-2">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-md">
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium leading-relaxed">
                        ℹ️ <strong>Rota Default:</strong> Qualquer valor que não bata com os casos acima será roteado para o pino <code>Fallback</code> automaticamente.
                    </p>
                </div>
            </div>
        </div>
    )
}
