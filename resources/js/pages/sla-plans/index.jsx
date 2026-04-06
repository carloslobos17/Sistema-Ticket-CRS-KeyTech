import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Planes SLA', href: '/sla-plans' },
];

export default function Index({ planes }) {
    const { flash } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes SLA" />
            <div>
                <h1>Planes SLA</h1>

                <Link href="/sla-plans/create">Crear nuevo Plan SLA</Link>

                {flash?.success && <div>{flash.success}</div>}
                {flash?.error && <div>{flash.error}</div>}

                {planes.length === 0 ? (
                    <p>No hay planes SLA registrados.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tiempo de gracia (horas)</th>
                                <th>Horario laboral</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planes.map((plan) => (
                                <tr key={plan.id}>
                                    <td>{plan.name}</td>
                                    <td>{plan.grace_time_hours}</td>
                                    <td>{plan.working_hours ? 'Sí' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AppLayout>
    );
}