import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAreaActions } from '@/hooks/use-area-actions';

export default function Create() {
    const { form, store } = useAreaActions();

    return (
        <AppLayout>
            <Toaster richColors position="top-right" />
            <Head title="Nueva Área" />
            <form
                onSubmit={store}
                className="flex-1 flex flex-col w-full p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
                {/* Header Interno */}
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <Link href={route('areas.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Nueva Área</h2>
                </div>

                <div className="flex-1 p-8 ml-4">
                    <div className="max-w-xl space-y-10">

                        {/* Campo: Nombre */}
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-s font-bold text-zinc-500">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                placeholder="Ej: Soporte Técnico, Recursos Humanos..."
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="h-12 border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 rounded-xl focus-visible:ring-zinc-500"
                            />
                            {form.errors.name && (
                                <p className="text-red-500 text-xs font-medium">{form.errors.name}</p>
                            )}
                        </div>

                        {/* Campo: Descripción */}
                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-s font-bold text-zinc-500">
                                Descripción
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe brevemente el área..."
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="min-h-[120px] border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 rounded-xl focus-visible:ring-zinc-500"
                            />
                            {form.errors.description && (
                                <p className="text-red-500 text-xs font-medium">{form.errors.description}</p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                    <div className="flex items-center justify-end gap-4">
                        <Button variant="ghost" asChild className="text-zinc-500">
                            <Link href={route('areas.index')}>Cancelar</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-11 px-8 bg-zinc-900 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-zinc-900/10"
                        >
                            {form.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear Área'}
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}