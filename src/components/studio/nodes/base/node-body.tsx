import { ReactNode } from "react";
import { clsx } from "clsx";
import { VariableHighlighter } from "./variable-highlighter";

interface NodeBodyProps {
    children: ReactNode;
    className?: string;
    noTextWrapper?: boolean;
}
export function NodeBody({ children, className, noTextWrapper }: NodeBodyProps) {
    const renderContent = () => {
        if (typeof children === "string") {
            return <VariableHighlighter text={children} />;
        }
        return children;
    };

    return (
        <div className={clsx("p-3 bg-card rounded-b-md w-full", className)}>
            {!noTextWrapper ? (
                <div className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words px-1 text-foreground/80">
                    {renderContent()}
                </div>
            ) : (
                renderContent()
            )}
        </div>
    );
}
