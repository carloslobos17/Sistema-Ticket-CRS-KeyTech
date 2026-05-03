<?php

namespace App\Http\Controllers;

use App\Enums\ActionTypeEnum;
use App\Http\Requests\StoreTicketRequest;
use App\Models\Department;
use App\Models\Division;
use App\Models\HelpTopic;
use App\Models\Priority;
use App\Models\SlaPlan;
use App\Models\Status;
use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Models\User;
use App\Notifications\NewTicketNotification;
use App\Notifications\TicketAssignedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    /**
     * Display a listing of all tickets (requires view_all_tickets permission).
     */
    public function index()
    {
        if (!auth()->user()->can('view_all_tickets')) {
            abort(403, 'No tienes permiso para ver todos los tickets.');
        }

        $tickets = Ticket::with(['department', 'assignedUser', 'status'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show the form for creating a new ticket (requires create_tickets permission).
     */
    public function create()
    {
        if (!auth()->user()->can('create_tickets')) {
            abort(403, 'No tienes permiso para crear tickets.');
        }

        $departments = Department::all(['id', 'name']);
        $divisions = Division::all(['id', 'name', 'department_id']);
        $helpTopics = HelpTopic::select('id', 'name_topic', 'division_id')->get();

        return Inertia::render('tickets/create', [
            'departments' => $departments,
            'divisions' => $divisions,
            'helpTopics' => $helpTopics,
        ]);
    }

    private function generateTicketCode()
    {
        $prefix = 'TKT';
        $date = Carbon::now()->format('Ymd');
        $lastTicket = Ticket::whereDate('creation_date', Carbon::today())->orderBy('id', 'desc')->first();
        $sequence = $lastTicket ? intval(substr($lastTicket->code, -4)) + 1 : 1;
        return sprintf('%s-%s-%04d', $prefix, $date, $sequence);
    }


    /**
     * Store a newly created ticket (requires create_tickets permission).
     */


    public function store(StoreTicketRequest $request)
    {
        $validated = $request->validated();


        $helpTopic = HelpTopic::with(['priority', 'slaPlan'])->findOrFail($validated['help_topic_id']);


        $statusOpen = Status::where('name', 'Pendiente a asignación')->firstOrFail();


        $code = $this->generateTicketCode();


        $creationDate = Carbon::now();


        $ticket = Ticket::create([
            'code'            => $code,
            'creation_date'   => $creationDate,
            'email'           => Auth::user()->email,
            'subject'         => $validated['subject'],
            'message'         => $validated['message'],
            'attach'          => null,
            'expiration_date' => null,
            'closing_date'    => null,
            'requesting_user' => Auth::id(),
            'assigned_user'   => null,
            'help_topic_id'   => $helpTopic->id,
            'priority_id'     => null,
            'sla_plan_id'     => null,
            'department_id'   => $validated['department_id'],
            'status_id'       => $statusOpen->id,
        ]);


        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->storeAs(
                    "tickets/{$ticket->id}",
                    Str::random(40) . '.' . $file->getClientOriginalExtension(),
                    'public'
                );
                $ticket->attachments()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        $department = Department::with('heads')->find($ticket->department_id);
        if ($department && $department->heads->count()) {
            foreach ($department->heads as $head) {
                $head->notify(new NewTicketNotification($ticket));
            }
        }

        return redirect()->route('tickets.my')
            ->with('success', 'Ticket creado correctamente. El jefe del departamento lo asignará.');
    }
    /**
     * Display the specified ticket (requires view_all_tickets permission).
     */
    public function show(Ticket $ticket)
    {
        $user = auth()->user();

        // 1. ¿Tiene permiso para ver todos los tickets? (Admins)
        $canViewAll = $user->can('view_all_tickets');

        // 2. ¿Es su propio ticket? (Usuarios normales)
        $isOwnTicket = $user->can('view_own_tickets') && $ticket->requesting_user === $user->id;

        // 3. ¿Es el técnico asignado? (Agentes)
        $isAssignedAgent = $ticket->assigned_user === $user->id;

        // Si no cumple NINGUNA de las 3 condiciones, bloqueamos el acceso
        if (!$canViewAll && !$isOwnTicket && !$isAssignedAgent) {
            abort(403, 'No tienes permiso para ver este ticket.');
        }

        $ticket->load([
            'department',
            'helpTopic.division', // <-- El cambio está aquí
            'status',
            'priority',
            'assignedUser',
            'ticketSolutions.solutionType',
            'ticketSolutions.attachments',
            'histories',       // <--- NUEVO
            'histories.user'
        ]);

        return Inertia::render('tickets/show', [
            'ticket' => $ticket
        ]);
    }

    /**
     * Display tickets of the authenticated user (requires view_own_tickets permission).
     */
    public function myTickets()
    {
        if (!auth()->user()->can('view_own_tickets')) {
            abort(403, 'No tienes permiso para ver tus tickets.');
        }

        $tickets = Ticket::with(['department', 'assignedUser', 'status'])
            ->where('requesting_user', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Display unassigned tickets (requires assign_tickets permission).
     */
    public function unassigned()
    {
        if (!auth()->user()->can('assign_tickets')) {
        abort(403, 'No tienes permiso para ver tickets pendientes de asignación.');
        }

        $user = auth()->user();
        $departmentId = $user->department_id;

        // Consulta base: Cargamos la relación 'status'
        $query = Ticket::with(['department', 'helpTopic.division', 'priority', 'requestingUser', 'status', 'assignedUser'])
            ->orderBy('creation_date', 'asc')
            ->whereHas('status', function($q) {
            $q->where('name', '!=', 'Cerrado');
        });

        if (!$user->hasRole('superadmin')) {
            $query->where('department_id', $departmentId);
        }

        // ELIMINAMOS: ->whereNull('assigned_user') para que permanezcan en la lista
        $tickets = $query->get();

        // Obtener técnicos
        $tecnicosQuery = User::role('agent');
        if (!$user->hasRole('superadmin')) {
            $tecnicosQuery->where('department_id', $departmentId);
        }
        $tecnicos = $tecnicosQuery->get(['id', 'name']);

        return Inertia::render('tickets/unassigned', [
            'tickets' => $tickets,
            'tecnicos' => $tecnicos,
            'departments' => Department::all(['id', 'name']),
            'divisions' => Division::all(['id', 'name', 'department_id']),
            'helpTopics'  => HelpTopic::all(['id', 'name_topic', 'division_id']),
            'slaPlans'    => SlaPlan::all(['id', 'name']),
            'priorities'  => Priority::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {

        $validated = $request->validate(
            [
                'department_id'  => 'required|exists:departments,id',
                'help_topic_id'  => 'required|exists:help_topics,id',
                'sla_plan_id'    => 'required|exists:sla_plans,id',
                'priority_id'    => 'required|exists:priorities,id',
                'assigned_user'  => 'required|exists:users,id',
            ],
            [
                'sla_plan_id.required'    => 'El plan SLA es obligatorio.',
                'priority_id.required'    => 'La prioridad es obligatoria.',
                'assigned_user.required'  => 'El técnico asignado es obligatorio.'
            ]
        );

        $validated['status_id'] = Status::where('name', 'Asignado')->firstOrFail()->id;

        if (!empty($validated['sla_plan_id'])) {
            $slaPlan = SlaPlan::findOrFail($validated['sla_plan_id']);
            $validated['expiration_date'] = Carbon::parse($ticket->creation_date)
                ->addHours($slaPlan->grace_time_hours);
        }

        $ticket->update($validated);

        return redirect()->back()->with('success', 'Ticket actualizado correctamente');
    }

    /**
     * Cancela un ticket si aún está pendiente de asignación.
     */
    public function cancel(Ticket $ticket)
    {
        // 1. Verificar que el ticket pertenezca al usuario autenticado
        if ($ticket->requesting_user !== auth()->id()) {
            abort(403, 'No puedes cancelar un ticket que no te pertenece.');
        }

        // 2. Verificar que el estado actual sea "Pendiente a asignación"
        if ($ticket->status->name !== 'Pendiente a asignación') {
            return redirect()->back()->with('error', 'Solo puedes cancelar tickets que aún no han sido asignados.');
        }

        // 3. Buscar el estado de "Cancelado" o "Cerrado" (Ajusta el nombre según tu BD)
        // Si en tu BD lo llamas "Cerrado" en lugar de "Cancelado", cambia la palabra abajo:
        $statusCancelado = \App\Models\Status::where('name', 'Cancelado')->first();

        if (!$statusCancelado) {
            // Fallback por si no tienes el estado "Cancelado" creado en BD
            $statusCancelado = \App\Models\Status::where('name', 'Cerrado')->firstOrFail();
        }

        // 4. Actualizar el ticket
        $ticket->update([
            'status_id' => $statusCancelado->id,
            'closing_date' => now(), // Registramos cuándo se cerró/canceló
        ]);

        return redirect()->route('tickets.my')->with('success', 'Tu ticket ha sido cancelado exitosamente.');
    }

    /**
     * Cierra el ticket y guarda la calificación del usuario.
     */
    public function close(Request $request, Ticket $ticket)
    {
        // 1. Validar que el ticket le pertenece a quien intenta cerrarlo
        if ($ticket->requesting_user !== auth()->id()) {
            abort(403, 'No tienes permiso para cerrar este ticket.');
        }

        // 2. Validar que vengan los datos desde el modal de React
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // 3. Buscar el estado "Cerrado"
        $statusCerrado = \App\Models\Status::where('name', 'Cerrado')->first();

        if (!$statusCerrado) {
            return redirect()->back()->with('error', 'El estado "Cerrado" no existe en la base de datos.');
        }

        // 4. Actualizar el ticket
        $ticket->update([
            'status_id' => $statusCerrado->id,
            'closing_date' => now(),

            // NOTA: Si en tu tabla 'tickets' creaste columnas para la calificación,
            // descomenta las siguientes dos líneas para guardar los datos:
            // 'rating' => $validated['rating'],
            // 'user_comment' => $validated['comment'],
        ]);

        // Si tienes una tabla de historial, podrías registrar el cierre aquí.

        return redirect()->back()->with('success', 'Ticket calificado y cerrado exitosamente.');
    }


    public function adminClose(Request $request, Ticket $ticket)
    {
        // 1. Validar permisos (asegúrate de que el usuario tenga permiso para cerrar)
        if (!auth()->user()->can('assign_tickets')) {
            abort(403, 'No tienes permiso para cerrar tickets de esta manera.');
        }

        // 2. Validar la nota interna
        $validated = $request->validate([
            'internal_note' => 'required|string|max:1000',
        ]);

        // 3. Obtener el estado cerrado
        $statusCerrado = Status::where('name', 'Cerrado')->firstOrFail();

        // 4. Iniciar transacción para asegurar que ambos pasos se completen
        DB::beginTransaction();
        try {
            // Actualizar el estado del ticket
            $ticket->update([
                'status_id' => $statusCerrado->id,
                'closing_date' => now(),
            ]);

            // Crear el registro en el historial
            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'user_id' => auth()->id(), // El administrador/asignador que está cerrando
                'action_type' => ActionTypeEnum::STATUS_CHANGED, // O usa tu ActionTypeEnum si aplica
                'internal_note' => $validated['internal_note'],
                'previous_department' => $ticket->department_id,
                'assigned_user' => $ticket->assigned_user, // El técnico que estaba asignado (si lo había)
            ]);

            DB::commit();

            return redirect()->route('tickets.unassigned')->with('success', 'Ticket cerrado exitosamente y nota agregada al historial.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error al cerrar el ticket.');
        }
    }
     public function showAsignador(Ticket $ticket)
    {
        $user = auth()->user();

        // 1. Validar que tenga el permiso de asignador
        if (!$user->can('assign_tickets')) {
            abort(403, 'No tienes permiso para gestionar asignaciones.');
        }

        // 2. Si no es superadmin, validar que el ticket sea de su departamento
        if (!$user->hasRole('superadmin') && $ticket->department_id !== $user->department_id) {
            abort(403, 'Este ticket no pertenece a tu departamento.');
        }

        // 3. Cargar las relaciones necesarias
        $ticket->load(['department', 'helpTopic.division', 'priority', 'requestingUser', 'status', 'assignedUser']);

        // 4. Obtener técnicos del departamento
        $tecnicosQuery = \App\Models\User::role('agent');
        if (!$user->hasRole('superadmin')) {
            $tecnicosQuery->where('department_id', $user->department_id);
        }

        return Inertia::render('tickets/showAsignador', [
            'ticket'      => $ticket,
            'tecnicos'    => $tecnicosQuery->get(['id', 'name']),
            'departments' => \App\Models\Department::all(['id', 'name']),
            'divisions'   => \App\Models\Division::all(['id', 'name', 'department_id']),
            'helpTopics'  => \App\Models\HelpTopic::all(['id', 'name_topic', 'division_id']),
            'slaPlans'    => \App\Models\SlaPlan::all(['id', 'name']),
            'priorities'  => \App\Models\Priority::all(['id', 'name']),
        ]);
    }
}
