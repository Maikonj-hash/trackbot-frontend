"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface StandardModalProps {
    isOpen: boolean
    onClose: () => void
    title?: React.ReactNode
    description?: React.ReactNode
    children: React.ReactNode
    footer?: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl" | "full"
    showCloseButton?: boolean
    className?: string
}

const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    full: "sm:max-w-[95vw] h-[90vh]",
}

export function StandardModal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
    showCloseButton = true,
    className
}: StandardModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={cn(
                    "bg-card border-border/50 shadow-2xl p-0 overflow-hidden font-sans backdrop-blur-md",
                    sizeClasses[size],
                    className
                )}
                showCloseButton={showCloseButton}
            >
                {/* HUD Accent Line - Top Gradient */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="p-6 md:p-8 flex flex-col gap-6 relative">
                    {/* Header Section */}
                    <div className={cn("flex items-center gap-4", (!title && !description) && "sr-only")}>
                        <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full flex-shrink-0" />
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <DialogTitle className="text-base font-bold tracking-tight text-foreground line-clamp-1 uppercase">
                                {title || "MODAL_WINDOW"}
                            </DialogTitle>
                            {description && (
                                <DialogDescription className="text-[10px] font-mono text-muted-foreground uppercase opacity-60 leading-relaxed truncate">
                                    {description}
                                </DialogDescription>
                            )}
                        </div>
                    </div>

                    {/* Children Slot */}
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>

                    {/* Footer Section */}
                    {footer && (
                        <DialogFooter className="mt-2 border-t border-border/10 pt-6 flex flex-col sm:flex-row gap-3">
                            {footer}
                        </DialogFooter>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
