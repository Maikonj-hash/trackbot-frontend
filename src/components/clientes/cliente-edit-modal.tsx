"use client"

import { useState } from "react"
import { X, Save, User, Phone, Brain, Tag, Trash2, PlusCircle } from "lucide-react"

interface ClienteEditModalProps {
    cliente: any
    onClose: () => void
    onUpdate: () => void
}

export function ClienteEditModal({ cliente, onClose, onUpdate }: ClienteEditModalProps) {
    const [name, setName] = useState(cliente.name || "")
    const [metadata, setMetadata] = useState<any>(
        typeof cliente.metadata === 'string' ? JSON.parse(cliente.metadata) : cliente.metadata || {}
    )
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch(`http://localhost:3000/users/${cliente.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, metadata })
            })

            if (res.ok) {
                onUpdate()
                onClose()
            }
        } catch (err) {
            console.error("Failed to update cliente", err)
        } finally {
            setSaving(false)
        }
    }

    const updateMetaValue = (key: string, value: string) => {
        setMetadata({ ...metadata, [key]: value })
    }

    const removeMeta = (key: string) => {
        const newMeta = { ...metadata }
        delete newMeta[key]
        setMetadata(newMeta)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-zinc-950 border border-border/50 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/10 border border-blue-600/20 rounded-lg text-blue-500">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">Ficha do Cliente</h2>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{cliente.phone}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-8">
                    {/* Campo Nome */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-blue-500" />
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Identificação</label>
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome Completo"
                            className="w-full bg-muted/40 border border-border/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                        />
                    </div>

                    {/* Metadados / Inteligência */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="w-3.5 h-3.5 text-blue-500" />
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dados Capturados</label>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(metadata).map(([key, value]: any) => (
                                <div key={key} className="flex items-center gap-2 p-3 bg-muted/20 border border-border/30 rounded-lg group animate-in slide-in-from-top-1 duration-200">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter lowercase">{key}</span>
                                        <input
                                            type="text"
                                            value={value}
                                            onChange={(e) => updateMetaValue(key, e.target.value)}
                                            className="bg-transparent text-sm focus:outline-none w-full border-b border-transparent focus:border-blue-500/30 transition-all py-0.5"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeMeta(key)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {Object.keys(metadata).length === 0 && (
                                <div className="text-center py-6 border-2 border-dashed border-border/30 rounded-lg">
                                    <p className="text-xs text-muted-foreground italic">Nenhum metadado registrado para este usuário.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium hover:bg-muted/50 rounded-lg transition-colors border border-border/50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    )
}
