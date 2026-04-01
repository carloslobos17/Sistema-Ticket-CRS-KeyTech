import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { User } from '@/types/user';
import { Department } from '@/types/department';
import { RoleName } from '@/types/role';

interface Props {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    departments: Department[];
    roles: RoleName[];
}

interface EditUserFormData {
    name: string;
    email: string;
    phone_number: string;
    ext: string | null;
    birthdate: string;
    department_id: number | null;
    role: RoleName | '';

    [key: string]: string | number | null;
}

function Field({
    label,
    error,
    optional,
    children,
}: {
    label: string;
    error?: string;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {label}
                {optional && (
                    <span className="ml-1.5 normal-case tracking-normal font-normal text-slate-400/60">
                        (opcional)
                    </span>
                )}
            </label>
            {children}
            {error && (
                <p className="text-xs text-rose-400 mt-0.5">{error}</p>
            )}
        </div>
    );
}

const inputClass =
    'w-full rounded-md bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100';

export default function EditUserModal({
    user,
    isOpen,
    onClose,
    departments,
    roles,
}: Props) {
    const { data, setData, patch, processing, errors, reset } =
        useForm<EditUserFormData>({
            name: '',
            email: '',
            phone_number: '',
            ext: null,
            birthdate: '',
            department_id: null,
            role: '',
        });

    /* Reset al cerrar */
    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen]);

    /* Cargar datos */
    useEffect(() => {
        if (user && isOpen) {
            setData({
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                ext: user.ext ?? null,
                birthdate: user.birthdate,
                department_id: user.department_id,
                role: (user.roles?.[0]?.name as RoleName) ?? '',
            });
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('users.update', user.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            
            {/* Modal */}
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">

                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-slate-100">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                            Gestión de usuarios
                        </p>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Editar usuario
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="px-7 py-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <Field label="Nombre" error={errors.name}>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass}
                                placeholder="Juan Pérez"
                            />
                        </Field>

                        <Field label="Correo electrónico" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={inputClass}
                                placeholder="correo@ejemplo.com"
                            />
                        </Field>

                        <Field label="Teléfono" error={errors.phone_number}>
                            <input
                                type="text"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className={inputClass}
                                placeholder="12345678"
                            />
                        </Field>

                        <Field label="Extensión" optional>
                            <input
                                type="text"
                                value={data.ext ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'ext',
                                        e.target.value.trim() === ''
                                            ? null
                                            : e.target.value
                                    )
                                }
                                className={inputClass}
                                placeholder="—"
                            />
                        </Field>

                        <Field label="Fecha de nacimiento" error={errors.birthdate}>
                            <input
                                type="date"
                                value={data.birthdate}
                                onChange={(e) => setData('birthdate', e.target.value)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Departamento" error={errors.department_id}>
                            <select
                                value={data.department_id ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'department_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    )
                                }
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

                        <Field label="Rol" error={errors.role}>
                            <select
                                value={data.role}
                                onChange={(e) =>
                                    setData('role', e.target.value as RoleName)
                                }
                                className={inputClass}
                            >
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
                    <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                        <p className="text-xs text-slate-400">
                            Edita la información del usuario
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 transition"
                            >
                                {processing ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}