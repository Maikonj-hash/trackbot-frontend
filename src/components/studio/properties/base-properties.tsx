import { ReactNode } from "react";
import { clsx } from "clsx";

interface BaseProps {
    children: ReactNode;
    className?: string;
}

export function PropertySection({ children, className, title }: BaseProps & { title?: string }) {
    return (
        <div className={clsx("space-y-3 pt-4 border-t border-border/40 first:pt-0 first:border-0", className)}>
            {title && <PropertyLabel>{title}</PropertyLabel>}
            {children}
        </div>
    );
}

export function PropertyLabel({ children, className }: BaseProps) {
    return (
        <label className={clsx(
            "text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70 font-mono",
            className
        )}>
            {children}
        </label>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    isTextArea?: boolean;
}

export function PropertyInput({ isTextArea, className, ...props }: InputProps) {
    const Component = isTextArea ? "textarea" : "input";
    return (
        <Component
            {...(props as any)}
            className={clsx(
                "w-full bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-xs transition-all",
                "focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50",
                "placeholder:text-muted-foreground/30 font-medium",
                isTextArea && "min-h-[80px] resize-none",
                className
            )}
        />
    );
}

interface ToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function PropertyToggle({ label, description, checked, onChange }: ToggleProps) {
    return (
        <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 group-hover:text-foreground transition-colors font-mono">
                    {label}
                </span>
                <div 
                    onClick={() => onChange(!checked)}
                    className={clsx(
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors border",
                        checked ? "bg-blue-600 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.2)]" : "bg-muted/50 border-border/50"
                    )}
                >
                    <span
                        className={clsx(
                            "inline-block h-3.5 w-3.5 transform rounded-full transition-transform duration-200 ease-in-out shadow-sm",
                            checked ? "translate-x-4.5 bg-white" : "translate-x-1 bg-muted-foreground/50"
                        )}
                    />
                </div>
            </label>
            {description && (
                <p className="text-[9px] font-mono leading-relaxed text-muted-foreground/50 uppercase tracking-tight">
                    {description}
                </p>
            )}
        </div>
    );
}

export function PropertyHint({ children }: BaseProps) {
    return (
        <p className="text-[9px] font-mono leading-relaxed text-muted-foreground/50 uppercase tracking-tight">
            {children}
        </p>
    );
}
