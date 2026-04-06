import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Planes SLA', href: '/sla-plans' },
    { title: 'Crear', href: '/sla-plans/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        grace_time_hours: '',
        working_hours: true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/sla-plans');
    }

    const isFormValid = data.name.trim() !== '' && data.grace_time_hours !== '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Plan SLA" />
            <div>
                <h1>Crear Plan SLA</h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Nombre del plan</label>
                        <input
                            type="text"
                            id="name"
                            maxLength={50}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="grace_time_hours">Tiempo de gracia (horas)</label>
                        <input
                            type="number"
                            id="grace_time_hours"
                            min={1}
                            step={1}
                            value={data.grace_time_hours}
                            onChange={(e) => setData('grace_time_hours', e.target.value)}
                            required
                        />
                        {errors.grace_time_hours && <p>{errors.grace_time_hours}</p>}
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={data.working_hours}
                                onChange={(e) => setData('working_hours', e.target.checked)}
                            />
                            Horario laboral
                        </label>
                    </div>

                    <div>
                        <button type="submit" disabled={!isFormValid || processing}>
                            {processing ? 'Guardando...' : 'Guardar'}
                        </button>
                        <Link href="/sla-plans">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}