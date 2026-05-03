import React, { useState } from 'react';
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// Añadimos MessageSquare a los iconos
import { ArrowLeft, User, Clock, Tag, Briefcase, FileText, Loader2, CheckCircle, RefreshCcw, MessageSquare } from 'lucide-react';
import { route } from 'ziggy-js';

export default function ShowAsignador({ ticket, departments, divisions, helpTopics, slaPlans, priorities, tecnicos }) {
    // ESTADOS PARA LOS MODALES
    const [openReasignar, setOpenReasignar] = useState(false);
    const [openCerrar, setOpenCerrar] = useState(false);

    // ==========================================
    // LÓGICA PARA REASIGNAR TICKET
    // ==========================================
    const [dept, setDept] = useState(ticket.department_id?.toString() ?? "");
    const [div, setDiv] = useState(ticket.help_topic?.division_id?.toString() ?? "");

    const { data: assignData, setData: setAssignData, put: putAssign, processing: processingAssign, errors: assignErrors } = useForm({
        id: ticket.id,
        department_id: ticket.department_id?.toString() ?? "",
        division_id: ticket.help_topic?.division_id?.toString() ?? "",
        help_topic_id: ticket.help_topic_id?.toString() ?? "",
        sla_plan_id: ticket.sla_plan_id?.toString() ?? "",
        priority_id: ticket.priority_id?.toString() ?? "",
        assigned_user: ticket.assigned_user?.toString() ?? "",
    });

    const filteredDivisions = dept ? divisions.filter((d) => parseInt(d.department_id) === parseInt(dept)) : divisions;
    const filteredTopics = div ? helpTopics.filter((t) => parseInt(t.division_id) === parseInt(div)) : helpTopics;

    const submitReasignar = () => {
        putAssign(route("tickets.update", { ticket: ticket.id }), {
            onSuccess: () => setOpenReasignar(false),
        });
    };

    // ==========================================
    // LÓGICA PARA CERRAR TICKET CON NOTA
    // ==========================================
    const { data: closeData, setData: setCloseData, post: postClose, processing: processingClose, errors: closeErrors } = useForm({
        internal_note: '',
    });

    const submitCerrar = (e) => {
        e.preventDefault();
        postClose(route('tickets.adminClose', ticket.id), {
            onSuccess: () => setOpenCerrar(false),
        });
    };

    // Estilos de estado
    const statusName = ticket.status?.name || "Sin estado";
    const statusStyles = {
        "Pendiente a asignación": "bg-yellow-100 text-yellow-700",
        "Asignado": "bg-blue-100 text-blue-700",
        "En Proceso": "bg-blue-100 text-blue-700",
        "Resuelto": "bg-green-100 text-green-700",
        "Cerrado": "bg-gray-100 text-gray-700",
    };
    const styleClass = statusStyles[statusName] || "bg-gray-100 text-gray-700";

    return (
        <AppLayout>
            <Head title={`Gestión de Ticket ${ticket.code}`} />

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                {/* CABECERA */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-full" asChild>
                            <Link href={route('tickets.unassigned')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-zinc-900">
                                    {ticket.code}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${styleClass}`}>
                                    {statusName}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white font-bold"
                            onClick={() => setOpenReasignar(true)}
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            {ticket.assigned_user ? "Reasignar Técnico" : "Asignar Técnico"}
                        </Button>

                        {statusName !== 'Cerrado' && (
                            <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto font-bold"
                                onClick={() => setOpenCerrar(true)}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Cerrar Ticket
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Descripción del Problema */}
                        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4 text-zinc-900 border-b pb-2">
                                {ticket.subject}
                            </h2>
                            <div className="text-zinc-700 whitespace-pre-wrap bg-zinc-50 p-4 rounded-lg border border-zinc-100 text-sm leading-relaxed">
                                {ticket.message}
                            </div>
                        </div>

                        {/* ========================================== */}
                        {/* BITÁCORA DE NOTAS INTERNAS (DEL TÉCNICO)   */}
                        {/* ========================================== */}
                        {ticket.histories && ticket.histories.filter(h => h.internal_note).length > 0 && (
                            <div className="bg-yellow-50/50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-yellow-800 uppercase mb-4 flex items-center gap-2 tracking-wider">
                                    <MessageSquare className="w-4 h-4" />
                                    Comunicación Interna Técnica
                                </h3>

                                <div className="space-y-4">
                                    {ticket.histories
                                        .filter(h => h.internal_note)
                                        .map((nota, index) => (
                                            <div key={index} className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm relative">
                                                {/* Etiqueta del Rol */}
                                                <div className="absolute top-4 right-4 text-[10px] font-black px-2 py-0.5 bg-zinc-100 rounded text-zinc-400 uppercase">
                                                    {nota.user?.roles?.[0] || 'Staff'}
                                                </div>

                                                <p className="text-sm text-zinc-700 whitespace-pre-wrap pr-16 leading-snug">
                                                    {nota.internal_note}
                                                </p>

                                                <div className="text-[11px] text-zinc-400 mt-3 flex justify-between items-center border-t border-zinc-50 pt-2 font-medium">
                                                    <span>Autor: <strong className="text-zinc-600">{nota.user?.name || 'Sistema'}</strong></span>
                                                    <span>{new Date(nota.created_at).toLocaleString('es-ES')}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4 text-red-600" /> Solicitante
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium text-zinc-500">Nombre:</span> {ticket.requesting_user?.name || ticket.email}</p>
                                <p><span className="font-medium text-zinc-500">Email:</span> {ticket.email}</p>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-red-600" /> Asignación Actual
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div><span className="text-zinc-500 block mb-1">Departamento:</span> {ticket.department?.name || 'N/A'}</div>
                                <div><span className="text-zinc-500 block mb-1">Técnico:</span> {ticket.assigned_user?.name || 'Sin asignar'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL 1: REASIGNAR TICKET */}
            <Dialog open={openReasignar} onOpenChange={setOpenReasignar}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-blue-600">Configurar Asignación</DialogTitle>
                    </DialogHeader>
                    {/* ... (Contenido del modal de reasignación igual al origen) ... */}
                    <div className="space-y-6 py-4">
                        <div className="border border-zinc-200 rounded-xl p-4 space-y-4">
                            <div className="space-y-1">
                                <Label>Departamento</Label>
                                <Select value={dept} onValueChange={(val) => { setDept(val); setDiv(""); setAssignData("department_id", val); }}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Técnico asignado</Label>
                                <Select value={assignData.assigned_user} onValueChange={val => setAssignData("assigned_user", val)}>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                    <SelectContent>
                                        {tecnicos.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Prioridad</Label>
                                    <Select value={assignData.priority_id} onValueChange={val => setAssignData("priority_id", val)}>
                                        <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                        <SelectContent>
                                            {priorities.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Plan SLA</Label>
                                    <Select value={assignData.sla_plan_id} onValueChange={val => setAssignData("sla_plan_id", val)}>
                                        <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                        <SelectContent>
                                            {slaPlans.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpenReasignar(false)}>Cancelar</Button>
                        <Button onClick={submitReasignar} disabled={processingAssign} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {processingAssign ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Asignación"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL 2: CERRAR TICKET CON NOTA */}
            <Dialog open={openCerrar} onOpenChange={setOpenCerrar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Cerrar Ticket Administrativamente
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCerrar} className="space-y-4 py-4">
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-100">
                            <strong>Atención:</strong> Vas a finalizar este ticket. Los detalles internos quedarán registrados en el historial para auditoría.
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="internal_note">Justificación de Cierre (Nota Interna)</Label>
                            <Textarea
                                id="internal_note"
                                value={closeData.internal_note}
                                onChange={(e) => setCloseData('internal_note', e.target.value)}
                                placeholder="Escribe el motivo por el cual se procede al cierre administrativo..."
                                rows={5}
                                required
                            />
                            {closeErrors.internal_note && <p className="text-sm text-red-500">{closeErrors.internal_note}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpenCerrar(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processingClose} className="bg-red-600 hover:bg-red-700 text-white">
                                {processingClose ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar Cierre"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
