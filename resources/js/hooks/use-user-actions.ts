import type { RoleName } from '@/types/role';
import type { UpdateUserFormData, User, UserFormData } from '@/types/user';
import { router, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

// ─── Tipos de retorno ────────────────────────────────────────────────────────

interface UseUserActionsReturn {
    form: ReturnType<typeof useForm<UserFormData>>;
    store: (e: FormEvent, onSuccess?: () => void) => void;
    update: (e: FormEvent, userId: number, onSuccess?: () => void) => void;
    destroy: (userId: number, onSuccess?: () => void) => void;
    isDeleting: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useUserActions(user?: User | null): UseUserActionsReturn {
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<UserFormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '', // Vacío en edición = no cambia
        phone_number: user?.phone_number ?? '',
        ext: user?.ext ?? null,
        birthdate: user?.birthdate ?? '',
        department_id: user?.department_id ?? null,
        role: (user?.roles?.[0]?.name as RoleName) ?? '',
    });

    /**
     * Crea un nuevo usuario (POST /users)
     */
    const store = (e: FormEvent, onSuccess?: () => void) => {
        e.preventDefault();

        form.post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        });
    };

    /**
     * Actualiza un usuario existente (PATCH /users/:id)
     * Si password viene vacío, el backend lo ignora.
     */
    const update = (e: FormEvent, userId: number, onSuccess?: () => void) => {
        e.preventDefault();

        form.patch(route('users.update', userId), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        });
    };

    /**
     * Elimina un usuario (DELETE /users/:id)
     */
    const destroy = (userId: number, onSuccess?: () => void) => {
        setIsDeleting(true);

        router.delete(route('users.destroy', userId), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess?.();
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return { form, store, update, destroy, isDeleting };
}

// ─── Helper: construir UpdateUserFormData desde un User ──────────────────────
// Mapea un User del servidor al shape del formulario de edición.
// password siempre inicia vacío — el usuario lo rellena solo si quiere cambiarlo.

export function buildUpdateFormData(user: User): UpdateUserFormData {
    return {
        name: user.name ?? '',
        email: user.email ?? '',
        password: '', // Intencional: vacío = sin cambio
        phone_number: user.phone_number ?? '',
        ext: user.ext ?? null,
        birthdate: user.birthdate ?? '',
        department_id: user.department_id ?? null,
        role: (user.roles?.[0]?.name as RoleName) ?? '',
    };
}
