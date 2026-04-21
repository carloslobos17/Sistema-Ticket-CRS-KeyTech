<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Models\Department;
use App\Models\Division;
use App\Models\HelpTopic;
use App\Models\Priority;
use App\Models\SlaPlan;
use App\Models\Status;
use App\Models\Ticket;
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
     * Display a listing of the resource.
     */
    // app/Http/Controllers/TicketController.php

    public function index()
    {
        $tickets = Ticket::with(['department', 'assignedUser', 'status'])
                        ->orderBy('created_at', 'desc')
                        ->get();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo ticket.
     */
    public function create()
    {
        $departments = Department::all(['id', 'name']);
        $divisions = Division::all(['id', 'name', 'department_id']);
        $helpTopics = HelpTopic::select('id', 'name_topic', 'division_id')->get();

        return Inertia::render('tickets/create', [
            'departments' => $departments,
            'divisions' => $divisions,
            'helpTopics' => $helpTopics,
        ]);
    }

    /**
     * Guarda el ticket en la base de datos.
     */
    // En tu controlador (TicketController)


    public function store(StoreTicketRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $helpTopic = HelpTopic::with(['priority', 'slaPlan'])->findOrFail($validated['help_topic_id']);
            $priority  = $helpTopic->priority;
            $statusOpen = Status::where('name', 'Abierto')->firstOrFail();

            $code = $this->generateTicketCode();
            $creationDate = Carbon::now();

            // Crear el ticket
            $ticket = Ticket::create([
                'code'            => $code,
                'creation_date'   => $creationDate,
                'email'           => Auth::user()->email,
                'subject'         => $validated['subject'],
                'message'         => $validated['message'],
                'expiration_date' => null,
                'closing_date'    => null,
                'requesting_user' => Auth::id(),
                'assigned_user'   => null,
                'help_topic_id'   => $helpTopic->id,
                'priority_id'     => $priority->id,
                'sla_plan_id'     => null,
                'department_id'   => $validated['department_id'],
                'status_id'       => $statusOpen->id,
            ]);

            // Procesar múltiples archivos
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $extension    = $file->getClientOriginalExtension();
                    $newFileName  = Str::random(40) . '.' . $extension;

                    $path = $file->storeAs(
                        "tickets/{$ticket->id}",
                        $newFileName,
                        'public'
                    );

                    $ticket->attachments()->create([
                        'file_name' => $originalName,
                        'file_path' => $path,
                        'file_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            // Disparar evento
            event(new \App\Events\TicketCreated($ticket));

            DB::commit();

            return redirect()->route('tickets.index')->with('success', 'Ticket creado correctamente');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear ticket: ' . $e->getMessage());

            return redirect()->back()->withInput()->with('error', 'Ocurrió un error al crear el ticket. Por favor, inténtelo de nuevo.');
        }
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
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        $ticket->load(['department', 'division', 'helpTopic', 'status', 'priority']);

        return Inertia::render('tickets/show', [
            'ticket' => $ticket
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }
}
