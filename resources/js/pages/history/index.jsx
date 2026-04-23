import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { History, FileText, ArrowRight, Search } from "lucide-react";
import { GenericTable } from "@/components/GenericTable";

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Historial", href: "/history" },
];

export default function Index({ histories = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredHistory = histories.filter((h) =>
        `${h.ticket_id} ${h.internal_note || ""} ${h.action_type}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: "Ticket",
            render: (history) => (
                <Link 
                    href={`/tickets/${history.ticket_id}`} 
                    className="flex items-center gap-2 font-mono text-sm font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                    <FileText className="w-4 h-4 text-zinc-400" />
                    #{history.ticket_id}
                </Link>
            ),
        },
        {
            header: "Usuario",
            render: (history) => (
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {history.user?.name || 'Sistema'}
                </span>
            ),
        },
        {
            header: "Acción",
            render: (history) => (
                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full text-xs font-bold border border-zinc-200 dark:border-zinc-700">
                    {history.action_type}
                </span>
            ),
        },
        {
            header: "Nota Interna",
            render: (history) => (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate" title={history.internal_note}>
                    {history.internal_note || '-'}
                </p>
            ),
        },
        {
            header: "Movimiento",
            render: (history) => (
                <div className="flex items-center gap-2 text-xs">
                    {history.new_department ? (
                        <>
                            <span className="text-zinc-400 line-through">
                                {history.previous_department?.name || 'N/A'}
                            </span>
                            <ArrowRight className="w-3 h-3 text-zinc-400" />
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                {history.new_department?.name}
                            </span>
                        </>
                    ) : (
                        <span className="text-zinc-600 dark:text-zinc-400">
                            {history.previous_department?.name || '-'}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: "Fecha",
            className: "text-right",
            render: (history) => (
                <span className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
                    {new Date(history.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial del Sistema" />

            <div className="p-4 md:p-8 space-y-6">
                {/* Cabecera Estilo "Mis Tickets" */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                Historial de Actividad
                            </h1>
                            <p className="text-zinc-500 text-sm">
                                Registro de todos los cambios y movimientos de los tickets.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                            <Input
                                type="text"
                                placeholder="Buscar en el historial..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-full sm:w-[300px] bg-white dark:bg-zinc-950"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla Genérica */}
                <GenericTable 
                    data={filteredHistory} 
                    columns={columns} 
                    emptyMessage="No hay registros en el historial todavía."
                />
            </div>
        </AppLayout>
    );
}