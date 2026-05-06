import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function useAreaActions(area = null) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm({
        name: area?.name ?? '',
        description: area?.description ?? '',
    });

    // 1. LÓGICA PARA GUARDAR (POST)
    const store = (e) => {
        if (e) e.preventDefault();

        form.post(route('areas.store'), {
            onSuccess: () => {
                closeModal();
                toast.success('Área creada con éxito');
            },
            onError: () => {
                toast.error('Hubo un problema', {
                    description: 'Por favor revisa los campos marcados en rojo.',
                });
            },
        });
    };

    // 2. LÓGICA PARA ACTUALIZAR (PUT/PATCH)
    const update = (e, areaId) => {
        if (e) e.preventDefault();

        form.patch(route('areas.update', areaId), {
            onSuccess: () => {
                closeModal();
                toast.success('Área actualizada con éxito');
            },
            onError: () => {
                toast.error('Hubo un problema', {
                    description: 'Por favor revisa los campos marcados en rojo.',
                });
            },
        });
    };

    // 3. LÓGICA PARA ELIMINAR (DELETE)
    const destroy = (areaId) => {
        form.delete(route('areas.destroy', areaId), {
            onSuccess: () => toast.success('Área eliminada'),
            onError: (err) => toast.error(err.message || 'Error al eliminar'),
        });
    };

    const openModal = (targetArea = null, setEditingArea) => {
        setEditingArea(targetArea);
        if (targetArea) {
            form.setData({
                name: targetArea.name,
                description: targetArea.description ?? '',
            });
        } else {
            form.reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        form.reset();
        form.clearErrors();
    };

    return {
        form,
        store,
        update,
        destroy,
        isModalOpen,
        openModal,
        closeModal,
    };
}
