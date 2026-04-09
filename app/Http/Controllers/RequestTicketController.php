<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RequestTicketService;

class RequestTicketController extends Controller
{
    protected $service;

    public function __construct(RequestTicketService $service)
    {
        $this->service = $service;
    }
    
    public function store (Request $request)
    {
        try{
            $request->validate([
                'user.name' => 'required',
                'user.phone_number' => 'required',
                'user.ext' => 'required',
                'department.name' => 'required',
                'helpTopic.name_topic' => 'required',
                'ticket.email' => 'required|email',
                'ticket.subject' => 'required',
                'ticket.message' => 'required',
                'ticket.attach' => 'nullable'                
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
}
