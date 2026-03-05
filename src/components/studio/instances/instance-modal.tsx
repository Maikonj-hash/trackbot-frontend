"use client";

import * as React from "react";
import { StandardModal } from "@/components/ui/standard-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Globe, ShieldCheck, Key, Hash, Layout } from "lucide-react";
import { clsx } from "clsx";

interface InstanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void | Promise<void>;
    isLoading?: boolean;
}

export function InstanceModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false
}: InstanceModalProps) {
    const [provider, setProvider] = React.useState<"BAILEYS" | "META_OFFICIAL">("BAILEYS");
    const [name, setName] = React.useState("");

    // Meta Fields
    const [metaToken, setMetaToken] = React.useState("");
    const [metaPhoneNumberId, setMetaPhoneNumberId] = React.useState("");
    const [metaWabaId, setMetaWabaId] = React.useState("");
    const [metaVerifyToken, setMetaVerifyToken] = React.useState("");

    React.useEffect(() => {
        if (isOpen) {
            setName("");
            setProvider("BAILEYS");
            setMetaToken("");
            setMetaPhoneNumberId("");
            setMetaWabaId("");
            setMetaVerifyToken("");
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const payload: any = {
            name,
            provider
        };

        if (provider === "META_OFFICIAL") {
            payload.metaToken = metaToken;
            payload.metaPhoneNumberId = metaPhoneNumberId;
            payload.metaWabaId = metaWabaId;
            payload.metaVerifyToken = metaVerifyToken;
        }

        await onSubmit(payload);
        onClose();
    };

    const isFormValid = name.trim() && (
        provider === "BAILEYS" ||
        (metaToken && metaPhoneNumberId && metaWabaId && metaVerifyToken)
    );

    return (
        <StandardModal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title="Novo Aparelho"
            description="Conecte seu WhatsApp via QR Code ou use a API Oficial da Meta."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome do Aparelho */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-mono uppercase tracking-widest opacity-70 flex items-center gap-2">
                        <Layout className="w-3 h-3" /> Nome da Instância
                    </Label>
                    <Input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Suporte Vendas"
                        className="bg-muted/30 border-border/50"
                    />
                </div>

                {/* Seletor de Provedor */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                        Escolha o Provedor
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setProvider("BAILEYS")}
                            className={clsx(
                                "flex flex-col items-center gap-3 p-4 rounded-lg border transition-all text-left",
                                provider === "BAILEYS"
                                    ? "bg-foreground/5 border-foreground/20 ring-1 ring-foreground/10"
                                    : "bg-muted/20 border-border/40 hover:bg-muted/40 opacity-60"
                            )}
                        >
                            <Smartphone className={clsx("w-6 h-6", provider === "BAILEYS" ? "text-foreground" : "text-muted-foreground")} />
                            <div className="text-center">
                                <div className="text-xs font-bold uppercase tracking-tight">Baileys (QR Code)</div>
                                <div className="text-[10px] text-muted-foreground mt-1 leading-tight">Gratuito. Conexão via Web.</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setProvider("META_OFFICIAL")}
                            className={clsx(
                                "flex flex-col items-center gap-3 p-4 rounded-lg border transition-all text-left",
                                provider === "META_OFFICIAL"
                                    ? "bg-blue-500/5 border-blue-500/20 ring-1 ring-blue-500/10"
                                    : "bg-muted/20 border-border/40 hover:bg-muted/40 opacity-60"
                            )}
                        >
                            <Globe className={clsx("w-6 h-6", provider === "META_OFFICIAL" ? "text-blue-500" : "text-muted-foreground")} />
                            <div className="text-center">
                                <div className="text-xs font-bold uppercase tracking-tight text-blue-500">Meta Official API</div>
                                <div className="text-[10px] text-muted-foreground mt-1 leading-tight">Estável. Cloud API Nuvens.</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Campos Condicionais Meta */}
                {provider === "META_OFFICIAL" && (
                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-mono uppercase tracking-tighter opacity-70 flex items-center gap-1.5">
                                    <Key className="w-3 h-3 text-blue-500" /> Access Token
                                </Label>
                                <Input
                                    type="password"
                                    value={metaToken}
                                    onChange={(e) => setMetaToken(e.target.value)}
                                    placeholder="EAAB..."
                                    className="bg-background/50 border-blue-500/20 text-xs"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-mono uppercase tracking-tighter opacity-70 flex items-center gap-1.5">
                                    <Smartphone className="w-3 h-3 text-blue-500" /> Phone Number ID
                                </Label>
                                <Input
                                    value={metaPhoneNumberId}
                                    onChange={(e) => setMetaPhoneNumberId(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Apenas números (Ex: 102938...)"
                                    className="bg-background/50 border-blue-500/20 text-xs"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-mono uppercase tracking-tighter opacity-70 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3 h-3 text-blue-500" /> WABA Business ID
                                </Label>
                                <Input
                                    value={metaWabaId}
                                    onChange={(e) => setMetaWabaId(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Apenas números (Ex: 987654...)"
                                    className="bg-background/50 border-blue-500/20 text-xs"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-mono uppercase tracking-tighter opacity-70 flex items-center gap-1.5">
                                    <Hash className="w-3 h-3 text-blue-500" /> Verify Token (Webhook)
                                </Label>
                                <Input
                                    value={metaVerifyToken}
                                    onChange={(e) => setMetaVerifyToken(e.target.value)}
                                    placeholder="meu_token_secreto"
                                    className="bg-background/50 border-blue-500/20 text-xs"
                                />
                            </div>
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 italic">
                            * Estes dados podem ser obtidos no Facebook Developers Portal.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-[10px] uppercase tracking-widest font-bold"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className={clsx(
                            "text-[10px] uppercase tracking-widest font-bold shadow-lg",
                            provider === "META_OFFICIAL" ? "bg-blue-600 hover:bg-blue-700" : "bg-foreground"
                        )}
                    >
                        {isLoading ? "Salvando..." : "Criar Aparelho"}
                    </Button>
                </div>
            </form>
        </StandardModal>
    );
}
