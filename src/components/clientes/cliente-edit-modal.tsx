"use client"

import { useState } from "react"
import { Save, User, Brain, Tag, Trash2 } from "lucide-react"
import { API_URL } from "@/lib/constants"
import { Cliente } from "@/types/models"
import { StandardModal } from "@/components/ui/standard-modal"

interface ClienteEditModalProps {
    cliente: Cliente
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
            const res = await fetch(`${API_URL}/users/${cliente.id}`, {
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
        <StandardModal
            isOpen={true}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>FICHA DO CLIENTE</span>
                </div>
            }
            description={
                <span className="font-mono tracking-tighter">ID: {cliente.id} // WhatsApp: {cliente.phone}</span>
            }
            size="lg"
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-muted/50 rounded border border-border/50 transition-colors"
                    >
                        CANCELAR
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                        {saving ? (
                            <div className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        SALVAR ALTERAÇÕES
                    </button>
                </div>
            }
        >
            <div className="space-y-8 py-2">
                {/* Campo Nome */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Identificação Principal</label>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="NOME COMPLETO"
                        className="w-full bg-muted/10 border border-border/50 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-foreground/30 transition-all placeholder:opacity-30"
                    />
                </div>

                {/* Metadados / Inteligência */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Brain className="w-3 h-3 text-muted-foreground" />
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dados Capturados (Memory)</label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(metadata).map(([key, value]: any) => (
                            <div key={key} className="flex items-center gap-3 p-3 bg-muted/5 border border-border/30 rounded group hover:border-border/60 transition-colors">
                                <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest font-mono">[{key}]</span>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => updateMetaValue(key, e.target.value)}
                                        className="bg-transparent text-sm font-mono focus:outline-none w-full border-b border-transparent focus:border-foreground/20 transition-all py-0.5"
                                    />
                                </div>
                                <button
                                    onClick={() => removeMeta(key)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-foreground transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}

                        {Object.keys(metadata).length === 0 && (
                            <div className="text-center py-10 border border-dashed border-border/30 rounded bg-muted/5">
                                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-50">// Zero metadados encontrados</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StandardModal>
    )
}
