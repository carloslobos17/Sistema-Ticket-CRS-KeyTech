import { GenericTable } from '@/components/GenericTable';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Areas({ areas = [] }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const columns = [
        {
            header: 'ID',
            render: (area) => (
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {area.id}
                </span>
            ),
        },
        {
            header: 'Nombre',
            render: (area) => (
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {area.name}
                </span>
            ),
        },
        {
            header: 'Descripción',
            render: (area) => (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {area.description ?? 'Sin descripción'}
                </span>
            ),
        },
        {
            header: 'Acciones',
            render: () => (
                <span className="text-sm text-zinc-400">
                    —
                </span>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Áreas" />
            <Toaster position="top-right" richColors />

            <div className="space-y-6 p-4 md:p-8">
                
                {/* HEADER CON BOTÓN */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                            Áreas
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Lista de áreas registradas en el sistema.
                        </p>
                    </div>

                    {/* boton */}
                    <Button asChild className="bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900">
                        <Link href={route('areas.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo
                        </Link>
                    </Button>
                </div>

                <GenericTable data={areas} columns={columns} />
            </div>
        </AppLayout>
    );
}