"use client"

import * as React from "react"
import { StandardModal } from "./standard-modal"
import { Button } from "./button"
import { AlertTriangle, Info, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "info" | "warning"
    isLoading?: boolean
    showCancel?: boolean
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "info",
    isLoading = false,
    showCancel = true
}: ConfirmationModalProps) {
    const Icon = variant === "danger" ? Trash2 : variant === "warning" ? AlertTriangle : Info
    const colors = {
        danger: "text-red-500 bg-red-500/10 border-red-500/20",
        warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    }

    return (
        <StandardModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            title={title}
            description="Ação Requer Confirmação"
        >
            <div className="flex flex-col items-center text-center gap-4 py-2">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border", colors[variant])}>
                    <Icon className="w-6 h-6" />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed px-2 whitespace-pre-line">
                    {description}
                </p>

                <div className={cn(
                    "grid gap-3 w-full mt-4",
                    showCancel ? "grid-cols-2" : "grid-cols-1"
                )}>
                    {showCancel && (
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-[10px] uppercase tracking-widest font-bold"
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        variant={variant === "danger" ? "destructive" : "default"}
                        onClick={async () => {
                            await onConfirm()
                            onClose()
                        }}
                        isLoading={isLoading}
                        className="text-[10px] uppercase tracking-widest font-bold"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </StandardModal>
    )
}
