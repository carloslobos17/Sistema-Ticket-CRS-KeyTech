import Field from '@/components/ui/Field';
import { useUserActions } from '@/hooks/use-user-actions';
import type { RoleName } from '@/types/role';
import type { UserFormData } from '@/types/user';
import type { UserModalBaseProps } from '@/types/user-modal';
import { createUserSchema } from '@/validations/user.schema';
import { useState, type FormEvent } from 'react';

// ─── Constantes ──────────────────────────────────────────────────────────────

const inputClass =
    'w-full rounded-md bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100';

// ─── Componente ──────────────────────────────────────────────────────────────

export default function CreateUserModal({ isOpen, onClose, departments, roles }: UserModalBaseProps) {
    const { form, store } = useUserActions();
    const { data, setData, processing, errors, reset, clearErrors } = form;

    const [formError, setFormError] = useState<string | null>(null);
    const [customErrors, setCustomErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

    const validateWithZod = (): boolean => {
        const result = createUserSchema.safeParse(data);

        if (result.success) {
            setCustomErrors({});
            setFormError(null);
            return true;
        }

        const fieldErrors: Partial<Record<keyof UserFormData, string>> = {};
        result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof UserFormData;
            if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        });

        setCustomErrors(fieldErrors);
        setFormError('Corrige los errores del formulario.');
        return false;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!validateWithZod()) return;

        store(e, () => {
            setCustomErrors({});
            setFormError(null);
            onClose();
        });

        if (Object.keys(errors).length > 0) {
            setFormError('Ocurrió un error al guardar. Verifica los campos.');
        }
    };

    const handleClose = () => {
        reset();
        clearErrors();
        setCustomErrors({});
        setFormError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-7 pt-6 pb-5">
                    <div>
                        <p className="mb-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Gestión de usuarios</p>
                        <h2 className="text-lg font-semibold text-slate-800">Nuevo usuario</h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-7 py-6">
                    {formError && (
                        <div className="mb-5 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3">
                            <p className="text-sm text-rose-600">{formError}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Nombre" error={customErrors.name ?? errors.name}>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} />
                        </Field>

                        <Field label="Correo electrónico" error={customErrors.email ?? errors.email}>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
                        </Field>

                        <Field label="Contraseña" error={customErrors.password ?? errors.password}>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={inputClass}
                                autoComplete="new-password"
                            />
                        </Field>

                        <Field label="Teléfono" error={customErrors.phone_number ?? errors.phone_number}>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className={inputClass}
                                maxLength={8}
                            />
                        </Field>

                        <Field label="Fecha de nacimiento" error={customErrors.birthdate ?? errors.birthdate}>
                            <input type="date" value={data.birthdate} onChange={(e) => setData('birthdate', e.target.value)} className={inputClass} />
                        </Field>

                        <Field label="Extensión" optional>
                            <input
                                type="text"
                                value={data.ext ?? ''}
                                onChange={(e) => setData('ext', e.target.value.trim() === '' ? null : Number(e.target.value))}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Departamento" error={customErrors.department_id ?? errors.department_id}>
                            <select
                                value={data.department_id ?? ''}
                                onChange={(e) => setData('department_id', e.target.value ? Number(e.target.value) : null)}
                                className={inputClass}
                            >
                                <option value="">Selecciona un departamento</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Rol" error={customErrors.role ?? errors.role}>
                            <select value={data.role} onChange={(e) => setData('role', e.target.value as RoleName)} className={inputClass}>
                                <option value="">Selecciona un rol</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {/* Footer */}
                    <div className="mt-7 flex justify-end gap-2 border-t border-slate-100 pt-5">
                        <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-slate-800 px-5 py-2 text-sm text-white disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Guardar usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
