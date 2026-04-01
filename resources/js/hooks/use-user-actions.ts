import { User, UserFormData, RoleName } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';


export function useUserActions(user?: User) {
    const form = useForm<UserFormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        phone_number: user?.phone_number ?? '',
        ext: user?.ext ?? null,
        birthdate: user?.birthdate ?? '',
        department_id: user?.department_id ?? null,
        role: (user?.roles?.[0]?.name as RoleName) ?? '',
    });

    const store = (e: FormEvent) => {
        e.preventDefault();

        form.post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset('password'),
        });
    };

    const update = (e: FormEvent) => {
        e.preventDefault();

        if (!user?.id) return;

        form.put(route('users.update', user.id), {
            preserveScroll: true,
            onSuccess: () => form.reset('password'),
        });
    };

    const destroy = (id: number) => {
        if (!confirm('¿Eliminar usuario?')) return;

        router.delete(route('users.destroy', id), {
            preserveScroll: true,
        });
    };

    return {
        form,
        store,
        update,
        destroy,
    };
}
