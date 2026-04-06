import { type ReactNode } from 'react';

// ─── Props ───────────────────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    error?: string;
    hint?: string;
    optional?: boolean;
    children: ReactNode;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Field({ label, error, hint, optional, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                {label}
                {optional && (
                    <span className="ml-1.5 font-normal tracking-normal text-slate-400/60 normal-case">
                        (opcional)
                    </span>
                )}
            </label>

            {children}

            {/* hint solo visible cuando no hay error */}
            {hint && !error && (
                <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
            )}

            {error && (
                <p className="mt-0.5 text-xs text-rose-400">{error}</p>
            )}
        </div>
    );
}
