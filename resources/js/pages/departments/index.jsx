import DeleteEntityModal from '@/components/DeleteEntityModal';
import DepartmentTableActions from '@/components/departments/DepartmentTableActions';
import { GenericTable } from '@/components/GenericTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Trash2, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function Departments({ departments = [] }) {
    const { flash } = usePage().props;
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const columns = [
        {
            header: 'ID',
            className: '!text-left w-16',
            render: (dept) => (
                <div className="w-full text-left">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{dept.id}</span>
                </div>
            ),
        },
        {
            header: 'Departamento',
            className: '!text-left w-1/4', // Le damos un buen ancho
            render: (dept) => (
                <div className="w-full text-left">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">{dept.name}</span>
                </div>
            ),
        },
        {
            header: 'Área',
            className: '!text-left',
            render: (dept) => (
                <div className="w-full text-left">
                    <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                        {dept.area?.name || 'No asignada'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Responsables (Heads)',
            className: '!text-left w-1/4',
            render: (dept) => (
                <div className="flex w-full flex-wrap justify-start gap-1">
                    {dept.heads?.length > 0 ? (
                        dept.heads.map((head) => (
                            <span
                                key={head.id}
                                className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                            >
                                <UserCheck size={10} className="text-zinc-500" /> {head.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm italic text-zinc-400">Sin asignar</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Correo',
            className: '!text-left',
            render: (dept) => (
                <div className="w-full text-left">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{dept.email_department}</span>
                </div>
            ),
        },
        {
            header: 'Acciones',
            className: '!text-right w-24',
            render: (dept) => (
                <div className="flex w-full justify-end">
                    <DepartmentTableActions
                        department={dept}
                        onDelete={(d) => {
                            setSelectedDepartment(d);
                            setIsDeleteOpen(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Departamentos" />
            <Toaster position="top-right" richColors />

            <div className="space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Departamentos</h1>
                        <p className="text-sm text-zinc-500">Gestión de departamentos y asignación de jefaturas.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild className="bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900">
                            <Link href={route('departments.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo
                            </Link>
                        </Button>

                        <Button variant="outline" asChild className="border-zinc-200 dark:border-zinc-800">
                            <Link href={route('departments.trashed')}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Ver Borrados
                            </Link>
                        </Button>
                    </div>
                </div>

                <GenericTable data={departments} columns={columns} />
            </div>

            <DeleteEntityModal
                isOpen={isDeleteOpen}
                entity={selectedDepartment}
                entityType="Departamento"
                deleteEndpoint={route('departments.index')}
                closeModal={() => {
                    setIsDeleteOpen(false);
                    setSelectedDepartment(null);
                }}
            />
        </AppLayout>
    );
}
