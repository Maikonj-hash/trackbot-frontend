"use client";

import { useState } from "react";
import {
    Smartphone,
    Link as LinkIcon,
    Unlink,
    Trash2,
    QrCode,
    Circle,
    MoreHorizontal,
    ExternalLink,
    Loader2
} from "lucide-react";
import { clsx } from "clsx";
import { API_URL } from "@/lib/constants";

interface Instance {
    id: string;
    name: string;
    phone: string | null;
    status: string;
    provider: "BAILEYS" | "META_OFFICIAL";
    flowId: string | null;
    updatedAt: string;
}

interface Flow {
    id: string;
    name: string;
}

interface InstanceCardProps {
    instance: Instance;
    flows: Flow[];
    onPair: (id: string, name: string) => void;
    onRefresh: () => void;
}

import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function InstanceCard({ instance, flows, onPair, onRefresh }: InstanceCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmDisconnect, setConfirmDisconnect] = useState(false);

    const handleDisconnect = async () => {
        try {
            setIsUpdating(true);
            await fetch(`${API_URL}/instances/${instance.id}/disconnect`, { method: "DELETE" });
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsUpdating(true);
            await fetch(`${API_URL}/instances/${instance.id}`, { method: "DELETE" });
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAssociateFlow = async (flowId: string | null) => {
        try {
            setIsUpdating(true);
            await fetch(`${API_URL}/instances/${instance.id}/flow`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flowId })
            });
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const isConnected = instance.status === "CONNECTED";
    const statusColor = isConnected ? "text-blue-600" :
        instance.status === "CONNECTING" ? "text-amber-500" :
            instance.status === "QR_READY" ? "text-blue-600" : "text-muted-foreground";

    const isMeta = instance.provider === "META_OFFICIAL";

    return (
        <div className="group relative bg-card border border-border/50 rounded-lg overflow-hidden transition-all hover:border-border hover:shadow-md font-sans">
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "w-10 h-10 rounded-md flex items-center justify-center border border-border/50 transition-colors",
                        isConnected ? "bg-blue-600/10 border-blue-600/20" : "bg-muted shadow-inner"
                    )}>
                        <Smartphone className={clsx("w-5 h-5", isConnected ? "text-blue-600" : "text-muted-foreground")} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-foreground truncate max-w-[120px]">
                                {instance.name}
                            </span>
                            <span className={clsx(
                                "text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tighter",
                                isMeta ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-foreground/5 border-foreground/10 text-muted-foreground"
                            )}>
                                {isMeta ? "Meta" : "Baileys"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Circle className={clsx("w-1.5 h-1.5 fill-current animate-pulse", statusColor)} />
                            <span className="text-[9px] font-mono font-medium uppercase tracking-tighter text-muted-foreground">
                                {isMeta && isConnected ? "ACTIVE (WEBHOOK)" : instance.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-all"
                        title="Deletar Instância"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-60">Número Conectado</span>
                    <div className="text-xs font-medium text-foreground py-1 border-b border-border/30">
                        {instance.phone ? `+${instance.phone}` : isMeta ? "Configurado via Meta" : "---"}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-60">Fluxo Associado</span>
                        <LinkIcon className="w-3 h-3 text-muted-foreground/40" />
                    </div>
                    <select
                        value={instance.flowId || ""}
                        onChange={(e) => handleAssociateFlow(e.target.value || null)}
                        disabled={isUpdating}
                        className="w-full bg-muted/40 border border-border/40 rounded px-2 py-1.5 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Sem automação vinculada</option>
                        {flows.map(flow => (
                            <option key={flow.id} value={flow.id}>{flow.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="p-3 bg-muted/10 border-t border-border/40 flex items-center gap-2">
                {!isConnected ? (
                    !isMeta ? (
                        <button
                            onClick={() => onPair(instance.id, instance.name)}
                            className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold rounded shadow-sm transition-all uppercase tracking-widest"
                        >
                            <QrCode className="w-3.5 h-3.5" /> Parear Aparelho
                        </button>
                    ) : (
                        <div className="flex-1 text-center py-1.5 px-3 bg-blue-500/5 text-blue-500 text-[10px] font-bold rounded border border-blue-500/10 uppercase tracking-widest">
                            Aguardando Webhook
                        </div>
                    )
                ) : (
                    <button
                        onClick={() => setConfirmDisconnect(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-1.5 border border-border/50 hover:bg-muted text-muted-foreground text-[10px] font-bold rounded transition-all uppercase tracking-widest"
                    >
                        <Unlink className="w-3.5 h-3.5" /> {isMeta ? "Remover Conexão" : "Desconectar"}
                    </button>
                )}
            </div>

            {isUpdating && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                variant="danger"
                title="Apagar Aparelho"
                description={`Tem certeza que deseja apagar permanentemente a instância "${instance.name}"? Isso removerá todos os dados de conexão.`}
                confirmText="Apagar Instância"
            />

            <ConfirmationModal
                isOpen={confirmDisconnect}
                onClose={() => setConfirmDisconnect(false)}
                onConfirm={handleDisconnect}
                variant="warning"
                title={isMeta ? "Remover Configuração Meta" : "Desconectar WhatsApp"}
                description={isMeta
                    ? `Deseja realmente remover a conexão com a Meta para "${instance.name}"? As mensagens via Cloud API pararão de chegar.`
                    : `Deseja realmente desconectar o número da instância "${instance.name}"? Você precisará escanear o QR Code novamente para reconectar.`
                }
                confirmText={isMeta ? "Remover Conexão" : "Desconectar"}
            />
        </div>
    );
}
