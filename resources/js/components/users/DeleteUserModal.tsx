import { useUserActions } from '@/hooks/use-user-actions';
import type { DeleteUserModalProps } from '@/types/user-modal';

export default function DeleteUserModal({ user, isOpen, onClose }: DeleteUserModalProps) {
    const { destroy, isDeleting } = useUserActions();

    if (!isOpen || !user) return null;

    const handleDelete = () => {
        destroy(user.id, () => {
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900">Confirmar eliminación</h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                    ¿Estás seguro de que deseas eliminar a <span className="font-semibold text-gray-900">{user.name}</span>?
                </p>

                <p className="mt-2 text-xs text-red-600">Esta acción es destructiva.</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
