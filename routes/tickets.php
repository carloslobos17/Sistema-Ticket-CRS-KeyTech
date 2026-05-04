<?php

use App\Http\Controllers\Tickets\TicketController;
use App\Http\Controllers\Tickets\TicketAssignmentController;
use App\Http\Controllers\Tickets\TicketNoteController;
use Illuminate\Support\Facades\Route;



// --- Usuario final ---
Route::get('/mis-tickets', [TicketController::class, 'myTickets'])->name('tickets.my');

// --- Asignador (rutas específicas antes del resource) ---
Route::middleware(['permission:assign_tickets'])->group(function () {
    Route::get('/tickets/pendientes', [TicketAssignmentController::class, 'unassigned'])->name('tickets.unassigned');
    Route::get('/tickets/{ticket}/asignador', [TicketAssignmentController::class, 'showAsignador'])->name('tickets.showAsignador');
    Route::put('/tickets/{ticket}', [TicketAssignmentController::class, 'update'])->name('tickets.update');
    Route::post('/tickets/{ticket}/admin-close', [TicketAssignmentController::class, 'adminClose'])->name('tickets.adminClose');
});

// --- CRUD base (después de las rutas específicas) ---
Route::resource('tickets', TicketController::class)->except(['destroy', 'update']);

// --- Acciones sobre un ticket específico ---
Route::put('/tickets/{ticket}/cancel', [TicketController::class, 'cancel'])->name('tickets.cancel');
Route::post('/tickets/{ticket}/close', [TicketController::class, 'close'])->name('tickets.close');

// --- Notas internas ---
Route::post('/tickets/{ticket}/nota-interna', [TicketNoteController::class, 'store'])->name('tickets.notaInterna');
