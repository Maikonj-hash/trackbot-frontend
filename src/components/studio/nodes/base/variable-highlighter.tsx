import { clsx } from "clsx";

interface VariableHighlighterProps {
    text: string;
}

export function VariableHighlighter({ text }: VariableHighlighterProps) {
    if (!text) return null;

    const parts = text.split(/(\{\{[^}]+\}\})/g);

    return (
        <>
            {parts.map((part: any, i: number) => {
                const isVariable = part.startsWith("{{") && part.endsWith("}}");

                if (isVariable) {
                    return (
                        <span
                            key={i}
                            className={clsx(
                                "inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded text-[10px] font-mono font-bold transition-all",
                                "bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)]",
                                "hover:bg-blue-500/20 hover:border-blue-500/40 cursor-default"
                            )}
                        >
                            {part}
                        </span>
                    );
                }

                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
