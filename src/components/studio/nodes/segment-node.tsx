import { NodeProps, Node, NodeResizer } from "@xyflow/react";
import { TrackerNodeData, useFlowStore } from "@/store/flow-store";
import { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useInlineRename } from "@/hooks/use-inline-rename";

export function SegmentNode({ data, selected, id }: NodeProps<Node<TrackerNodeData>>) {
    const {
        isEditing,
        setIsEditing,
        tempLabel,
        setTempLabel,
        inputRef,
        handleSave,
        handleCancel
    } = useInlineRename({
        initialLabel: data.label || "",
        onSave: (newLabel) => useFlowStore.getState().updateNodeData(id, { label: newLabel })
    });

    const color = data.color || "#3b82f6";

    return (
        <>
            <NodeResizer
                minWidth={200}
                minHeight={150}
                isVisible={selected}
                lineClassName="border-blue-500"
                handleClassName="h-3 w-3 bg-white border-2 border-blue-500 rounded-full"
            />
            <div
                className="w-full h-full rounded-3xl border-2 border-dashed transition-all relative overflow-hidden backdrop-blur-[2px] shadow-2xl group"
                style={{
                    backgroundColor: `${color}05`,
                    borderColor: `${color}60`,
                }}
            >
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at top left, ${color}, transparent 70%)`
                    }}
                />

                <div
                    className="absolute top-6 left-8 flex flex-col gap-1.5 select-none"
                    style={{ color: color }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] font-mono opacity-40">
                            Logic Container
                        </span>
                    </div>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={tempLabel}
                            onChange={(e) => setTempLabel(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                            className="bg-background/20 border border-white/20 rounded px-2 py-1 text-2xl font-black uppercase tracking-tighter leading-none outline-none focus:ring-1 focus:ring-white/30 backdrop-blur-md w-full"
                            style={{ color: color }}
                        />
                    ) : (
                        <h2 
                            className="text-2xl font-black uppercase tracking-tighter leading-none filter drop-shadow-sm flex items-center gap-2 group/title cursor-text"
                            onClick={() => setIsEditing(true)}
                        >
                            {data.label || "Novo Segmento"}
                            <Edit2 className="w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-opacity" style={{ color: color }} />
                        </h2>
                    )}
                </div>

                <div
                    className="absolute bottom-4 right-6 opacity-20"
                    style={{ color: color }}
                >
                    <div className="flex flex-col items-end font-mono text-[8px] uppercase tracking-widest font-bold">
                        <span>Organization Block</span>
                        <span>Track Bot Studio v2.0</span>
                    </div>
                </div>
            </div>
        </>
    );
}
