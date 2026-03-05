"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "@xyflow/react"
import { Users, Mail, Phone, Hash, CreditCard, ChevronRight, Brain } from "lucide-react"

export const CustomerIdentificationNode = memo(({ data, selected }: NodeProps) => {
    const fields = (data?.identificationFields as any[]) || []
    const skipIfAlreadyFilled = data?.skipIfAlreadyFilled || false

    return (
        <div className={`group relative min-w-[280px] rounded-xl border-2 transition-all duration-300 ${selected ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]' : 'border-zinc-800 bg-zinc-950/90'
            }`}>
            {/* Header com Estética HUD */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-t-lg border-b bg-gradient-to-r ${selected ? 'from-blue-600/20 to-transparent border-blue-500/50' : 'from-blue-500/10 to-transparent border-zinc-800'
                }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selected ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-blue-500/10 text-blue-400'}`}>
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold tracking-tight text-zinc-100 italic">IDENTIFICAÇÃO</h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest leading-none mt-1">
                            {fields.length} CAMPOS • DADOS
                        </p>
                    </div>
                </div>

                {skipIfAlreadyFilled && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                        <Brain className="w-3 h-3 text-blue-400" />
                        <span className="text-[9px] font-bold text-blue-300 uppercase tracking-tighter">Skip ON</span>
                    </div>
                )}
            </div>

            {/* Lista de Campos (Preview) */}
            <div className="p-4 space-y-2 bg-zinc-950/50 backdrop-blur-sm">
                {fields.length > 0 ? (
                    fields.map((field, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-zinc-800/50 bg-zinc-900/50 group/field hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500/60">
                                    {field.type === 'EMAIL' && <Mail className="w-3.5 h-3.5" />}
                                    {field.type === 'PHONE' && <Phone className="w-3.5 h-3.5" />}
                                    {field.type === 'NUMBER' && <Hash className="w-3.5 h-3.5" />}
                                    {field.type === 'CPF' && <CreditCard className="w-3.5 h-3.5" />}
                                    {field.type === 'TEXT' && <ChevronRight className="w-3.5 h-3.5" />}
                                </span>
                                <span className="text-xs text-zinc-400 font-medium truncate max-w-[140px] lowercase group-hover/field:text-zinc-200 transition-colors">
                                    {field.label}
                                </span>
                            </div>
                            <span className="text-[10px] text-zinc-600 font-mono lowercase opacity-0 group-hover/field:opacity-100 transition-opacity">
                                {'{{'}{field.saveToVariable}{'}}'}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-4 text-center border-2 border-dashed border-zinc-900 rounded-lg">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Nenhum campo configurado</p>
                    </div>
                )}
            </div>

            {/* Ports / Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-4 h-4 !bg-zinc-950 border-2 !border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] !-left-2"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-4 h-4 !bg-zinc-950 border-2 !border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] !-right-2"
            />
        </div>
    )
})

CustomerIdentificationNode.displayName = "CustomerIdentificationNode"
