<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RequestTicketService;
use App\Models\Ticket;
use Inertia\Inertia;

class RequestTicketController extends Controller
{
    protected $service;

    public function __construct(RequestTicketService $service)
    {
        $this->service = $service;
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                // 'user.name' => 'required',
                // 'user.phone_number' => 'required',
                // 'user.ext' => 'required',
                // 'department.name' => 'required',
                // 'helpTopic.name_topic' => 'required',
                // 'ticket.email' => 'required|email',
                // 'ticket.subject' => 'required',
                // 'ticket.message' => 'required',
                // 'ticket.attach' => 'nullable'   
                'department_id' => 'required|exists:departments,id',
                'division_id' => 'required|exists:divisions,id',
                'help_topic_id' => 'required|exists:help_topics,id',
                'subject' => 'required',
                'message' => 'required',                             
            ]);

            $ticket = $this->service->save($request->all());

            return response()->json([
                'message' => 'Ticket creado correctamente',
                'data'    => $ticket
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }


    public function preview(Request $request)
    {
        return Inertia::render('tickets/preview', [
            'ticket' => $request->all()
        ]);
    }


    public function show($id)
    {
        $ticket = Ticket::findOrFail($id);

        return Inertia::render('Tickets/Preview', [
            'ticket' => [
                'code' => $ticket->id,
                'status' => $ticket->status,
                'solicitante' => $ticket->user->name,
                'email' => $ticket->user->email,
                'telefono' => $ticket->telefono,
                'area' => $ticket->area,
                'departamento' => $ticket->departamento,
                'division' => $ticket->division,
                'tipo_problema' => $ticket->tipo_problema,
                'prioridad' => $ticket->prioridad,
                'mensaje' => $ticket->descripcion,
                'adjuntos' => $ticket->attachments->map(function ($file) {
                    return [
                        'nombre' => $file->file_name,
                        'url' => asset('storage/' . $file->path)
                    ];
                }),
            ]
        ]);
    }
}
