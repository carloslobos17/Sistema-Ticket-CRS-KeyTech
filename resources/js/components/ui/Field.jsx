import React from 'react';
import PropTypes from 'prop-types';

export default function Field({ label, error, hint, optional, children }) {
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

            {hint && !error && (
                <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
            )}

            {error && (
                <p className="mt-0.5 text-xs text-rose-400">{error}</p>
            )}
        </div>
    );
}

Field.propTypes = {
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    hint: PropTypes.string,
    optional: PropTypes.bool,
    children: PropTypes.node.isRequired,
};