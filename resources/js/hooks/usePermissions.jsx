import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { auth } = usePage().props;

    const hasPermission = (permission) => {
        return auth?.permissions?.includes(permission) ?? false;
    };

    const hasRole = (role) => {
        return auth?.roles?.includes(role) ?? false;
    };

    return { hasPermission, hasRole, authUser: auth?.user };
}
