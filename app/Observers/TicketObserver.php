<?php

namespace App\Observers;

use App\Enums\ActionTypeEnum;
use App\Models\Ticket;
use App\Models\TicketHistory;
use Illuminate\Support\Facades\Auth;

class TicketObserver
{
    /**
     * Se ejecuta cuando un ticket es creado por primera vez.
     */
    public function created(Ticket $ticket): void
    {
        $this->createHistory($ticket, ActionTypeEnum::CREATED);
    }

    /**
     * Se ejecuta cada vez que se hace un $ticket->save() y hay cambios.
     */
    public function updated(Ticket $ticket): void
    {
        // cambio de estado
        if ($ticket->wasChanged('status_id')) {
            $this->createHistory($ticket, ActionTypeEnum::STATUS_CHANGED, [
                'internal_note' => "Estado cambiado del ID {$ticket->getOriginal('status_id')} al {$ticket->status_id}"
            ]);
        }

        // asignacion de ticket
        if ($ticket->wasChanged('assigned_user')) {
            $this->createHistory($ticket, ActionTypeEnum::ASSIGNED, [
                'assigned_user' => $ticket->assigned_user,
            ]);
        }

        // cambio de departamento
        if ($ticket->wasChanged('department_id')) {
            $this->createHistory($ticket, ActionTypeEnum::DEPARTMENT_TRANSFERRED, [
                'previous_department' => $ticket->getOriginal('department_id'),
                'new_department'      => $ticket->department_id,
            ]);
        }
    }

    /**
     * Método privado para centralizar la creación del historial.
     */
    private function createHistory(Ticket $ticket, ActionTypeEnum $action, array $data = []): void
    {
        TicketHistory::create(array_merge([
            'ticket_id'   => $ticket->id,
            'user_id'     => Auth::id() ?? $ticket->requesting_user ?? 1,
            'action_type' => $action,
        ], $data));
    }
}