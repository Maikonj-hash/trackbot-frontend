import { NodeProps, Node, NodeResizer } from "@xyflow/react";
import { TrackerNodeData } from "@/store/flow-store";

export function SegmentNode({ data, selected, id }: NodeProps<Node<TrackerNodeData>>) {
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
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none filter drop-shadow-sm">
                        {data.label || "Novo Segmento"}
                    </h2>
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
