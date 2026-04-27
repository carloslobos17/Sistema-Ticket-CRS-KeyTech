import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Eye, Loader2 } from 'lucide-react';
import { route } from 'ziggy-js';


export default function Unassigned({ tickets, departments, divisions, helpTopics, slaPlans, priorities, tecnicos }) {
    const [open, setOpen] = useState(false);
    const [dept, setDept] = useState("");
    const [div, setDiv] = useState("");

    const { data, setData, put, processing, errors } = useForm({
        id: "",
        department_id: "",
        help_topic_id: "",
        sla_plan_id: "",
        priority_id: "",
        assigned_user: "",
    });

    const filteredDivisions = dept
        ? divisions.filter((d) => parseInt(d.department_id) === parseInt(dept))
        : divisions;

    const filteredTopics = div
        ? helpTopics.filter((t) => parseInt(t.division_id) === parseInt(div))
        : helpTopics;

    const openModal = (ticket) => {

        const divisionId = ticket.help_topic?.division_id?.toString() ?? "";

        setDept(ticket.department_id?.toString() ?? "");
        setDiv(divisionId);

        setData({
            id: ticket.id,
            _code: ticket.code,
            _subject: ticket.subject,
            _message: ticket.message,
            _email: ticket.email,
            _institution_code: ticket.requesting_user?.institution_code ?? "",
            _requesting_user: ticket.requesting_user?.name ?? "",
            _creation_date: ticket.creation_date,
            department_id: ticket.department_id?.toString() ?? "",
            division_id: divisionId,
            help_topic_id: ticket.help_topic_id?.toString() ?? "",
            sla_plan_id: ticket.sla_plan_id?.toString() ?? "",
            priority_id: ticket.priority_id?.toString() ?? "",
            assigned_user: ticket.assigned_user?.toString() ?? "",
        });
        setOpen(true);
    };

    const handleDeptChange = (val) => {
        setDept(val);
        setDiv("");
        setData("department_id", val);
        setData("division_id", "");
        setData("help_topic_id", "");
    };

    const handleDivChange = (val) => {
        setDiv(val);
        setData("help_topic_id", "");
    };

    const submit = () => {
        put(route("tickets.update", { ticket: data.id }), {
            onSuccess: () => setOpen(false),
        });
    };

    if (tickets.length === 0) {
        return (
            <AppLayout>
                <Head title="Tickets pendientes" />
                <div className="text-center py-12">
                    <p className="text-gray-500">No hay tickets pendientes de asignación en tu departamento.</p>
                </div>
            </AppLayout>
        );
    }
    return (
        <AppLayout>
            <Head title="Tickets pendientes" />
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Tickets pendientes de asignación</h1>
                </div>
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asunto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de creacion</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.code}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{ticket.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.requesting_user?.name || ticket.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.creation_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={() => openModal(ticket)}
                                            >
                                                Ver detalles
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    key={data.id}
                    className="max-w-2xl max-h-[90vh] overflow-y-auto"
                    onOpenAutoFocus={(e) => e.preventDefault()}  >
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Asignar Ticket</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
                            <h3 className="text-sm font-semibold text-zinc-500 uppercase">Información del Ticket</h3>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">Código</Label>
                                <Input value={data._code ?? ""} disabled className="bg-white dark:bg-zinc-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500">Codigo Institucional</Label>
                                    <Input value={data._institution_code ?? ""} disabled className="bg-white dark:bg-zinc-800" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500">Solicitante</Label>
                                    <Input value={data._requesting_user ?? ""} disabled className="bg-white dark:bg-zinc-800" />
                                </div>
                            </div>


                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">Asunto</Label>
                                <Input value={data._subject ?? ""} disabled className="bg-white dark:bg-zinc-800" />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">Mensaje</Label>
                                <Textarea value={data._message ?? ""} disabled rows={3} className="bg-white dark:bg-zinc-800" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500">Correo</Label>
                                    <Input value={data._email ?? ""} disabled className="bg-white dark:bg-zinc-800" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-zinc-500">Fecha de creación</Label>
                                    <Input value={data._creation_date ?? ""} disabled className="bg-white dark:bg-zinc-800" />
                                </div>
                            </div>
                        </div>
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-4">
                            <h3 className="text-sm font-semibold text-zinc-500 uppercase">Verificación</h3>
                            <div className='flex gap-4 '>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e01b24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                <p className='text-red-700'>Por favor verifique que los datos sean correctos</p>
                            </div>
                            {/* Departamento */}
                            <div className="space-y-1">
                                <Label>Departamento</Label>
                                <Select value={dept} onValueChange={handleDeptChange}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map(d => (
                                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <p className="text-xs text-red-500">{errors.department_id}</p>}
                            </div>
                            {/* División */}
                            <div className="space-y-1">
                                <Label>División</Label>
                                <Select value={div} onValueChange={handleDivChange} disabled={!dept}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {filteredDivisions.map(d => (
                                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.division_id && <p className="text-xs text-red-500">{errors.division_id}</p>}
                            </div>
                            {/* Tema de ayuda */}
                            <div className="space-y-1">
                                <Label>Tema de ayuda</Label>
                                <Select value={data.help_topic_id} onValueChange={val => setData("help_topic_id", val)}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {filteredTopics.map(t => (
                                            <SelectItem key={t.id} value={t.id.toString()}>{t.name_topic}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.help_topic_id && <p className="text-xs text-red-500">{errors.help_topic_id}</p>}
                            </div>
                        </div>
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-4">
                            <h3 className="text-sm font-semibold text-zinc-500 uppercase">Asignación</h3>
                            {/* Prioridad */}
                            <div className="space-y-1">
                                <Label>Prioridad</Label>
                                <Select value={data.priority_id} onValueChange={val => setData("priority_id", val)}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {priorities.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.priority_id && <p className="text-xs text-red-500">{errors.priority_id}</p>}
                            </div>
                            {/* SLA Plan */}
                            <div className="space-y-1">
                                <Label>Plan SLA</Label>
                                <Select value={data.sla_plan_id} onValueChange={val => setData("sla_plan_id", val)}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {slaPlans.map(s => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sla_plan_id && <p className="text-xs text-red-500">{errors.sla_plan_id}</p>}
                            </div>
                            {/* Técnico */}
                            <div className="space-y-1">
                                <Label>Técnico asignado</Label>
                                <Select value={data.assigned_user} onValueChange={val => setData("assigned_user", val)}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {tecnicos.map(t => (
                                            <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.assigned_user && <p className="text-xs text-red-500">{errors.assigned_user}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={submit} disabled={processing} className="bg-red-600 hover:bg-red-700">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Asignar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
