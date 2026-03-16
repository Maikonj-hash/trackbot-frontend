import { useState, useRef, useEffect } from "react";

interface useInlineRenameProps {
    initialLabel: string;
    onSave: (newLabel: string) => void;
}

export function useInlineRename({ initialLabel, onSave }: useInlineRenameProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempLabel, setTempLabel] = useState(initialLabel);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    useEffect(() => {
        setTempLabel(initialLabel);
    }, [initialLabel]);

    const handleSave = () => {
        if (tempLabel.trim() && tempLabel !== initialLabel) {
            onSave(tempLabel.trim());
        } else {
            setTempLabel(initialLabel);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempLabel(initialLabel);
        setIsEditing(false);
    };

    return {
        isEditing,
        setIsEditing,
        tempLabel,
        setTempLabel,
        inputRef,
        handleSave,
        handleCancel
    };
}
