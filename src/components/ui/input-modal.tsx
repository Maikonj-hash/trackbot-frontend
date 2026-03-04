"use client"

import * as React from "react"
import { StandardModal } from "./standard-modal"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

interface InputModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (value: string) => void | Promise<void>
    title: string
    description?: string
    label: string
    placeholder?: string
    defaultValue?: string
    confirmText?: string
    isLoading?: boolean
}

export function InputModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    label,
    placeholder,
    defaultValue = "",
    confirmText = "Salvar",
    isLoading = false
}: InputModalProps) {
    const [value, setValue] = React.useState(defaultValue)

    React.useEffect(() => {
        if (isOpen) setValue(defaultValue)
    }, [isOpen, defaultValue])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!value.trim()) return
        await onSubmit(value)
        onClose()
    }

    return (
        <StandardModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            title={title}
            description={description}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                        {label}
                    </Label>
                    <Input
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className="bg-muted/30 border-border/50 text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
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
                        disabled={isLoading || !value.trim()}
                        className="text-[10px] uppercase tracking-widest font-bold"
                    >
                        {isLoading ? "Salvando..." : confirmText}
                    </Button>
                </div>
            </form>
        </StandardModal>
    )
}
