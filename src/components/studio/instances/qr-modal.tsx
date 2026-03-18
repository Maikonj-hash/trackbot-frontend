"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import { io, Socket } from "socket.io-client";
import { X, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { API_URL } from "@/lib/constants";
import { clsx } from "clsx";

import { StandardModal } from "@/components/ui/standard-modal";

interface QRModalProps {
    instanceId: string;
    instanceName: string;
    isOpen: boolean;
    onClose: () => void;
}

import { api } from "@/lib/api-client";

export function QRModal({ instanceId, instanceName, isOpen, onClose }: QRModalProps) {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("INITIALIZING");
    const [socket, setSocket] = useState<Socket | null>(null);
    const connectionRequested = useRef<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setQrCode(null);
            setStatus("INITIALIZING");
            connectionRequested.current = null;
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const wsUrl = API_URL.replace(/\/$/, "");
        const newSocket = io(wsUrl);

        if (connectionRequested.current !== instanceId) {
            console.log(`[QR_MODAL] Solicitando conexão para ${instanceId}`);
            connectionRequested.current = instanceId;
            api.post(`/instances/${instanceId}/connect`)
                .catch(err => {
                    console.error("Erro ao solicitar novo QR:", err);
                    connectionRequested.current = null;
                });
        }

        newSocket.on("connect", () => {
            console.log("Connected to WebSocket");
            setStatus("WAITING_FOR_QR");
        });

        newSocket.on("qr_code", (data) => {
            if (data.instanceId === instanceId) {
                setQrCode(data.qrCode);
                setStatus("QR_READY");
            }
        });

        newSocket.on("session_status", (data) => {
            if (data.instanceId === instanceId) {
                console.log(`[QR_MODAL] Novo status: ${data.status}`);
                setStatus(data.status);

                if (data.status !== "QR_READY") {
                    setQrCode(null);
                }

                if (data.status === "CONNECTED") {
                    setStatus("CONNECTED");
                    setTimeout(() => onClose(), 2500);
                }
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isOpen, instanceId, onClose]);

    return (
        <StandardModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            title="Pareamento de Aparelho"
            description={instanceName}
        >
            <div className="flex flex-col items-center text-center gap-6">
                <div className="relative w-56 h-56 bg-white p-4 rounded-md shadow-inner flex items-center justify-center">
                    {status === "CONNECTED" ? (
                        <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-500">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1 items-center">
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Sincronizado!</span>
                                <span className="text-[10px] text-emerald-600/60 font-medium">Ativando sua instância agora...</span>
                            </div>
                        </div>
                    ) : status === "CONNECTING" ? (
                        <div className="flex flex-col items-center gap-4 animate-pulse">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                            <span className="text-[10px] font-mono text-amber-600 uppercase font-bold tracking-tight">
                                Pareando aparelho...
                            </span>
                        </div>
                    ) : (qrCode || status === "QR_READY") ? (
                        <div className="relative">
                            <QRCode
                                value={qrCode || ""}
                                size={200}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                            <div className="absolute top-4 left-4 right-4 h-[1px] bg-blue-500/30 animate-scan pointer-events-none" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="text-[10px] font-mono text-muted-foreground uppercase animate-pulse">
                                Inicializando conexão...
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <div className={clsx(
                        "py-2 px-4 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2",
                        status === "CONNECTED" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                            status === "CONNECTING" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                status === "QR_READY" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                    "bg-muted border-border/50 text-muted-foreground"
                    )}>
                        <div className={clsx(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            status === "CONNECTED" ? "bg-emerald-500" :
                                status === "CONNECTING" ? "bg-amber-500" : "bg-blue-500"
                        )} />
                        STATUS: {status.replace("_", " ")}
                    </div>

                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed px-4">
                        Abra o WhatsApp {">"} Aparelhos Conectados {">"} Conectar um Aparelho para escanear.
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 16px; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 208px; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
            `}</style>
        </StandardModal>
    );
}
