<?php

namespace App\Http\Controllers;

use App\Models\TicketHistory;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Ticket $ticket)
    {
        $ticket->load(['status', 'department', 'assignedUser']);

        $histories = $ticket->histories()
            ->with([
                'user',               
                'previousDepartment', 
                'newDepartment'       
            ])
            ->latest() 
            ->get();

       
        return Inertia::render('ticketHistory/index', [
            'ticket' => $ticket,
            'histories' => $histories
        ]);
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketHistory $ticketHistory)
    {
    
    
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TicketHistory $ticketHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TicketHistory $ticketHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketHistory $ticketHistory)
    {
        //
    }
}
